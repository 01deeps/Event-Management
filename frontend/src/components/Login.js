import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { toast } from 'react-toastify';

const Login = ({ setAuthToken, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', formData);
      setAuthToken(res.data.token);  
      onSuccess();
    } catch (err) {
      console.error(err.response.data);
      toast.error('Login failed');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          type='text'
          placeholder='Username'
          name='username'
          value={username}
          className='username'
          onChange={onChange}
          required
        />
      </div>
      <div className='align'>
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={password}
          className='pswrd'
          onChange={onChange}
          required
        />
      </div>
      <input className='log' type='submit' value='Login' />
    </form>
  );
};

export default Login;
