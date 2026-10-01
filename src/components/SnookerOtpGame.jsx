import React, { useEffect, useRef, useState } from 'react';

// Ball colors mapping for numbers 0-9
const BALL_COLORS = {
  0: { bg: '#f8fafc', text: '#0f172a', name: 'White 0' },
  1: { bg: '#f59e0b', text: '#ffffff', name: 'Yellow 1' },
  2: { bg: '#10b981', text: '#ffffff', name: 'Green 2' },
  3: { bg: '#d97706', text: '#ffffff', name: 'Brown 3' },
  4: { bg: '#3b82f6', text: '#ffffff', name: 'Blue 4' },
  5: { bg: '#ec4899', text: '#ffffff', name: 'Pink 5' },
  6: { bg: '#ef4444', text: '#ffffff', name: 'Red 6' },
  7: { bg: '#1e293b', text: '#ffffff', name: 'Black 7' },
  8: { bg: '#06b6d4', text: '#ffffff', name: 'Cyan 8' },
  9: { bg: '#8b5cf6', text: '#ffffff', name: 'Purple 9' },
};

export const SnookerOtpGame = ({ targetOtp, currentOtp, onOtpChange, onComplete, onCancel }) => {
  const canvasRef = useRef(null);
  const [hoveredBall, setHoveredBall] = useState(null);
  const [pottedMessage, setPottedMessage] = useState(null);
  const [useKeypad, setUseKeypad] = useState(false);

  // Canvas size constants
  const WIDTH = 700;
  const HEIGHT = 380;
  const BALL_RADIUS = 18; // Increased for better visibility & interaction
  const POCKET_RADIUS = 32; // Increased for effortless pocketing
  const FRICTION = 0.985;

  // Pocket positions
  const pockets = [
    { x: 30, y: 30 },
    { x: WIDTH / 2, y: 20 },
    { x: WIDTH - 30, y: 30 },
    { x: 30, y: HEIGHT - 30 },
    { x: WIDTH / 2, y: HEIGHT - 20 },
    { x: WIDTH - 30, y: HEIGHT - 30 },
  ];

  // Game state stored in ref for animation loop
  const gameStateRef = useRef({
    cueBall: { x: 180, y: HEIGHT / 2, vx: 0, vy: 0, radius: BALL_RADIUS, color: '#ffffff' },
    balls: [],
    particles: [],
    isMoving: false,
    hoverPos: null,
  });

  // Initialize balls on table
  const initBalls = () => {
    const newBalls = [];
    const startX = 460;
    const startY = HEIGHT / 2;
    const spacing = BALL_RADIUS * 2 + 4;

    const layout = [
      [0],
      [1, 2],
      [3, 4, 5],
      [6, 7, 8, 9]
    ];

    layout.forEach((row, rowIndex) => {
      const rowX = startX + rowIndex * spacing * 0.866;
      const rowStartY = startY - ((row.length - 1) * spacing) / 2;
      row.forEach((num, colIndex) => {
        newBalls.push({
          number: num,
          x: rowX,
          y: rowStartY + colIndex * spacing,
          vx: 0,
          vy: 0,
          radius: BALL_RADIUS,
          color: BALL_COLORS[num].bg,
          textColor: BALL_COLORS[num].text,
          potted: false,
        });
      });
    });

    gameStateRef.current.cueBall = {
      x: 180,
      y: HEIGHT / 2,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      color: '#ffffff',
    };
    gameStateRef.current.balls = newBalls;
    gameStateRef.current.particles = [];
  };

  useEffect(() => {
    initBalls();
  }, []);

  // Handle Ball Potting Event
  const handleBallPotted = (num) => {
    setPottedMessage(`🎱 Potted Ball ${num}!`);
    setTimeout(() => setPottedMessage(null), 2500);

    if (currentOtp.length < 6) {
      const nextOtp = currentOtp + num.toString();
      onOtpChange(nextOtp);
      if (nextOtp.length === 6) {
        onComplete(nextOtp);
      }
    }
  };

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updatePhysics = () => {
      const state = gameStateRef.current;
      const cue = state.cueBall;
      const allBalls = [cue, ...state.balls.filter((b) => !b.potted)];

      let moving = false;

      // Update positions & friction
      allBalls.forEach((ball) => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        ball.vx *= FRICTION;
        ball.vy *= FRICTION;

        if (Math.abs(ball.vx) < 0.05) ball.vx = 0;
        if (Math.abs(ball.vy) < 0.05) ball.vy = 0;

        if (ball.vx !== 0 || ball.vy !== 0) moving = true;

        // Cushion Bounces
        const marginX = 26;
        const marginY = 26;

        if (ball.x - ball.radius < marginX) {
          ball.x = marginX + ball.radius;
          ball.vx = -ball.vx * 0.85;
        }
        if (ball.x + ball.radius > WIDTH - marginX) {
          ball.x = WIDTH - marginX - ball.radius;
          ball.vx = -ball.vx * 0.85;
        }
        if (ball.y - ball.radius < marginY) {
          ball.y = marginY + ball.radius;
          ball.vy = -ball.vy * 0.85;
        }
        if (ball.y + ball.radius > HEIGHT - marginY) {
          ball.y = HEIGHT - marginY - ball.radius;
          ball.vy = -ball.vy * 0.85;
        }
      });

      // Pocket Collisions
      pockets.forEach((p) => {
        allBalls.forEach((ball) => {
          if (ball.potted) return;
          const dx = ball.x - p.x;
          const dy = ball.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < POCKET_RADIUS) {
            if (ball === cue) {
              ball.x = 180;
              ball.y = HEIGHT / 2;
              ball.vx = 0;
              ball.vy = 0;
            } else {
              ball.potted = true;
              ball.vx = 0;
              ball.vy = 0;
              // Particles
              for (let i = 0; i < 14; i++) {
                state.particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: ball.color,
                  life: 1.0,
                });
              }
              handleBallPotted(ball.number);
            }
          }
        });
      });

      // Ball Collisions
      for (let i = 0; i < allBalls.length; i++) {
        for (let j = i + 1; j < allBalls.length; j++) {
          const b1 = allBalls[i];
          const b2 = allBalls[j];
          if (b1.potted || b2.potted) continue;

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist && dist > 0) {
            const overlap = 0.5 * (minDist - dist);
            const nx = dx / dist;
            const ny = dy / dist;

            b1.x -= nx * overlap;
            b1.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;

            b1.vx -= p * nx;
            b1.vy -= p * ny;
            b2.vx += p * nx;
            b2.vy += p * ny;
          }
        }
      }

      // Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      state.isMoving = moving;
    };

    const renderCanvas = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const state = gameStateRef.current;

      // Table Rail
      ctx.fillStyle = '#26140a';
      ctx.beginPath();
      ctx.roundRect(0, 0, WIDTH, HEIGHT, 16);
      ctx.fill();

      // Table Felt (Rich Green)
      ctx.fillStyle = '#0b5229';
      ctx.beginPath();
      ctx.roundRect(14, 14, WIDTH - 28, HEIGHT - 28, 12);
      ctx.fill();

      // Cushion Inner Line
      ctx.strokeStyle = '#043016';
      ctx.lineWidth = 4;
      ctx.strokeRect(26, 26, WIDTH - 52, HEIGHT - 52);

      // Baulk Line & D-zone
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(180, 26);
      ctx.lineTo(180, HEIGHT - 26);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(180, HEIGHT / 2, 55, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.stroke();

      // Pockets
      pockets.forEach((p) => {
        ctx.fillStyle = '#05070d';
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // Numbered Balls
      state.balls.forEach((ball) => {
        if (ball.potted) return;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight ring if hovered
        if (hoveredBall && hoveredBall.number === ball.number) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Gloss
        const grad = ctx.createRadialGradient(
          ball.x - 4,
          ball.y - 4,
          1,
          ball.x,
          ball.y,
          ball.radius
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.7)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // LARGE BOLD NUMBER TEXT
        ctx.fillStyle = ball.textColor;
        ctx.font = '900 16px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ball.number.toString(), ball.x, ball.y + 0.5);
      });

      // Cue Ball
      const cue = state.cueBall;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.arc(cue.x + 3, cue.y + 3, cue.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cue.color;
      ctx.beginPath();
      ctx.arc(cue.x, cue.y, cue.radius, 0, Math.PI * 2);
      ctx.fill();

      const cueGrad = ctx.createRadialGradient(
        cue.x - 4,
        cue.y - 4,
        1,
        cue.x,
        cue.y,
        cue.radius
      );
      cueGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
      cueGrad.addColorStop(0.6, 'rgba(255,255,255,0)');
      ctx.fillStyle = cueGrad;
      ctx.beginPath();
      ctx.arc(cue.x, cue.y, cue.radius, 0, Math.PI * 2);
      ctx.fill();

      // Aim Line to Hovered Ball or Target
      if (hoveredBall && !state.isMoving) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(cue.x, cue.y);
        ctx.lineTo(hoveredBall.x, hoveredBall.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Particles
      state.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
    };

    const loop = () => {
      updatePhysics();
      renderCanvas();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredBall, currentOtp]);

  // Effortless Click/Tap Interaction: Direct Ball Click Pots the Ball!
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (WIDTH / rect.width);
    const clickY = (e.clientY - rect.top) * (HEIGHT / rect.height);

    // Check if clicked directly on or near a numbered ball
    const clickedBall = gameStateRef.current.balls.find((b) => {
      if (b.potted) return false;
      const dx = b.x - clickX;
      const dy = b.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) <= BALL_RADIUS * 1.8;
    });

    if (clickedBall) {
      // Launch cue ball directly at clicked ball with high power to pot it!
      const cue = gameStateRef.current.cueBall;
      const dx = clickedBall.x - cue.x;
      const dy = clickedBall.y - cue.y;
      const angle = Math.atan2(dy, dx);

      cue.vx = Math.cos(angle) * 22;
      cue.vy = Math.sin(angle) * 22;
    } else {
      // Shoot cue ball towards click position
      const cue = gameStateRef.current.cueBall;
      const dx = clickX - cue.x;
      const dy = clickY - cue.y;
      const angle = Math.atan2(dy, dx);

      cue.vx = Math.cos(angle) * 18;
      cue.vy = Math.sin(angle) * 18;
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const moveX = (e.clientX - rect.left) * (WIDTH / rect.width);
    const moveY = (e.clientY - rect.top) * (HEIGHT / rect.height);

    const hovered = gameStateRef.current.balls.find((b) => {
      if (b.potted) return false;
      const dx = b.x - moveX;
      const dy = b.y - moveY;
      return Math.sqrt(dx * dx + dy * dy) <= BALL_RADIUS * 1.8;
    });

    setHoveredBall(hovered || null);
  };

  // Helper: Pot Next Digit Automatically
  const handleAutoPotNext = () => {
    if (currentOtp.length >= 6) return;
    const nextDigit = parseInt(targetOtp[currentOtp.length], 10);
    handleBallPotted(nextDigit);
  };

  // Keypad Handlers
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

  return (
    <div className="snooker-otp-container">
      {/* Game Header HUD */}
      <div className="snooker-hud">
        <div className="snooker-target-badge">
          <span className="hud-label">DEMO SMS OTP CODE:</span>
          <span className="target-code-display">{targetOtp}</span>
        </div>

        <div className="snooker-mode-toggle">
          <button
            className={`hud-tab-btn ${!useKeypad ? 'active' : ''}`}
            onClick={() => setUseKeypad(false)}
          >
            🎱 Tap-To-Pot Game
          </button>
          <button
            className={`hud-tab-btn ${useKeypad ? 'active' : ''}`}
            onClick={() => setUseKeypad(true)}
          >
            🔢 Keypad
          </button>
        </div>
      </div>

      {/* 6-Digit OTP Scoreboard Slots */}
      <div className="otp-slots-row">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const char = currentOtp[idx];
          const isTargetMatched = char && targetOtp[idx] === char;
          return (
            <div
              key={idx}
              className={`otp-slot ${char ? 'filled' : ''} ${isTargetMatched ? 'matched' : ''}`}
            >
              {char || ''}
              {!char && <span className="slot-placeholder">_</span>}
            </div>
          );
        })}
      </div>

      {pottedMessage && <div className="potted-toast">{pottedMessage}</div>}

      {/* Main Mode Content */}
      {!useKeypad ? (
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="snooker-canvas"
          />

          <div className="canvas-instruction-bar">
            <span className="instruction-text">
              👉 <strong>Tap any numbered ball directly</strong> to shoot & pot it into the OTP slot!
            </span>
            <div className="canvas-actions">
              <button type="button" className="btn-auto-pot" onClick={handleAutoPotNext}>
                ⚡ Auto-Pot Next ({targetOtp[currentOtp.length] || 'Done'})
              </button>
              <button type="button" className="btn-rack" onClick={initBalls}>
                🔄 Reset Table
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback Keypad View */
        <div className="keypad-grid-container">
          <p className="keypad-hint">Tap numbers to enter your 6-digit verification code:</p>
          <div className="keypad-grid">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
              <button
                key={item}
                type="button"
                className={`keypad-key ${item === 'C' ? 'clear-key' : item === '⌫' ? 'backspace-key' : ''}`}
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

      {/* Action Row */}
      <div className="snooker-footer-actions">
        <button type="button" className="btn-secondary-link" onClick={onCancel}>
          ← Change Phone Number
        </button>
        {currentOtp.length === 6 && (
          <button
            type="button"
            className="btn-verify-submit"
            onClick={() => onComplete(currentOtp)}
          >
            Verify & Continue →
          </button>
        )}
      </div>
    </div>
  );
};
