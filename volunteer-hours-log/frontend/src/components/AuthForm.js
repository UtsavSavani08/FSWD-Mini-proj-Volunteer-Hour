import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthForm = ({ isLogin = true }) => {
  const navigate = useNavigate();
  const { login, register, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { username, email, password, confirmPassword } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if (!email || !password) {
      return setFormError('Please fill in all required fields');
    }
    
    if (!isLogin && !username) {
      return setFormError('Username is required');
    }
    
    if (!isLogin && password !== confirmPassword) {
      return setFormError('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ username, email, password });
      }
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="card">
        <h2 className="text-center">{isLogin ? 'Login' : 'Register'}</h2>
        
        {(formError || error) && (
          <div className="alert alert-danger">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="my-1 text-center">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register</Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;