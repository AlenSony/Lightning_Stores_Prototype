import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aurora from '../assets/Aurora.jsx';
import '../Stylings/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Please enter your name.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setError('');

    try{
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password, name: formData.name };
      
      console.log('Making request to:', `http://localhost:5000${endpoint}`);
      console.log('Request body:', body);
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message);
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      console.log(`${isLogin ? 'Login' : 'Signup'} successful!`);
      navigate('/main');
    }
    catch(error){
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="login-wrapper">
      <Aurora 
        colorStops={['#5227FF', '#00C6FF', '#7cff67']} 
        amplitude={1.2} 
        blend={0.6}
      />
      
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-logo">Novara</h1>
            <p className="login-subtitle">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="login-toggle">
            <button
              onClick={() => setIsLogin(true)}
              className={`toggle-btn ${isLogin ? 'active' : ''}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="login-input"
                />
              </div>
            )}
            
            <div className="form-group">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="login-input"
              />
            </div>
            
            <div className="form-group">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="login-input"
              />
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="login-input"
                />
              </div>
            )}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button type="submit" className="login-submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="toggle-link"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="toggle-link"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;