import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import logo from '../images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userDetails', JSON.stringify(res.data.userDetails));

      const roleRoutes = {
        mentor: '/mentor-dashboard',
        candidate: '/candidate-dashboard',
        admin: '/admin-dashboard',
        lead_panelist: '/panelist-dashboard',
        recruiter: '/recruiter-dashboard',
        business_manager: '/manager-dashboard',
      };

      navigate(roleRoutes[res.data.role] || '/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='left-side'>
          <img src={logo} alt='Workify Logo' className='logo' />
        </div>
        <div className='right-side'>
          <h1 className='login-title'>Login</h1>
          <form onSubmit={handleLogin} className='login-form'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              required
            />
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
            <a href='#' className='forgot-password'>
              Forgot password?
            </a>
            <Button
              type='submit'
              variant='contained'
              sx={{
                borderRadius: '20px',
                backgroundColor: '#96bec5',
                color: '#0F2445',
                marginTop: '20px',
                padding: '10px 30px',
                textTransform: 'none',
                fontSize: '16px',
              }}
            >
              Login
            </Button>
            <p>Don't have an account? <a href='/signup' className='signup-link'>Signup</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
