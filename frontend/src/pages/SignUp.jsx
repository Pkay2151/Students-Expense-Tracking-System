import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create an account');
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
            <h1 className="title">Create Account</h1>
            <p className="subtitle">Start Your financial Journey today</p>
            
            {error && <div style={{ backgroundColor: '#ffe4e6', color: '#e11d48', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <Input 
                id="name" label="Name:" type="text" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required 
              />
              <Input 
                id="email" label="Email:" type="email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
              />
              <Input 
                id="password" label="Password:" type="password" 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required 
              />
              <Input 
                id="confirmPassword" label="Confirm Password:" type="password" 
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required 
              />

              <div className="mt-40">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Log In</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
