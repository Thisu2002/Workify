import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login', {
                email, password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userDetails', JSON.stringify(res.data.userDetails));
            if (res.data.role === 'mentor') navigate('/mentor-dashboard');
            else if (res.data.role === 'candidate') navigate('/candidate-dashboard');
            else if (res.data.role === 'admin') navigate('/admin-dashboard');
            else if (res.data.role === 'lead_panelist') navigate('/panelist-dashboard');
            else if (res.data.role === 'recruiter') navigate('/recruiter-dashboard');
            else if (res.data.role === 'business_manager') navigate('/manager-dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
