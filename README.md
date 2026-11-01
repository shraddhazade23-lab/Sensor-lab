# SensorLab – Interactive Sensor Learning & Virtual Electronics Lab

> **A browser-based electronics, sensor, and microcontroller learning platform tailored for students in Classes 5–7, designed for an industrial live project demonstration.**

---

## 🌟 Project Overview

Traditional middle school electronics education often faces hurdles: physical development boards (like Arduino Uno) and sensor kits may be unavailable, broken components cause frustration, and wiring mistakes risk short circuits or burnt components.

**SensorLab** bridges this gap by delivering an interactive, browser-based laboratory workbench where students can:
- Explore fundamental concepts through age-appropriate curriculum modules (Classes 5, 6, and 7).
- Drag-and-drop authentic virtual components (Arduino Uno R3, Half-size Breadboards, LEDs, Resistors, Push Buttons, LDR Photoresistors, Potentiometers, Buzzers).
- Wire electrical circuits using realistic snap terminals and curved colored jumper wires.
- Observe deterministic software simulations with real-time feedback (simulated currents, ADC 0–1023 readings, divider voltages, PWM duty cycles).
- Receive instant contextual guidance from **Sparky AI** (integrated with Firebase AI Logic & Gemini).
- Complete knowledge-check quizzes, earn points & badges, and print verifiable achievement certificates.

> ⚠️ **Simulation Distinction & Lab Honesty Notice:**
> The SensorLab virtual laboratory is an educational software simulation. It does not physically control real-world hardware. All readings, currents, and component states are software models created for learning circuit logic safely.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Programming Language** | JavaScript (ES Modules) | Strict JavaScript throughout (No TypeScript conversion) |
| **Frontend Framework** | React 18 | Component-based UI with hooks and Context API |
| **Build Tool & Dev Server** | Vite 6 | Lightning-fast HMR and optimized production bundles |
| **Styling** | Tailwind CSS | Curated educational color palette, dark lab canvas, responsive design |
| **Icons** | Lucide React | Clean, consistent icons across the platform |
| **Routing** | React Router v6 | Single Page Application with protected student routes |
| **Backend & Cloud** | Firebase SDK v11 (Modular) | Firebase Auth, Cloud Firestore, Firebase Hosting, App Check |
| **AI Learning Assistant** | Firebase AI Logic / Gemini | Context-aware educational assistant (Sparky) |
| **Automated Testing** | Vitest + JSDOM | Unit tests for circuit model, graph netlist, and simulation modes |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **npm**: v9.0.0 or higher

### Installation
Clone or navigate to the project directory in PowerShell or terminal:

```powershell
# 1. Install project dependencies
npm install

# 2. (Optional) Configure environment variables
# Copy .env.example to .env
cp .env.example .env

# 3. Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

> 💡 **Out-of-the-Box Demo Mode:**
> If `.env` is left blank, SensorLab automatically activates **Local / Demo Mode**. You can sign in with 1-click as a demo student, access the complete curriculum, test all 6 projects, simulate breadboard circuits, take quizzes, and earn badges without needing to set up a paid Firebase account first!

---

## 🧪 Automated Testing

SensorLab includes automated unit tests covering the circuit graph, netlist traversal, validation rules, simulation modes (LED, Button, LDR, PWM), and quiz scoring:

```powershell
# Run the Vitest test suite once
npm run test

# Run tests in watch mode
npx vitest
```

---

## 📦 Project Architecture & Directory Layout

```
sensorlab/
├── public/                     # Static assets and icons
├── src/
│   ├── assets/                 # SVGs and images
│   ├── components/
│   │   ├── assistant/          # Sparky AI floating bot and chat window
│   │   ├── common/             # ProtectedRoute, modals, badges
│   │   ├── lab/                # CircuitCanvas, ComponentPalette, PropertiesPanel, LabToolbar
│   │   └── layout/             # Responsive Navbar and Footer
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Authentication state and user profile
│   │   ├── ProgressContext.jsx # Points, completed lessons, achievements, and celebration
│   │   └── AssistantContext.jsx# AI message history and contextual metadata
│   ├── data/
│   │   ├── initialLessons.js   # Class 5, 6, and 7 structured curricula
│   │   ├── initialProjects.js  # 5 guided beginner and intermediate projects
│   │   └── initialQuizzes.js   # Multiple-choice quizzes with explanations
│   ├── pages/
│   │   ├── LandingPage.jsx     # Hero, features, and 1-click live demo launcher
│   │   ├── LoginPage.jsx       # Email/password login and demo quick-sign-in
│   │   ├── SignupPage.jsx      # Class selection and student registration
│   │   ├── OnboardingPage.jsx  # Avatar customization and lab safety rules
│   │   ├── DashboardPage.jsx   # Live stats, continue learning, progress meter
│   │   ├── LearningPage.jsx    # Module catalog with class filter tabs
│   │   ├── LessonPage.jsx      # Detailed lesson with analogies and quiz links
│   │   ├── ProjectsPage.jsx    # Guided project catalog with search and filters
│   │   ├── ProjectDetailPage.jsx # BOM, blueprint, and direct lab launcher
│   │   ├── VirtualLabPage.jsx  # Interactive SVG breadboard & simulation engine
│   │   ├── QuizPage.jsx        # Interactive quiz with scoring and explanations
│   │   ├── AchievementsPage.jsx# Earned badges and printable achievement certificate
│   │   ├── ProfilePage.jsx     # Profile settings and saved circuits manager
│   │   ├── AdminPage.jsx       # Architecture verification and Firestore rules overview
│   │   └── NotFoundPage.jsx    # 404 handler
│   ├── services/
│   │   ├── firebase.js         # Modular Firebase initialization & emulator config
│   │   ├── authService.js      # Auth operations with mapped student errors
│   │   ├── userService.js      # User profile read/write
│   │   ├── lessonService.js    # Curriculum retrieval
│   │   ├── projectService.js   # Project catalog and detail retrieval
│   │   ├── progressService.js  # Points calculation, badges, and circuit saves
│   │   ├── quizService.js      # Quiz assessment data
│   │   └── aiService.js        # Gemini / Firebase AI Logic & educational fallback
│   ├── simulator/
│   │   ├── circuitModel.js     # Component/wire CRUD, serialization & schemas
│   │   ├── componentDefinitions.js # Pin positions, dimensions, and specs
│   │   ├── connectionGraph.js  # Electrical BFS pathfinding & netlist
│   │   ├── circuitValidator.js # Educational validation (polarity, resistor check)
│   │   └── simulationEngine.js # Deterministic calculation for LED, LDR, PWM, Button
│   ├── styles/
│   │   └── index.css           # Tailwind base, LED glow utilities, and print styles
│   ├── tests/
│   │   ├── setup.js            # Vitest JSDOM environment
│   │   └── simulator.test.js   # Automated unit test suite
│   ├── App.jsx                 # Routes and application providers
│   └── main.jsx                # Application entry point
├── .env.example                # Documented environment variables
├── firebase.json               # Firebase Hosting, Firestore, and Emulator config
├── firestore.rules             # Strict security rules protecting student data
├── firestore.indexes.json      # Firestore query indexes
├── package.json
└── vite.config.js
```

---

## 🔥 Firebase Setup Guide

Follow these steps to connect SensorLab to a live Google Firebase cloud project:

### Step 1: Create a Project in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `sensorlab-edu`.
3. In the project dashboard, click **Add app** and select the **Web (`</>`)** platform.
4. Copy the `firebaseConfig` object values.

### Step 2: Configure Environment Variables
Create a file named `.env` in the root directory:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=sensorlab-edu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sensorlab-edu
VITE_FIREBASE_STORAGE_BUCKET=sensorlab-edu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Gemini API Key (for live Sparky AI assistant responses)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Enable Authentication
1. In Firebase Console, open **Build > Authentication**.
2. Click **Get Started** and enable the **Email/Password** provider.

### Step 4: Deploy Cloud Firestore & Security Rules
1. In Firebase Console, open **Build > Firestore Database** and click **Create database**.
2. Deploy the provided `firestore.rules` using the Firebase CLI:

```powershell
# Install Firebase CLI if not already present
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize and select your project
firebase use --add

# Deploy Firestore Security Rules
firebase deploy --only firestore:rules
```

---

## 🔒 Firestore Security Rules Policy

The included `firestore.rules` file enforces strict student data isolation:
- **`users/{userId}`**: Students can only read and update their own document. Unauthorized clients cannot modify their admin status (`isAdmin: true`).
- **`users/{userId}/savedCircuits`**: Private to each student.
- **`users/{userId}/lessonProgress` & `projectProgress`**: Private to each student.
- **`learningModules` & `lessons`**: Read-only for authenticated students; writes are restricted exclusively to administrators with custom claims.

---

## 🌐 Deployment to Firebase Hosting

To deploy the production-ready build to Firebase Hosting:

```powershell
# 1. Build optimized production assets
npm run build

# 2. Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your website will be live at `https://<your-project-id>.web.app`.

---

## 💡 Supported Virtual Simulation Modes

| Mode | Demonstration Feature | How to Test |
|---|---|---|
| **Mode A: LED Circuit** | Verifies closed power loop, correct Anode/Cathode polarity, and 220Ω resistor guard. | Open Project 1 or wire 5V ➔ 220Ω ➔ LED ➔ GND. Click "Run Simulation". |
| **Mode B: Push Button LED** | Demonstrates digital switching. | Press and hold the "Push Button" switch in the right control panel to close the loop and illuminate the LED. |
| **Mode C: LDR Light Sensor** | Voltage divider mapping ambient light to Arduino Analog Pin A0 (0–1023). | Move the Ambient Light slider from 0% (pitch dark) to 100% (bright sunlight) and watch the ADC reading and divider voltage update in real time. |
| **Mode D: Automatic Night Lamp** | Autonomous threshold triggering. | Set the threshold to 400. Lower the ambient light below 40% to watch Digital Pin D13 trigger the night light ON. |
| **Mode E: PWM LED Dimmer** | Smooth brightness control using Pulse-Width Modulation. | Slide the PWM value from 0 to 255 to adjust the duty cycle and visual LED glow. |

---

## 📜 License

Created for educational use and middle school electronics learning demonstrations.
All rights reserved © 2026 SensorLab.
