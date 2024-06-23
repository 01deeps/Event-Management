import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Events from './components/Event';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  const toggleForm = () => setShowLogin(!showLogin);

  const handleLogout = () => {
    setAuthToken('');
    toast.success('Logged out successfully');
  };

  return (
    <div className='App'>
      <ToastContainer autoClose={1000} />
      {!authToken ? (
        <div>
          {showLogin ? (
            <div>
              <h2 style={{ paddingTop: '180px' }}>LOGIN</h2>
              <Login setAuthToken={setAuthToken} onSuccess={() => toast.success('Login successful')} />
              <p>
                Don't have an account? <button style={{ borderRadius: '5px' }} onClick={toggleForm}>Register</button>
              </p>
            </div>
          ) : (
            <div>
              <h2 style={{ paddingTop: '180px' }}>REGISTER</h2>
              <Register setAuthToken={setAuthToken} onSuccess={() => toast.success('Registration successful')} />
              <p>
                Already have an account? <button style={{ borderRadius: '5px' }} onClick={toggleForm}>Login</button>
              </p>
            </div>
          )}
        </div>
      ) : (
        <Events authToken={authToken} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
