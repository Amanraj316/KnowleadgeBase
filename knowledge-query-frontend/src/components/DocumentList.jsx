import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDocuments } from '../store/documentSlice';
import axios from 'axios';

const StatusBadge = ({ status }) => {
  const statusClasses = {
    processing: 'bg-yellow-500/20 text-yellow-300',
    ready: 'bg-green-500/20 text-green-300',
    error: 'bg-red-500/20 text-red-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const DocumentList = () => {
  const dispatch = useDispatch();
  const { items: documents, status } = useSelector((state) => state.documents);
  const { userToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/documents/${docId}`, { headers: { 'x-auth-token': userToken } });
      dispatch(fetchDocuments());
    } catch (error) {
      alert('Failed to delete document.');
    }
  };
  
  if (status === 'loading') return <p className="text-center text-gray-400">Loading documents...</p>;

  return (
    <div className="flex-1 overflow-y-auto">
      <h4 className="text-md font-semibold mb-2">Your Files</h4>
      {documents.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc._id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors">
              <span className="truncate text-sm mr-2">{doc.originalName}</span>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <StatusBadge status={doc.status} />
                <button onClick={() => handleDelete(doc._id)} className="text-gray-400 hover:text-red-400">&times;</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;