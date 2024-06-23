import React, { useState } from 'react';
import axios from 'axios';
import './register.css'; 
import { toast } from 'react-toastify';

const Register = ({ setAuthToken, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });

  

  const [errors, setErrors] = useState({});

  const { username, password, email, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

  const validateUsername = () => {
    if (username.length < 5) {
      setErrors({ ...errors, username: 'Username must be more than 5 characters' });
    } else {
      setErrors({ ...errors, username: '' });
    }
  };

  const validateEmail = () => {
    if (!/^.{5,}@gmail\.com$/.test(email)) {
      setErrors({ ...errors, email: 'Invalid email. Must be at least 5 characters ending with @gmail.com' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const validatePassword = () => {
   
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password)) {
      setErrors({ ...errors, password: 'Password must be at least 6 characters with at least one letter, one number, and one special character' });
    } else {
      setErrors({ ...errors, password: '' });
    }
  };
  

  const onSubmit = async (e) => {
    e.preventDefault();


    validateUsername();
    validateEmail();
    validatePassword();

    
    if (Object.values(errors).some(error => error)) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      const res = await axios.post('/api/users/register', formData);
      setAuthToken(res.data.token);  
      onSuccess();
    } catch (err) {
      console.error(err.response.data);
      toast.error('Registration failed');
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
          className='name'
          onChange={onChange}
          onBlur={validateUsername}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}
      </div>
      <div className='align1'>
        <input
          type='email'
          placeholder='Email'
          name='email'
          value={email}
          className='mail'
          onChange={onChange}
          onBlur={validateEmail}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div className='align2'>
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={password}
          className='pswd'
          onChange={onChange}
          onBlur={validatePassword}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
      <div className='align3'>
        <label htmlFor="role">Role : </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={onChange}
          className='role'
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <input className="reg" type='submit' value='Register' />
    </form>
  );
};

export default Register;
