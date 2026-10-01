import React, { useEffect, useRef, useState } from 'react';

// Ball colors mapping for numbers 0-9
const BALL_COLORS = {
  0: { bg: '#e2e8f0', text: '#0f172a', name: 'White 0' },
  1: { bg: '#f59e0b', text: '#ffffff', name: 'Yellow 1' },
  2: { bg: '#10b981', text: '#ffffff', name: 'Green 2' },
  3: { bg: '#b45309', text: '#ffffff', name: 'Brown 3' },
  4: { bg: '#3b82f6', text: '#ffffff', name: 'Blue 4' },
  5: { bg: '#ec4899', text: '#ffffff', name: 'Pink 5' },
  6: { bg: '#ef4444', text: '#ffffff', name: 'Red 6' },
  7: { bg: '#1e293b', text: '#ffffff', name: 'Black 7' },
  8: { bg: '#06b6d4', text: '#ffffff', name: 'Cyan 8' },
  9: { bg: '#8b5cf6', text: '#ffffff', name: 'Purple 9' },
};

export const SnookerOtpGame = ({ targetOtp, currentOtp, onOtpChange, onComplete, onCancel }) => {
  const canvasRef = useRef(null);
  const [aiming, setAiming] = useState(false);
  const [dragPos, setDragPos] = useState(null);
  const [isShooting, setIsShooting] = useState(false);
  const [pottedMessage, setPottedMessage] = useState(null);
  const [useKeypad, setUseKeypad] = useState(false);

  // Canvas size constants
  const WIDTH = 680;
  const HEIGHT = 360;
  const BALL_RADIUS = 13;
  const POCKET_RADIUS = 24;
  const FRICTION = 0.982;

  // Pocket positions
  const pockets = [
    { x: 30, y: 30 },
    { x: WIDTH / 2, y: 22 },
    { x: WIDTH - 30, y: 30 },
    { x: 30, y: HEIGHT - 30 },
    { x: WIDTH / 2, y: HEIGHT - 22 },
    { x: WIDTH - 30, y: HEIGHT - 30 },
  ];

  // Game state stored in ref for fast animation loop access
  const gameStateRef = useRef({
    cueBall: { x: 180, y: HEIGHT / 2, vx: 0, vy: 0, radius: BALL_RADIUS, color: '#ffffff' },
    balls: [],
    particles: [],
    isMoving: false,
  });

  // Initialize balls on table
  const initBalls = () => {
    const newBalls = [];
    // Rack position (triangle/diamond formation on right side)
    const startX = 460;
    const startY = HEIGHT / 2;
    const spacing = BALL_RADIUS * 2 + 2;

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

        // Cushion Bounces (Margins offset by rails)
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
              // Scratch! Reset Cue Ball
              ball.x = 180;
              ball.y = HEIGHT / 2;
              ball.vx = 0;
              ball.vy = 0;
              setPottedMessage('⚠️ Scratch! Cue ball potted.');
              setTimeout(() => setPottedMessage(null), 2000);
            } else {
              ball.potted = true;
              ball.vx = 0;
              ball.vy = 0;
              // Add particle splash
              for (let i = 0; i < 12; i++) {
                state.particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: ball.color,
                  life: 1.0,
                });
              }
              handleBallPotted(ball.number);
            }
          }
        });
      });

      // Ball-to-Ball Collisions
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
            // Overlap resolution
            const overlap = 0.5 * (minDist - dist);
            const nx = dx / dist;
            const ny = dy / dist;

            b1.x -= nx * overlap;
            b1.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            // Elastic velocity transfer
            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2; // Equal mass

            b1.vx -= p * nx;
            b1.vy -= p * ny;
            b2.vx += p * nx;
            b2.vy += p * ny;
          }
        }
      }

      // Update Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      state.isMoving = moving;
      setIsShooting(moving);
    };

    const renderCanvas = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const state = gameStateRef.current;

      // 1. Table Outer Wood Rail
      ctx.fillStyle = '#26140a';
      ctx.beginPath();
      ctx.roundRect(0, 0, WIDTH, HEIGHT, 16);
      ctx.fill();

      // 2. Table Felt (Green)
      ctx.fillStyle = '#0a4220';
      ctx.beginPath();
      ctx.roundRect(14, 14, WIDTH - 28, HEIGHT - 28, 12);
      ctx.fill();

      // Inner Cushion Border Line
      ctx.strokeStyle = '#052913';
      ctx.lineWidth = 4;
      ctx.strokeRect(26, 26, WIDTH - 52, HEIGHT - 52);

      // Baulk Line & D-zone
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(180, 26);
      ctx.lineTo(180, HEIGHT - 26);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(180, HEIGHT / 2, 50, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.stroke();

      // 3. Pockets
      pockets.forEach((p) => {
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 4. Numbered Balls
      state.balls.forEach((ball) => {
        if (ball.potted) return;

        // Ball Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball Body
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball Highlight / Gloss
        const grad = ctx.createRadialGradient(
          ball.x - 3,
          ball.y - 3,
          1,
          ball.x,
          ball.y,
          ball.radius
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.6)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball Number Text
        ctx.fillStyle = ball.textColor;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ball.number.toString(), ball.x, ball.y + 0.5);
      });

      // 5. Cue Ball
      const cue = state.cueBall;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.arc(cue.x + 3, cue.y + 3, cue.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cue.color;
      ctx.beginPath();
      ctx.arc(cue.x, cue.y, cue.radius, 0, Math.PI * 2);
      ctx.fill();

      const cueGrad = ctx.createRadialGradient(
        cue.x - 3,
        cue.y - 3,
        1,
        cue.x,
        cue.y,
        cue.radius
      );
      cueGrad.addColorStop(0, 'rgba(255,255,255,0.8)');
      cueGrad.addColorStop(0.6, 'rgba(255,255,255,0)');
      ctx.fillStyle = cueGrad;
      ctx.beginPath();
      ctx.arc(cue.x, cue.y, cue.radius, 0, Math.PI * 2);
      ctx.fill();

      // 6. Aiming Trajectory & Cue Stick (When Dragging)
      if (aiming && dragPos && !state.isMoving) {
        const dx = cue.x - dragPos.x;
        const dy = cue.y - dragPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
          const angle = Math.atan2(dy, dx);

          // Aim Trajectory Dotted Line extending forward
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(cue.x, cue.y);
          ctx.lineTo(cue.x + Math.cos(angle) * 350, cue.y + Math.sin(angle) * 350);
          ctx.stroke();
          ctx.setLineDash([]);

          // Cue Stick graphics drawn behind cue ball
          const pullBack = Math.min(dist, 100);
          const stickStartX = cue.x - Math.cos(angle) * (pullBack + 15);
          const stickStartY = cue.y - Math.sin(angle) * (pullBack + 15);
          const stickEndX = cue.x - Math.cos(angle) * (pullBack + 220);
          const stickEndY = cue.y - Math.sin(angle) * (pullBack + 220);

          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(stickStartX, stickStartY);
          ctx.lineTo(stickEndX, stickEndY);
          ctx.stroke();

          // Cue Tip (White)
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(stickStartX, stickStartY);
          ctx.lineTo(
            cue.x - Math.cos(angle) * (pullBack + 23),
            cue.y - Math.sin(angle) * (pullBack + 23)
          );
          ctx.stroke();
        }
      }

      // 7. Particles
      state.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
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
  }, [aiming, dragPos, currentOtp]);

  // Pointer Events for Cue Aiming & Shooting
  const handlePointerDown = (e) => {
    if (gameStateRef.current.isMoving) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (HEIGHT / rect.height);

    setAiming(true);
    setDragPos({ x, y });
  };

  const handlePointerMove = (e) => {
    if (!aiming) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (HEIGHT / rect.height);

    setDragPos({ x, y });
  };

  const handlePointerUp = (e) => {
    if (!aiming || !dragPos) return;

    const cue = gameStateRef.current.cueBall;
    const dx = cue.x - dragPos.x;
    const dy = cue.y - dragPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 8) {
      const angle = Math.atan2(dy, dx);
      const power = Math.min(dist * 0.22, 22);

      cue.vx = Math.cos(angle) * power;
      cue.vy = Math.sin(angle) * power;
    }

    setAiming(false);
    setDragPos(null);
  };

  // Helper: Pot Next Digit Automatically (for rapid testing / assistance)
  const handleAutoPotNext = () => {
    if (currentOtp.length >= 6) return;
    const nextDigit = parseInt(targetOtp[currentOtp.length], 10);

    // Find ball and pot it directly
    const targetBall = gameStateRef.current.balls.find((b) => b.number === nextDigit && !b.potted);
    if (targetBall) {
      targetBall.potted = true;
      handleBallPotted(nextDigit);
    } else {
      // Re-pot digit even if ball was already potted
      handleBallPotted(nextDigit);
    }
  };

  // Helper: Keypad Number Click
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
            🎱 Snooker Table
          </button>
          <button
            className={`hud-tab-btn ${useKeypad ? 'active' : ''}`}
            onClick={() => setUseKeypad(true)}
          >
            🔢 Keypad Input
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
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="snooker-canvas"
          />

          <div className="canvas-instruction-bar">
            <span>🖱️ <strong>Pull back cue stick</strong> from the White Cue Ball to aim & pot the target numbers!</span>
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
