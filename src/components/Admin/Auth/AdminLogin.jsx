import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import adminImage from '../../../assets/contemporary-house-interior-design.jpg'; 
import '../../../assets/style/loginadmin.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token_admin');
        if (token) {
            navigate('/admin/riads');
        }
    }, [navigate]);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/admin/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 200) {
                localStorage.setItem('token_admin', response.data.token);
                navigate('/admin/listusers');
            } else {
                setError(response.data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('Invalid credentials or server error');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="login-container">
            {/* Full-width image at the top */}
            <div className="login-image">
                <img src={adminImage} alt="Admin Background" className="admin-image"/>
            </div>
            {/* Login form underneath the image */}
            <div className="login-box">
                <div className="login-form-container">
                    <h2 className="login-header">
                        Admin <span>Login</span>
                    </h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="toggle-password"
                                >
                                    
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="submit-button"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
