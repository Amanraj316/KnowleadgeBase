import os
import requests
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.chat_models import ChatOllama # <-- NEW IMPORT

# --- APPLICATION SETUP ---
load_dotenv()
app = FastAPI()

origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocumentRequest(BaseModel):
    storageName: str
    documentId: str

class ChatRequest(BaseModel):
    query: str

qa_chain = None

def initialize_qa_chain():
    global qa_chain
    vector_store_path = "vector_store.faiss"
    if not os.path.exists(vector_store_path):
        print("Vector store not found.")
        return
    try:
        embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        vector_store = FAISS.load_local(vector_store_path, embedding_function, allow_dangerous_deserialization=True)
        
        # --- THIS IS THE ONLY CHANGE ---
        # We are now using Ollama with the "mistral" model you downloaded
        llm = ChatOllama(model="gemma:2b")
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm, chain_type="stuff", retriever=vector_store.as_retriever()
        )
        print("QA Chain initialized successfully with Ollama.")
    except Exception as e:
        print(f"Error initializing QA chain: {e}")

def process_pdf(file_path: str):
    pdf_reader = PdfReader(file_path)
    text = "".join(page.extract_text() for page in pdf_reader.pages)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len)
    chunks = text_splitter.split_text(text=text)
    embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store_path = "vector_store.faiss"
    if os.path.exists(vector_store_path):
        vector_store = FAISS.load_local(vector_store_path, embedding_function, allow_dangerous_deserialization=True)
        vector_store.add_texts(chunks)
        print("Vector store updated.")
    else:
        vector_store = FAISS.from_texts(chunks, embedding=embedding_function)
        print("New vector store created.")
    vector_store.save_local(vector_store_path)

@app.on_event("startup")
async def startup_event():
    initialize_qa_chain()

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}

@app.post("/api/ai/process-document")
async def process_document_endpoint(request: DocumentRequest):
    file_name = request.storageName
    document_id = request.documentId
    node_api_url = os.getenv("NODE_API_URL")
    update_url = f"{node_api_url}/api/documents/{document_id}/status"
    try:
        file_path = os.path.join('..', 'knowledge-query-backend', 'uploads', file_name)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Document file not found.")
        print(f"Processing document: {file_path}")
        process_pdf(file_path)
        initialize_qa_chain()
        print("Processing successful. Updating status to 'ready'.")
        requests.put(update_url, json={"status": "ready"})
        return {"message": f"Document '{file_name}' processed successfully."}
    except Exception as e:
        print(f"An error occurred during processing: {e}")
        requests.put(update_url, json={"status": "error"})
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")

@app.post("/api/ai/chat")
async def chat_with_document(request: ChatRequest):
    global qa_chain
    if qa_chain is None:
        raise HTTPException(status_code=503, detail="QA Chain is not initialized.")
    try:
        query = request.query
        print(f"Received query: {query}")
        result = qa_chain.invoke(query)
        return {"answer": result['result']}
    except Exception as e:
        print("--- DETAILED ERROR TRACEBACK ---")
        print(traceback.format_exc())
        print("---------------------------------")
        raise HTTPException(status_code=500, detail="An internal server error occurred. Check the AI service logs for details.")