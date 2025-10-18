import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import DocumentUploader from '../components/DocumentUploader';
import DocumentList from '../components/DocumentList';
import ChatWindow from '../components/ChatWindow';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Your Knowledge Base</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <hr />
      <div style={{ display: 'flex', marginTop: '20px', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
          <h2>Upload & Manage Documents</h2>
          <DocumentUploader />
          <hr style={{ margin: '20px 0' }} />
          <DocumentList />
        </div>
        <div style={{ flex: 2, border: '1px solid #ccc', padding: '20px' }}>
          <h2>Chat with your AI</h2>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;