import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // We'll re-add this for completeness
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Original inline styles */}
        <style>{`
          .form-container { display: flex; flex-direction: column; max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
          .form-container h2 { text-align: center; }
          .form-container input { margin-bottom: 15px; padding: 10px; font-size: 16px; }
          .form-container button { padding: 10px; font-size: 16px; background-color: #007bff; color: white; border: none; cursor: pointer; }
          .form-container button:hover { background-color: #0056b3; }
          .error-message { color: red; margin-bottom: 15px; }
        `}</style>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;