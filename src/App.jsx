import { useState } from 'react';
import './App.css';
import { scenarios, personalityOptions } from './constants/scenarios';
import { NEGOTIATION_MODE } from './constants/negotiationConstants';
import { NegotiationApi } from './services/NegotiationApi';
import { NegotiationArenaPanel } from './components/NegotiationArenaPanel';

function App() {
  const [selectedMode, setSelectedMode] = useState(NEGOTIATION_MODE.SIMULATION);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [agentPersonalities, setAgentPersonalities] = useState({});
  const [humanRole, setHumanRole] = useState(null);
  const [ready, setReady] = useState(false);
  const [negotiationState, setNegotiationState] = useState(null);

  const scenario = selectedScenario ? scenarios[selectedScenario] : null;

  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setAgentPersonalities({});
    setHumanRole(null);
    setReady(false);
    setNegotiationState(null);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setReady(false);
    setNegotiationState(null);
  };

  const handlePersonalityChange = (agentName, personality) => {
    setAgentPersonalities((previous) => ({
      ...previous,
      [agentName]: personality,
    }));
    setReady(false);
    setNegotiationState(null);
  };

  const allPersonalitiesSelected =
    scenario &&
    scenario.agents.every(
      (agent) => agentPersonalities[agent.name] || agentPersonalities[agent.id]
    );

  const isSetupComplete =
    allPersonalitiesSelected &&
    (selectedMode === NEGOTIATION_MODE.SIMULATION || (selectedMode === NEGOTIATION_MODE.PRACTICE && humanRole));

  // Start Negotiation
  const handleStart = () => {
    if (isSetupComplete && scenario) {
      try {
        const state = NegotiationApi.createNegotiation(
          scenario,
          agentPersonalities,
          selectedMode,
          humanRole
        );
        setNegotiationState(state);
        setReady(true);
      } catch (err) {
        console.error('Failed to create negotiation:', err);
      }
    }
  };

  const handleReset = () => {
    setReady(false);
    setNegotiationState(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <p className="eyebrow">AI DRIVEN MULTI-AGENT SIMULATOR</p>
          <h1>NegoForge Platform</h1>
          <p className="subtitle">
            Train, simulate, and practice multi-agent business negotiations powered by Generative AI personas.
          </p>
        </div>
      </header>

      <main>
        {/* STEP 1 - MODE SELECTION */}
        <section className="section">
          <div className="section-heading">
            <div className="step-badge">01</div>
            <div>
              <h2>Select Operating Mode</h2>
              <p>Choose whether to observe autonomous AI agents or participate directly as a negotiating stakeholder.</p>
            </div>
          </div>

          <div className="mode-grid">
            <button
              className={`mode-card ${selectedMode === NEGOTIATION_MODE.SIMULATION ? 'selected-simulation' : ''}`}
              onClick={() => handleModeChange(NEGOTIATION_MODE.SIMULATION)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '1.8rem' }}>🤖</div>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  READY
                </span>
              </div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '1.2rem', color: '#f1f5f9' }}>AI vs AI</h3>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, marginBottom: '8px' }}>Autonomous Simulation</div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#a8b3c7', lineHeight: '1.5' }}>
                Watch two AI agents negotiate automatically.
              </p>
            </button>

            <button
              className={`mode-card ${selectedMode === NEGOTIATION_MODE.PRACTICE ? 'selected-practice' : ''}`}
              onClick={() => handleModeChange(NEGOTIATION_MODE.PRACTICE)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '1.8rem' }}>👤</div>
                <span style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid #8b5cf6',
                  color: '#8b5cf6',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  READY
                </span>
              </div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '1.2rem', color: '#f1f5f9' }}>AI vs Human</h3>
              <div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '8px' }}>Practice Mode</div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#a8b3c7', lineHeight: '1.5' }}>
                Take control of one negotiating agent and interact with the AI.
              </p>
            </button>
          </div>
        </section>

        {/* STEP 2 - SCENARIO SELECTION */}
        <section className="section">
          <div className="section-heading">
            <div className="step-badge">02</div>
            <div>
              <h2>Select a Scenario</h2>
              <p>Choose from three pre-built industry negotiation scenario templates.</p>
            </div>
          </div>

          <div className="scenario-grid">
            {Object.entries(scenarios).map(([id, item]) => (
              <button
                key={id}
                className={`scenario-card ${selectedScenario === id ? 'selected' : ''}`}
                onClick={() => handleScenarioSelect(id)}
              >
                <div>
                  <div className="scenario-icon">
                    {id === 'vendor' ? '🛒' : id === 'job' ? '💼' : '📊'}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="select-text">
                  {selectedScenario === id ? '✓ Selected' : 'Select Scenario →'}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 3 - AGENT CONFIGURATION & HUMAN ROLE SELECTION */}
        {scenario && (
          <section className="section">
            <div className="section-heading">
              <div className="step-badge">03</div>
              <div>
                <h2>Agent Persona & Role Configuration</h2>
                <p>Configure persona traits and goals for <strong>{scenario.title}</strong>.</p>
              </div>
            </div>

            {/* If Practice Mode: Human Role Picker */}
            {selectedMode === NEGOTIATION_MODE.PRACTICE && (
              <div style={{
                background: '#111827', border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: '16px', padding: '20px', marginBottom: '24px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#8b5cf6', fontWeight: 700 }}>
                  👤 Select Your Persona Role in Practice Mode
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {scenario.agents.map((ag) => {
                    const agId = ag.id || ag.name;
                    const isSelected = humanRole === agId;
                    return (
                      <button
                        key={agId}
                        type="button"
                        onClick={() => setHumanRole(agId)}
                        style={{
                          padding: '14px 18px', borderRadius: '12px',
                          background: isSelected ? 'rgba(139, 92, 246, 0.25)' : '#0f172a',
                          border: `2px solid ${isSelected ? '#8b5cf6' : '#263248'}`,
                          boxShadow: isSelected ? '0 0 14px rgba(139, 92, 246, 0.2)' : 'none',
                          color: '#f1f5f9', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '1.05rem', color: '#f1f5f9', marginBottom: '4px' }}>
                          {ag.name} {isSelected ? '✓ (YOUR ROLE)' : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: isSelected ? '#f1f5f9' : '#a8b3c7', fontWeight: 400 }}>
                          Role: {ag.role} | Goal: {ag.goal}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="agent-grid">
              {scenario.agents.map((agent, index) => {
                const agentId = agent.id || agent.name;
                const isHumanControlled = selectedMode === NEGOTIATION_MODE.PRACTICE && humanRole === agentId;

                return (
                  <div
                    className="agent-card"
                    key={agent.name}
                    style={{
                      borderColor: isHumanControlled ? '#8b5cf6' : undefined,
                      boxShadow: isHumanControlled ? '0 0 16px rgba(139, 92, 246, 0.18)' : undefined
                    }}
                  >
                    <div className="agent-header">
                      <div className="agent-number">0{index + 1}</div>
                      <div>
                        <h3>
                          {agent.name} {isHumanControlled ? '👤 (YOU)' : '🤖 (AI)'}
                        </h3>
                        <span>{agent.role}</span>
                      </div>
                    </div>

                    <div className="agent-info">
                      <div className="info-item">
                        <label>GOAL</label>
                        <p>{agent.goal}</p>
                      </div>

                      <div className="info-item">
                        <label>CONSTRAINT</label>
                        <p>{agent.constraint}</p>
                      </div>
                    </div>

                    <div className="personality">
                      <label htmlFor={`personality-${index}`}>PERSONALITY STRATEGY</label>
                      <select
                        id={`personality-${index}`}
                        value={agentPersonalities[agent.name] || ''}
                        onChange={(event) =>
                          handlePersonalityChange(agent.name, event.target.value)
                        }
                      >
                        <option value="" disabled>Select personality</option>
                        {personalityOptions.map((personality) => (
                          <option key={personality} value={personality}>
                            {personality}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 4 - READY TO START */}
        {scenario && !ready && (
          <section className="ready-section">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div className="step-badge">04</div>
                <h2 style={{ margin: 0 }}>Ready to Launch Negotiation?</h2>
              </div>
              <p>
                {selectedMode === NEGOTIATION_MODE.PRACTICE && !humanRole
                  ? 'Select your participant role in Step 03 above to complete setup.'
                  : selectedMode === NEGOTIATION_MODE.PRACTICE
                  ? 'All agents configured. Launch into Practice Arena to negotiate against the AI persona.'
                  : 'All agent personalities configured. Launch Autonomous Simulation Arena.'}
              </p>
            </div>

            <button
              className="start-button"
              onClick={handleStart}
              disabled={!isSetupComplete}
            >
              {isSetupComplete ? 'Launch Negotiation Arena →' : 'Complete Setup Above'}
            </button>
          </section>
        )}

        {/* SUCCESS CARD & LIVE ARENA */}
        {ready && negotiationState && (
          <>
            <section className="success-card">
              <div className="success-icon">✓</div>
              <div>
                <p className="success-label">
                  SESSION INITIALIZED • {selectedMode === NEGOTIATION_MODE.PRACTICE ? 'PRACTICE MODE (AI VS HUMAN)' : 'AUTONOMOUS SIMULATION (AI VS AI)'}
                </p>
                <h2>Negotiation Arena Active</h2>
                <p>
                  {selectedMode === NEGOTIATION_MODE.PRACTICE
                    ? `Interactive practice active. You are negotiating as ${humanRole} against the AI counterpart.`
                    : 'Autonomous multi-agent simulation running automatically between AI personas.'}
                </p>
              </div>

              <div className="selected-agents">
                {scenario.agents.map((agent) => (
                  <div key={agent.name}>
                    <strong>{agent.name} {selectedMode === NEGOTIATION_MODE.PRACTICE && humanRole === (agent.id || agent.name) ? '(YOU)' : ''}</strong>
                    <span>{agentPersonalities[agent.name]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="section engine-section" style={{ marginTop: '30px' }}>
              <NegotiationArenaPanel
                state={negotiationState}
                onStateChange={setNegotiationState}
                onReset={handleReset}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;