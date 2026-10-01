import React, { useState, useEffect } from 'react';

const DIGIT_COLORS = [
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#ef4444', '#f97316', '#14b8a6', '#a855f7'
];

export const OtpBubblePopGame = ({ targetOtp, currentOtp, onOtpChange, onComplete, onCancel }) => {
  const [bubbles, setBubbles] = useState([]);
  const [poppedToast, setPoppedToast] = useState(null);
  const [useKeypad, setUseKeypad] = useState(false);

  // Initialize 10 floating digit bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      digit: i,
      color: DIGIT_COLORS[i],
      size: 68, // Extra large easy-to-tap target
      top: Math.floor(15 + (i % 5) * 36), // spread vertically
      left: Math.floor(8 + Math.random() * 75), // spread horizontally
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      popped: false,
    }));
    setBubbles(initialBubbles);
  }, []);

  // Float animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          let newLeft = b.left + b.speedX * 0.4;
          let newTop = b.top + b.speedY * 0.4;
          let newSpeedX = b.speedX;
          let newSpeedY = b.speedY;

          if (newLeft < 4 || newLeft > 85) newSpeedX = -newSpeedX;
          if (newTop < 8 || newTop > 72) newSpeedY = -newSpeedY;

          return {
            ...b,
            left: newLeft,
            top: newTop,
            speedX: newSpeedX,
            speedY: newSpeedY,
          };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Handle Bubble Pop Click
  const handlePop = (digit) => {
    setPoppedToast(`🎈 Popped Digit ${digit}!`);
    setTimeout(() => setPoppedToast(null), 1500);

    if (currentOtp.length < 6) {
      const nextOtp = currentOtp + digit.toString();
      onOtpChange(nextOtp);
      if (nextOtp.length === 6) {
        onComplete(nextOtp);
      }
    }
  };

  // Auto-Pop Next Digit
  const handleAutoPopNext = () => {
    if (currentOtp.length >= 6) return;
    const nextDigit = parseInt(targetOtp[currentOtp.length], 10);
    handlePop(nextDigit);
  };

  // Keypad Click Handlers
  const handleKeypadClick = (numStr) => {
    if (currentOtp.length < 6) {
      const nextOtp = currentOtp + numStr;
      onOtpChange(nextOtp);
      if (nextOtp.length === 6) {
        onComplete(nextOtp);
      }
    }
  };

  const handleKeypadBackspace = () => {
    if (currentOtp.length > 0) {
      onOtpChange(currentOtp.slice(0, -1));
    }
  };

  const nextTargetDigit = currentOtp.length < 6 ? parseInt(targetOtp[currentOtp.length], 10) : null;

  return (
    <div className="bubble-game-container">
      {/* HUD Header */}
      <div className="game-hud-bar">
        <div className="target-otp-pill">
          <span className="hud-label-lg">SMS OTP CODE:</span>
          <span className="target-code-lg">{targetOtp}</span>
        </div>

        <div className="game-toggle-buttons">
          <button
            type="button"
            className={`mode-toggle-btn ${!useKeypad ? 'active' : ''}`}
            onClick={() => setUseKeypad(false)}
          >
            🎈 Bubble Pop Arcade
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${useKeypad ? 'active' : ''}`}
            onClick={() => setUseKeypad(true)}
          >
            🔢 Standard Keypad
          </button>
        </div>
      </div>

      {/* 6-Digit Large OTP Display */}
      <div className="otp-display-row-xl">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const char = currentOtp[idx];
          const isMatched = char && targetOtp[idx] === char;
          return (
            <div
              key={idx}
              className={`otp-slot-xl ${char ? 'filled' : ''} ${isMatched ? 'matched' : ''}`}
            >
              {char || ''}
              {!char && <span className="placeholder-dash">_</span>}
            </div>
          );
        })}
      </div>

      {poppedToast && <div className="pop-toast-banner">{poppedToast}</div>}

      {/* Mode 1: Bubble Pop Arcade */}
      {!useKeypad ? (
        <div className="bubble-stage-wrapper">
          <div className="bubble-stage">
            <p className="stage-instruction-lg">
              👇 <strong>Tap any glowing balloon digit</strong> to pop & enter it into your code!
            </p>

            {bubbles.map((b) => {
              const isNextTarget = nextTargetDigit === b.digit;
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`digit-bubble ${isNextTarget ? 'target-pulse' : ''}`}
                  style={{
                    backgroundColor: b.color,
                    top: `${b.top}%`,
                    left: `${b.left}%`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                  }}
                  onClick={() => handlePop(b.digit)}
                >
                  <span className="bubble-number">{b.digit}</span>
                  {isNextTarget && <span className="target-star-badge">NEXT ⭐</span>}
                </button>
              );
            })}
          </div>

          <div className="stage-footer-controls">
            <button type="button" className="btn-auto-pop-lg" onClick={handleAutoPopNext}>
              ⚡ Auto-Pop Next ({targetOtp[currentOtp.length] || 'Done'})
            </button>
            <button type="button" className="btn-clear-otp-lg" onClick={() => onOtpChange('')}>
              🗑️ Clear OTP
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Large Keypad */
        <div className="keypad-container-xl">
          <p className="keypad-hint-lg">Tap numbers to enter your 6-digit code:</p>
          <div className="keypad-grid-xl">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
              <button
                key={item}
                type="button"
                className={`key-btn-xl ${item === 'C' ? 'clear' : item === '⌫' ? 'backspace' : ''}`}
                onClick={() => {
                  if (item === 'C') onOtpChange('');
                  else if (item === '⌫') handleKeypadBackspace();
                  else handleKeypadClick(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="game-footer-row">
        <button type="button" className="btn-back-link-lg" onClick={onCancel}>
          ← Back to Phone Number
        </button>
        {currentOtp.length === 6 && (
          <button
            type="button"
            className="btn-submit-verify-xl"
            onClick={() => onComplete(currentOtp)}
          >
            Verify & Continue →
          </button>
        )}
      </div>
    </div>
  );
};
