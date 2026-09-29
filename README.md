# NegoForge

> AI-Driven Multi-Agent Negotiation Training & Simulation Platform

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)

NegoForge is a web-based multi-agent negotiation training and simulation
platform designed to provide realistic and interactive negotiation experiences
using configurable AI agents, negotiation scenarios, personalities, goals,
constraints, offers, counteroffers, concessions, and outcome evaluation.

The platform supports both **AI-vs-AI Simulation Mode** and
**Human-vs-AI Practice Mode**, allowing users to observe, participate in,
and analyze negotiation processes.

---

# Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
  - [High-Level Multi-Tier Architecture](#high-level-multi-tier-architecture)
- [Isolated Computer Science Question Banks](#isolated-computer-science-question-banks)
- [Database Entity Relationship Overview](#database-entity-relationship-overview)
- [Technology Stack](#technology-stack)
- [Negotiation Scenarios](#negotiation-scenarios)
- [Agent Configuration](#agent-configuration)
- [Agent Personalities](#agent-personalities)
- [Negotiation Modes](#negotiation-modes)
- [Negotiation Engine](#negotiation-engine)
- [Negotiation Workflow](#negotiation-workflow)
- [Outcome & Evaluation](#outcome--evaluation)
- [Agile Internship Documentation](#agile-internship-documentation-9-weeks--45-days)
- [Quick Start Guide](#quick-start-guide)
- [Automated Testing & Quality Assurance](#automated-testing--quality-assurance)
- [Project Directory Structure](#project-directory-structure)
- [Project Milestones](#project-milestones)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

# Project Overview

Negotiation is an important part of business operations, procurement, sales,
recruitment, project management, and strategic decision-making.

Traditional negotiation training often depends on human participants,
predefined examples, and limited opportunities for repeated practice.

NegoForge provides an interactive environment where negotiation participants
can be represented by configurable agents with different roles, objectives,
constraints, and personalities.

The platform allows users to configure negotiation scenarios, observe
AI-driven negotiation behavior, participate directly in negotiations, track
offers and concessions, and review the final negotiation outcome.

---

# Key Features

## Multi-Agent Negotiation

NegoForge models negotiation participants as independent agents.

Each agent can have:

- Role
- Goal
- Objective
- Constraints
- Personality
- Negotiation strategy
- Current position
- Negotiation history

Agents interact through offers, counteroffers, acceptances, rejections,
and concessions.

---

## AI-vs-AI Simulation

Simulation Mode allows two AI agents to negotiate automatically.

Users can observe:

- Initial offers
- Counteroffers
- Concessions
- Agent responses
- Negotiation rounds
- Negotiation history
- Final agreement
- Deadlock situations

---

## Human-vs-AI Practice

Practice Mode allows the user to participate as one of the negotiation agents.

The AI responds according to:

- Agent role
- Goal
- Personality
- Constraints
- Previous negotiation history
- Current offer
- Negotiation state

---

## Configurable Agent Personalities

NegoForge supports configurable negotiation personalities:

- Aggressive
- Collaborative
- Risk-Averse

Different personalities influence how agents approach offers,
counteroffers, and concessions.

---

## Offer and Counteroffer Management

The negotiation engine manages:

- Initial offers
- Counteroffers
- Accepted offers
- Rejected offers
- Concessions
- Current negotiation position
- Negotiation history

---

## Five-Round Negotiation Limit

Each negotiation is restricted to a maximum of **5 rounds**.

If the participants cannot reach an agreement within the allowed rounds,
the negotiation can enter a deadlock state and a mediator can be introduced.

---

## Concession Tracking

The system tracks how negotiation positions change throughout the process.

This allows users to observe:

- Initial position
- Current position
- Concessions
- Offer gap
- Negotiation progress

---

## Outcome Screen

After a negotiation is completed, NegoForge presents an Outcome Screen
containing:

- Final agreement
- Number of rounds
- Concession information
- Agent objective satisfaction
- Negotiation result
- Negotiation summary
- Transcript and history

---

# System Architecture

## High-Level Multi-Tier Architecture

NegoForge follows a modular architecture that separates the user interface,
negotiation orchestration, agent decision processing, and outcome evaluation.

### Architecture Flow

```text
                         ┌───────────────────────┐
                         │         USER          │
                         │   Human Negotiator    │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────┐
                    │       REACT FRONTEND        │
                    │                             │
                    │  Scenario Selection         │
                    │  Agent Configuration        │
                    │  Negotiation Arena          │
                    │  Outcome Screen             │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │    NEGOTIATION SERVICES     │
                    │                             │
                    │  Agent Input Creation       │
                    │  Offer Processing           │
                    │  Decision Processing        │
                    │  Concession Calculation     │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │  NEGOTIATION ORCHESTRATOR   │
                    │                             │
                    │  Turn Management            │
                    │  Round Management           │
                    │  State Management           │
                    │  History Management         │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │     AI AGENT     │          │ HUMAN PARTICIPANT│
          │                  │          │                  │
          │ Role             │          │ Offer            │
          │ Goals            │          │ Counteroffer     │
          │ Personality      │          │ Decision         │
          │ Constraints      │          │                  │
          └─────────┬────────┘          └────────┬─────────┘
                    │                            │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │    DECISION PROCESSING      │
                    │                             │
                    │  Accept                     │
                    │  Counter                    │
                    │  Reject                     │
                    │  Concession                 │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      OUTCOME EVALUATION     │
                    │                             │
                    │  Final Agreement            │
                    │  Satisfaction               │
                    │  Concessions                │
                    │  Rounds                     │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │        OUTCOME SCREEN       │
                    │                             │
                    │  Agreement                  │
                    │  Metrics                   │
                    │  Transcript                │
                    │  Summary                   │
                    └─────────────────────────────┘
```

### System Architecture Diagram

The detailed system architecture diagram is available in the repository:

![NegoForge System Architecture](docs/architecture/system-architecture.png)

---

# Isolated Computer Science Question Banks

This section is reserved for the Computer Science question-bank documentation
associated with the project and internship documentation.

If the question-bank file is added to the repository, it can be linked from
this section.

```text
Recommended location:

docs/
└── question-banks/
    └── <question-bank-file>
```

Once the actual file is added, the README can provide a direct link to it.

---

# Database Entity Relationship Overview

This section documents the data relationships associated with the NegoForge
application.

If an Entity Relationship Diagram is available as an SVG or image, it should
be stored in the architecture documentation directory.

```text
Recommended location:

docs/
└── architecture/
    └── database-er-diagram.svg
```

Once the actual ER diagram is added, display it using:

```markdown
![NegoForge Database Entity Relationship Diagram](docs/architecture/database-er-diagram.svg)
```

The ER diagram is maintained separately from the high-level system
architecture so that application architecture and data relationships can be
documented independently.

---

# Technology Stack

## Frontend Technologies

| Technology | Purpose |
|---|---|
| React | User interface development |
| JavaScript | Application logic |
| Vite | Development and build tooling |
| HTML5 | Application structure |
| CSS3 | Styling and responsive interface |

## Application Architecture

| Component | Purpose |
|---|---|
| React Components | Modular user interface |
| Constants | Scenario and application configuration |
| Services | Application and negotiation logic |
| Models | Application data structures |
| Negotiation Orchestrator | Negotiation flow management |
| Decision Services | Offer and decision processing |
| Concession Tracker | Negotiation concession tracking |
| Outcome Evaluation | Negotiation result evaluation |
| LLM Integration Interface | LLM-based reasoning interface |

## Development Tools

| Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| npm | Dependency management |
| Git | Version control |
| GitHub | Repository hosting |
| VS Code | Development environment |

---

# Negotiation Scenarios

NegoForge currently provides three negotiation scenarios.

## Vendor Pricing Negotiation

This scenario models a negotiation between a vendor and a buyer.

Participants negotiate around:

- Product or service price
- Initial offer
- Target price
- Counteroffers
- Concessions
- Final agreement

Example negotiation:

```text
Buyer Initial Offer : ₹100,000
Vendor Counteroffer : ₹115,000
Vendor Revised Offer: ₹110,000
Buyer Counteroffer  : ₹102,100
```

The negotiation continues until an agreement is reached or the maximum
negotiation limit is reached.

---

## Job Offer Negotiation

This scenario models a negotiation between a job candidate and an employer.

Potential negotiation areas include:

- Salary
- Compensation
- Benefits
- Role expectations
- Candidate requirements

---

## Project Budget Allocation

This scenario models a negotiation involving project budget allocation.

Participants negotiate around:

- Budget requirements
- Resource allocation
- Project priorities
- Constraints
- Competing objectives

---

# Agent Configuration

Before starting a negotiation, users can configure the participating agents.

Agent configuration can include:

- Role
- Goal
- Objective
- Constraints
- Personality
- Negotiation parameters

Example:

```text
Agent:
Buyer

Role:
Buyer

Goal:
Purchase the product at a favorable price.

Personality:
Risk-Averse

Constraint:
Maximum acceptable price.
```

---

# Agent Personalities

## Aggressive

An aggressive agent generally maintains a firm negotiation position and
attempts to maximize its objective.

Typical characteristics include:

- Strong initial position
- Smaller concessions
- Firm counteroffers
- Strong focus on its objective

---

## Collaborative

A collaborative agent focuses on reaching a mutually acceptable outcome.

Typical characteristics include:

- Flexible negotiation
- Willingness to compromise
- Focus on agreement
- Balanced negotiation behavior

---

## Risk-Averse

A risk-averse agent prioritizes protecting its objectives and avoiding
unfavorable outcomes.

Typical characteristics include:

- Conservative offers
- Careful concessions
- Strong attention to constraints
- Lower tolerance for unfavorable outcomes

---

# Negotiation Modes

## Simulation Mode — AI vs AI

In Simulation Mode, both participants are controlled by AI agents.

```text
AI Agent A
     │
     ▼
   Offer
     │
     ▼
AI Agent B
     │
     ▼
Counteroffer
     │
     ▼
Negotiation Orchestrator
     │
     ▼
Next Round
```

This mode allows users to observe autonomous negotiation behavior.

---

## Practice Mode — Human vs AI

In Practice Mode, the user participates directly in the negotiation.

```text
Human Participant
       │
       ▼
     Offer
       │
       ▼
Negotiation Engine
       │
       ▼
    AI Agent
       │
       ▼
  Counteroffer
       │
       ▼
Human Participant
```

The user can make offers and counteroffers while the AI responds based on
the configured negotiation state.

---

# Negotiation Engine

The negotiation engine manages the complete negotiation lifecycle.

## Negotiation Orchestrator

The orchestrator manages:

- Turn order
- Negotiation state
- Negotiation history
- Round count
- Agent interaction
- Offer progression

---

## Agent Input Creation

Agent inputs can incorporate:

- Role
- Goals
- Personality
- Constraints
- Current offer
- Previous offers
- Negotiation history
- Concessions

---

## Decision Processing

The negotiation system supports:

```text
Accept
Counter
Reject
```

The selected decision determines the next stage of the negotiation.

---

## Concession Calculation

The concession module tracks changes made by agents throughout the
negotiation.

This provides information about how far an agent has moved from its
initial position.

---

## Deadlock and Mediator

NegoForge limits negotiations to **5 rounds**.

If no agreement is reached within the allowed rounds, the negotiation can
enter a deadlock state.

A mediator can then be introduced to assist with resolving the negotiation.

```text
Negotiation
     │
     ▼
  Round 1
     │
     ▼
  Round 2
     │
     ▼
  Round 3
     │
     ▼
  Round 4
     │
     ▼
  Round 5
     │
     ▼
 Agreement?
   /     \
 Yes      No
  │        │
  ▼        ▼
Outcome  Mediator
Screen
```

---

# Negotiation Workflow

```text
Select Scenario
       ↓
Configure Agents
       ↓
Select Personalities
       ↓
Choose Negotiation Mode
       ↓
Start Negotiation
       ↓
Negotiation Orchestrator
       ↓
Generate Offer
       ↓
Counteroffer / Accept / Reject
       ↓
Track Concessions
       ↓
Continue Negotiation
       ↓
Agreement?
   ┌───┴────┐
  YES       NO
   │         │
   ▼         ▼
Outcome    5-Round Limit
Screen        │
              ▼
           Mediator
              │
              ▼
        Final Outcome
```

---

# Outcome & Evaluation

After the negotiation ends, the Outcome Screen provides a consolidated view
of the negotiation result.

## Final Agreement

Displays the final negotiated terms when an agreement is reached.

## Rounds Elapsed

Displays the number of rounds used during the negotiation.

## Concession Timeline

Shows how participant positions changed throughout the negotiation.

## Objective Satisfaction

Displays how well each agent achieved its configured objective.

## Negotiation Transcript

Provides the negotiation history containing offers, counteroffers, and
decisions.

## Summary Report

Provides a consolidated summary of the negotiation outcome.

---

# Agile Internship Documentation (9 Weeks / 45 Days)

The project was developed incrementally through four major milestones during
the internship period.

## Milestone 1 — System Design & Agent Configuration

Activities included:

- Understanding negotiation concepts.
- Defining the system workflow.
- Designing system architecture.
- Designing agent roles.
- Defining goals and constraints.
- Implementing scenario templates.
- Implementing agent configuration.
- Designing the Negotiation Arena.

## Milestone 2 — Negotiation Engine

Activities included:

- Implementing the Negotiation Orchestrator.
- Managing negotiation turns.
- Managing negotiation history.
- Managing round counts.
- Implementing offer processing.
- Implementing counteroffers.
- Implementing accept/reject decisions.
- Implementing concession tracking.
- Implementing AI-vs-AI negotiation.

## Milestone 3 — Practice Mode

Activities included:

- Implementing Human-vs-AI negotiation.
- Allowing users to participate as one negotiation agent.
- Processing human offers.
- Processing counteroffers.
- Generating AI responses.
- Maintaining negotiation state.
- Implementing deadlock handling.

## Milestone 4 — Outcome & Evaluation

Activities included:

- Implementing the Outcome Screen.
- Displaying final agreements.
- Displaying rounds elapsed.
- Displaying concession information.
- Displaying objective satisfaction.
- Providing negotiation transcript and summary.
- Testing AI-vs-AI mode.
- Testing Practice Mode.
- Testing scenarios.
- Testing personality combinations.
- Preparing final project documentation and demonstration.

## Agile Documentation File

The complete Agile internship documentation is maintained in the repository.

[Open Agile Internship Documentation](docs/agile/Agile_documentation.xlsx)

---

# Quick Start Guide

## Prerequisites

Before running NegoForge, make sure the following are installed on your
computer:

- **Node.js** — Required to run the React application.
- **Git** — Required to clone the NegoForge repository from GitHub.

## Clone the Repository

```bash
git clone https://github.com/kavyarach/NegoForge.git
```

## Navigate to the Project

```bash
cd NegoForge
```

## Install Dependencies

```bash
npm install
```

## Start the Development Server

```bash
npm run dev
```

After running the command, Vite will provide a local development URL in the
terminal. Open that URL in your browser to access NegoForge.

## Build the Application

To create a production build, run:

```bash
npm run build
```

## Preview the Production Build

To preview the production build locally, run:

```bash
npm run preview
```

---

# Automated Testing & Quality Assurance

Testing focuses on validating the major negotiation workflows and application
behavior.

## Scenario Testing

The following scenarios are tested:

- Vendor Pricing Negotiation
- Job Offer Negotiation
- Project Budget Allocation

## Personality Testing

The supported personalities are tested:

- Aggressive
- Collaborative
- Risk-Averse

## Negotiation Mode Testing

Testing includes:

- AI-vs-AI Simulation Mode
- Human-vs-AI Practice Mode

## Negotiation Flow Testing

The following areas are verified:

- Scenario selection
- Agent configuration
- Negotiation initialization
- Offer generation
- Counteroffers
- Accept/reject decisions
- Concession tracking
- Round management
- Deadlock handling
- Mediator flow
- Outcome Screen

## Outcome Testing

The final outcome is checked for:

- Final agreement
- Round count
- Concession information
- Objective satisfaction
- Negotiation transcript
- Summary information

---

# Project Directory Structure

```text
NegoForge/
│
├── docs/                                      # Project documentation
│   ├── agile/                                 # Agile internship documentation
│   │   └── Agile_documentation.xlsx           # Agile documentation (9 Weeks / 45 Days)
│   │
│   └── architecture/                          # System architecture documentation
│       └── system-architecture.png            # High-level system architecture diagram
│
├── public/                                    # Public/static application assets
│
├── src/                                       # Main application source code
│   ├── assets/                                # Application assets
│   ├── components/                            # Reusable React UI components
│   ├── constants/                             # Scenarios and application constants
│   ├── models/                                # Application data models
│   ├── services/                              # Application and negotiation services
│   ├── tests/                                 # Testing-related files
│   │
│   ├── App.jsx                                # Main React application component
│   ├── App.css                                # Main application styling
│   ├── index.css                              # Global CSS styles
│   ├── main.jsx                               # React application entry point
│   └── orchestrator.js                        # Negotiation orchestration logic
│
├── .gitignore                                 # Git ignored files and directories
├── eslint.config.js                           # ESLint configuration
├── index.html                                 # Main HTML entry point
├── LICENSE                                    # Project license
├── package.json                               # Project dependencies and scripts
├── package-lock.json                          # Locked dependency versions
├── README.md                                  # Project documentation
└── vite.config.js                             # Vite configuration
```

---

# Project Milestones

| Milestone | Focus |
|---|---|
| Milestone 1 | System Design & Agent Configuration |
| Milestone 2 | Negotiation Engine |
| Milestone 3 | Human-vs-AI Practice Mode |
| Milestone 4 | Outcome & Evaluation |

---

# Future Enhancements

Potential future improvements include:

- More advanced LLM-based reasoning.
- Additional negotiation scenarios.
- Additional agent personalities.
- Advanced negotiation analytics.
- Historical negotiation comparison.
- Adaptive negotiation strategies.
- Enhanced mediator capabilities.
- Voice-based negotiation.
- Multiplayer negotiation sessions.
- Advanced dashboards and visualizations.
- Improved real-time negotiation insights.

These features represent potential future development and are not presented
as current functionality unless implemented in the project.

---

# License

This project is provided under the license included in the repository.

See the `LICENSE` file for the applicable license terms.

---

# Repository

GitHub Repository:

https://github.com/kavyarach/NegoForge
