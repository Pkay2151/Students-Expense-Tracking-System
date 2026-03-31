import React, { useEffect, useState } from 'react';
import { User as UserIcon, Mail, BadgeCheck, Calendar, Shield, Edit2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { apiRequest } from '../utils/api';
import './Dashboard.css';
import './User.css';

function User() {
  const { currentUser } = useAuth();
  const [userRole] = useState('Student');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const storedTwoFactor = localStorage.getItem(`twoFactorEnabled:${currentUser.uid}`);
    const storedNotifications = localStorage.getItem(`emailNotificationsEnabled:${currentUser.uid}`);

    if (storedTwoFactor !== null) {
      setTwoFactorEnabled(storedTwoFactor === 'true');
    }

    let isMounted = true;

    apiRequest('/profile', { user: currentUser })
      .then((savedProfile) => {
        if (!isMounted) return;
        setProfile(savedProfile);
        setEmailNotificationsEnabled(Boolean(savedProfile?.preferences?.receiveBudgetAlerts));
      })
      .catch(() => {
        if (!isMounted) return;
        if (storedNotifications !== null) {
          setEmailNotificationsEnabled(storedNotifications === 'true');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  const saveSetting = (key, value) => {
    if (currentUser?.uid) {
      localStorage.setItem(`${key}:${currentUser.uid}`, String(value));
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUser?.email) {
      setStatusMessage({ type: 'error', text: 'No email found for this account.' });
      return;
    }

    setIsSendingReset(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setStatusMessage({
        type: 'success',
        text: `Password reset link sent to ${currentUser.email}.`
      });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Could not send password reset email. Please try again.'
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleToggleTwoFactor = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    saveSetting('twoFactorEnabled', next);
    setStatusMessage({
      type: 'success',
      text: next ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.'
    });
  };

  const handleToggleNotifications = async () => {
    const next = !emailNotificationsEnabled;
    const previous = emailNotificationsEnabled;
    setEmailNotificationsEnabled(next);

    try {
      const savedProfile = await apiRequest('/profile', {
        user: currentUser,
        method: 'PUT',
        body: {
          preferences: {
            receiveBudgetAlerts: next,
          },
        },
      });

      setProfile(savedProfile);
      saveSetting('emailNotificationsEnabled', next);
      setStatusMessage({
        type: 'success',
        text: next ? 'Email notifications enabled.' : 'Email notifications muted.'
      });
    } catch {
      setEmailNotificationsEnabled(previous);
      setStatusMessage({
        type: 'error',
        text: 'Could not update notification preference. Please try again.'
      });
    }
  };

  const displayName = profile?.fullName || currentUser?.displayName || 'Student User';
  const displayEmail = profile?.email || currentUser?.email || 'Not provided';
  const displayCurrency = profile?.currency || 'GHS';

  const initials = displayName
    ? displayName.charAt(0).toUpperCase()
    : (displayEmail ? displayEmail.charAt(0).toUpperCase() : 'U');

  const createdDate = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Not available';

  return (
    <div className="page-wrapper">
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>User Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your account settings and personal information</p>
        </div>
        <button className="icon-btn edit-profile-btn" title="Edit Profile">
          <Edit2 size={20} />
        </button>
      </header>

      <div className="profile-grid">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {initials}
          </div>
          <div className="profile-header-info">
            <h2>{displayName}</h2>
            <div className="role-badge">
              <BadgeCheck size={16} />
              <span>{userRole}</span>
            </div>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="profile-info-grid">
          {/* Email Card */}
          <div className="profile-info-card">
            <div className="info-card-header">
              <div className="info-card-icon email">
                <Mail size={20} />
              </div>
              <h3>Email Address</h3>
            </div>
            <p className="info-card-value">{displayEmail}</p>
            <span className="info-card-label">Your primary contact email</span>
          </div>

          <div className="profile-info-card">
            <div className="info-card-header">
              <div className="info-card-icon role">
                <BadgeCheck size={20} />
              </div>
              <h3>Preferred Currency</h3>
            </div>
            <p className="info-card-value">{displayCurrency}</p>
            <span className="info-card-label">Saved to your backend profile</span>
          </div>

          {/* Role Card */}
          <div className="profile-info-card">
            <div className="info-card-header">
              <div className="info-card-icon role">
                <Shield size={20} />
              </div>
              <h3>Account Role</h3>
            </div>
            <p className="info-card-value">{userRole}</p>
            <span className="info-card-label">Your account type and permissions</span>
          </div>

          {/* User ID Card */}
          <div className="profile-info-card">
            <div className="info-card-header">
              <div className="info-card-icon user-id">
                <UserIcon size={20} />
              </div>
              <h3>User ID</h3>
            </div>
            <p className="info-card-value" title={currentUser?.uid}>{currentUser?.uid ? currentUser.uid.substring(0, 16) + '...' : 'Not available'}</p>
            <span className="info-card-label">Your unique identifier</span>
          </div>

          {/* Account Created Card */}
          <div className="profile-info-card">
            <div className="info-card-header">
              <div className="info-card-icon created">
                <Calendar size={20} />
              </div>
              <h3>Account Created</h3>
            </div>
            <p className="info-card-value">{createdDate}</p>
            <span className="info-card-label">Member since</span>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="account-settings-section">
          <h3 style={{ marginBottom: '16px', fontWeight: '700' }}>Account Settings</h3>
          {statusMessage.text && (
            <div className={`setting-status ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}
          <div className="settings-options">
            <div className="setting-item">
              <div className="setting-info">
                <p className="setting-title">Password</p>
                <span className="setting-desc">Send a password reset link to your account email</span>
              </div>
              <button className="btn-secondary" onClick={handlePasswordChange} disabled={isSendingReset}>
                {isSendingReset ? 'Sending...' : 'Change'}
              </button>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <p className="setting-title">Two-Factor Authentication</p>
                <span className="setting-desc">Enhance your account security ({twoFactorEnabled ? 'Enabled' : 'Disabled'})</span>
              </div>
              <button className="btn-secondary" onClick={handleToggleTwoFactor}>
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <p className="setting-title">Email Notifications</p>
                <span className="setting-desc">Manage notification preferences ({emailNotificationsEnabled ? 'Enabled' : 'Muted'})</span>
              </div>
              <button className="btn-secondary" onClick={handleToggleNotifications}>
                {emailNotificationsEnabled ? 'Mute' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
