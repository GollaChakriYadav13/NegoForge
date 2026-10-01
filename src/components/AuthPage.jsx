import React, { useState, useEffect } from 'react';
import { OtpBubblePopGame } from './OtpBubblePopGame';

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

  // Phone input handler enforcing max 10 digits
  const handlePhoneInputChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    if (errorMsg) setErrorMsg('');
  };

  // Submit Phone Number Form with STRICT 10-Digit Validation
  const handlePhoneSubmit = (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      setErrorMsg(`Phone number must be exactly 10 digits (e.g. 9876543210). You entered ${phoneNumber.length} digit(s).`);
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
      <div className="auth-card-xl">
        {/* Auth Brand Header */}
        <div className="auth-brand-xl">
          <div className="auth-badge-xl">⚡ NegoForge Auth</div>
          <h1>{authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}</h1>
          <p className="auth-subtitle-xl">Multi-Agent Platform • Phone OTP Verification</p>
        </div>

        {/* Tab Switcher */}
        {step === 'phone' && (
          <div className="auth-tabs-xl">
            <button
              className={`auth-tab-xl ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg('');
              }}
            >
              Sign Up
            </button>
            <button
              className={`auth-tab-xl ${authMode === 'login' ? 'active' : ''}`}
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
        {errorMsg && <div className="auth-error-banner-xl">⚠️ {errorMsg}</div>}

        {/* STEP 1: Phone Details Input Form */}
        {step === 'phone' && (
          <form className="auth-form-xl" onSubmit={handlePhoneSubmit}>
            {authMode === 'signup' && (
              <>
                <div className="form-group-xl">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-xl">
                  <label htmlFor="email">Work Email (Optional)</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group-xl">
              <div className="label-with-counter">
                <label htmlFor="phone">10-Digit Mobile Phone Number</label>
                <span className={`digit-counter ${phoneNumber.length === 10 ? 'complete' : ''}`}>
                  {phoneNumber.length} / 10 Digits
                </span>
              </div>

              <div className="phone-input-group-xl">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-select-xl"
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
                  placeholder="9876543210"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={handlePhoneInputChange}
                  required
                />
              </div>
              <p className="field-hint-xl">
                Strict 10-digit mobile number requirement (e.g. 9876543210)
              </p>
            </div>

            <button type="submit" className="auth-submit-btn-xl">
              Send SMS Verification Code 📱
            </button>
          </form>
        )}

        {/* STEP 2: Bubble Pop Arcade OTP Verification */}
        {step === 'otp' && (
          <div className="otp-step-container">
            {/* Simulated SMS Toast */}
            <div className="sms-simulated-notification-xl">
              <div className="sms-icon-xl">💬</div>
              <div className="sms-body-xl">
                <strong>Simulated SMS Received:</strong>
                <p>
                  Your verification code is <strong>{generatedOtp}</strong>. Pop the balloon digits below!
                </p>
              </div>
            </div>

            <OtpBubblePopGame
              targetOtp={generatedOtp}
              currentOtp={enteredOtp}
              onOtpChange={setEnteredOtp}
              onComplete={handleVerifyOtp}
              onCancel={() => setStep('phone')}
            />

            <div className="resend-row-xl">
              {resendTimer > 0 ? (
                <span className="timer-text-xl">Resend code available in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  className="btn-resend-link-xl"
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
          <div className="auth-success-state-xl">
            <div className="success-pulse-ring-xl">✓</div>
            <h2>Authentication Successful!</h2>
            <p>Welcome to NegoForge Platform, {fullName || 'User'}. Launching arena...</p>
          </div>
        )}
      </div>
    </div>
  );
};
