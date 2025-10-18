import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../store/documentSlice';

const DocumentUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': userToken },
      };
      await axios.post('http://localhost:5001/api/documents/upload', formData, config);
      dispatch(fetchDocuments());
      setFile(null); 
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
         <input 
          id="file-upload"
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
        />
      </div>
      <button onClick={handleUpload} disabled={uploading || !file} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default DocumentUploader;