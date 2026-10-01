import React, { useState, useEffect } from 'react';
import { SnookerOtpGame } from './SnookerOtpGame';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

export const AuthPage = ({ onAuthenticate }) => {
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Handle Resend Timer
  useEffect(() => {
    let timer;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Generate 6-Digit OTP
  const triggerOtpGeneration = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setResendTimer(30);
    setErrorMsg('');
    setStep('otp');
  };

  // Submit Phone Number Form
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number (at least 7 digits).');
      return;
    }
    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setErrorMsg('');
    triggerOtpGeneration();
  };

  // Verify OTP
  const handleVerifyOtp = (otpValue) => {
    const finalOtp = otpValue || enteredOtp;
    if (finalOtp === generatedOtp) {
      setErrorMsg('');
      setStep('success');

      // Create authenticated user profile
      const user = {
        name: authMode === 'signup' ? fullName : `User (${phoneNumber.slice(-4)})`,
        email: email || `${phoneNumber}@negoforge.com`,
        phone: `${countryCode} ${phoneNumber}`,
        authenticatedAt: new Date().toISOString(),
      };

      setTimeout(() => {
        onAuthenticate(user);
      }, 1200);
    } else {
      setErrorMsg('Invalid OTP code. Please check the target code and try again.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Auth Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-badge">⚡ NegoForge Auth</div>
          <h2>{authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}</h2>
          <p>Multi-Agent Negotiation Platform • Secure Phone Authentication</p>
        </div>

        {/* Tab Switcher */}
        {step === 'phone' && (
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg('');
              }}
            >
              Sign Up
            </button>
            <button
              className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
            >
              Log In
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && <div className="auth-error-banner">⚠️ {errorMsg}</div>}

        {/* STEP 1: Phone Details Input Form */}
        {step === 'phone' && (
          <form className="auth-form" onSubmit={handlePhoneSubmit}>
            {authMode === 'signup' && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Work Email (Optional)</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="phone">Phone Number for Verification</label>
              <div className="phone-input-group">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-select"
                >
                  {COUNTRY_CODES.map((item, idx) => (
                    <option key={idx} value={item.code}>
                      {item.flag} {item.code} ({item.country})
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  type="tel"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Send SMS Verification Code 📱
            </button>
          </form>
        )}

        {/* STEP 2: Snooker OTP Verification */}
        {step === 'otp' && (
          <div className="otp-step-container">
            {/* Simulated SMS Toast */}
            <div className="sms-simulated-notification">
              <div className="sms-icon">💬</div>
              <div className="sms-body">
                <strong>Simulated SMS Received:</strong>
                <p>
                  Your NegoForge verification OTP code is <strong>{generatedOtp}</strong>. Pot these numbers on the snooker table below!
                </p>
              </div>
            </div>

            <SnookerOtpGame
              targetOtp={generatedOtp}
              currentOtp={enteredOtp}
              onOtpChange={setEnteredOtp}
              onComplete={handleVerifyOtp}
              onCancel={() => setStep('phone')}
            />

            <div className="resend-row">
              {resendTimer > 0 ? (
                <span className="timer-text">Resend code available in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  className="btn-resend-link"
                  onClick={triggerOtpGeneration}
                >
                  🔄 Resend Verification Code
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Verification Success */}
        {step === 'success' && (
          <div className="auth-success-state">
            <div className="success-pulse-ring">✓</div>
            <h3>Authentication Successful!</h3>
            <p>Welcome to NegoForge Platform, {fullName || 'User'}. Redirecting to arena...</p>
          </div>
        )}
      </div>
    </div>
  );
};
