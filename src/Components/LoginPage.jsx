import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aurora from '../assets/Aurora.jsx';

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

  const handleSubmit = (e) => {
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
    // 在实际应用中，这里会有API调用来验证用户凭据
    console.log(`${isLogin ? 'Login' : 'Signup'} successful! (Demo)`);
    navigate('/main');
  };

  return (
    <div style={{ 
      width: '100vw',
      height: '100vh', 
      backgroundColor: 'black', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Aurora 
        colorStops={['#5227FF', '#00C6FF', '#7cff67']} 
        amplitude={1.2} 
        blend={0.6}
      />
      
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          maxWidth: '450px',
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ 
              color: 'rgba(32, 32, 32, 1)', 
              fontSize: '32px', 
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Lightning Stores
            </h1>
            <p style={{ 
              color: 'rgba(32, 32, 32, 0.7)', 
              fontSize: '16px',
              margin: 0
            }}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '30px'
          }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: isLogin ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'rgba(32, 32, 32, 1)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: !isLogin ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'rgba(32, 32, 32, 1)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid rgb(0, 0, 0)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(32, 32, 32, 1)',
                  fontSize: '16px',
                  marginBottom: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            )}
            
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgb(0, 0, 0)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(32, 32, 32, 1)',
                fontSize: '16px',
                marginBottom: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgb(0, 0, 0)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(32, 32, 32, 1)',
                fontSize: '16px',
                marginBottom: !isLogin ? '15px' : '20px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            {!isLogin && (
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid rgb(0, 0, 0)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(32, 32, 32, 1)',
                  fontSize: '16px',
                  marginBottom: '20px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            )}

            {error && (
              <div style={{
                color: '#ff6b6b',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                color: 'rgba(32, 32, 32, 1)',
                border: '1px solid rgba(0, 0, 0, 0.56)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Sign in here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;