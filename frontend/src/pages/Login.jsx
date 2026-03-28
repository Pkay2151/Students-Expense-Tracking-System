import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout-container">
      <div className="auth-form-wrapper">
        <div className="auth-form-card">
          <button className="back-button" onClick={() => navigate('/')} aria-label="Return to Welcome">
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>

          <div className="mt-16">
            <h1 className="title">Welcome Back!</h1>
            <p className="subtitle">Sign in to continue tracking your expenses</p>

            {error && <div style={{ backgroundColor: '#ffe4e6', color: '#e11d48', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <Input 
                id="email" label="Email:" type="email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
              />
              <Input 
                id="password" label="Password:" type="password" 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required 
              />

              <div className="mt-40">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </div>
              
              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Sign Up</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
