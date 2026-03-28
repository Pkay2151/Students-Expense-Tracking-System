import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import Button from '../components/Button';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content-wrapper">
        <div className="welcome-icon-container">
          <Wallet size={50} color="#ffffff" strokeWidth={2.5} />
        </div>

        <img src="/Images/SETS%20LOGO.png" alt="SETS Logo" className="welcome-logo" />
        <h2 className="welcome-subtitle">Students Expense Tracking System</h2>
        <p className="welcome-description">Master Your Student Finances</p>

        <div className="welcome-button-container">
          <Button variant="white" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button variant="outline" onClick={() => navigate('/signup')}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
