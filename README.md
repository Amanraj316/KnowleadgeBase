Knowledge Query AI
A Retrieval-Augmented Generation (RAG) system that transforms static PDF documents into an interactive, intelligent knowledge base. This project leverages vector embeddings and semantic search to allow users to have natural language conversations with their private data.

🧠 Core AI Architecture
At the heart of this application is a dedicated Python AI engine designed for high-performance context retrieval.

Vector Embeddings: Converts document text into high-dimensional vectors to understand semantic meaning, not just keyword matching.

FAISS Indexing: Utilizes Facebook AI Similarity Search (FAISS) for ultra-fast dense vector clustering and retrieval.

Semantic Context Injection: Dynamically fetches relevant document chunks based on user queries to ground the LLM's responses in factual data.

Intelligent Text Splitting: Pre-processes PDFs into optimal context windows to maximize inference accuracy.

🚀 Key Features
🤖 AI & Search
Context-Aware Chat: Answers questions strictly based on uploaded documents to reduce hallucinations.

Similarity Search: Retains memory of document context to answer follow-up questions accurately.

Automated Indexing: Instantaneously updates the vector store when new documents are ingested.

🌐 Supporting Infrastructure
Secure API Gateway (Node.js): Handles authentication, rate limiting, and request orchestration between the client and the AI engine.

Reactive UI (React + Vite): A clean interface for document management and real-time streaming of AI responses.

Document Persistence (MongoDB): Stores metadata and user session history.

🛠️ Tech Stack
AI Engine ( The Core )
Python 3.9+

FAISS (Vector Database)

LangChain (Orchestration)

PyPDF2 (Ingestion)

Sentence-Transformers (Embeddings)

Application Layer
Backend: Node.js, Express, MongoDB (JWT Auth)

Frontend: React, Redux Toolkit, Tailwind/CSS

⚙️ Installation & Setup
1. AI Service Setup (Python)
Start here to ensure the core logic is operational.

Bash
cd knowledge-query-ai

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install AI dependencies
pip install -r requirements.txt

# Start the Vector Engine
python main.py
The AI service runs on port 8000 by default.

2. Backend Gateway (Node.js)
Connects the user to the AI engine.

Bash
cd knowledge-query-backend

# Install dependencies
npm install

Configure Environment
Create a .env file with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/knowledge_base
JWT_SECRET=your_secure_secret
AI_SERVICE_URL=http://localhost:8000

# Start the Gateway
npm run dev
3. Client Interface (React)
Bash
cd knowledge-query-frontend
npm install
npm run dev
🔬 How It Works (The Pipeline)
Ingestion: When a user uploads a PDF via the UI, the Node.js backend passes the file to the Python service.

Vectorization: The Python service cleans the text, chunks it, and generates embeddings.

Indexing: These embeddings are stored in a local FAISS index (/vector_store.faiss).

Inference: When a user asks a question:

The question is embedded into a vector.

FAISS searches for the nearest neighbor vectors (relevant document chunks).

The relevant chunks are passed to the LLM to generate a natural language answer.

🤝 Contributing
Contributions are welcome! We are specifically looking for improvements in:

Optimizing chunking strategies for technical documents.

Testing different embedding models (HuggingFace, OpenAI, Cohere).

Improving FAISS index persistence strategies.
