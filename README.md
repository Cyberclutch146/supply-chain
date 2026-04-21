# Neon-Powered Supply Chain AI (WORK IN PROGRESS)

A modern, highly aesthetic supply chain tracking and risk prediction tool powered by AI and simulated blockchain technology.

## Key Features

- **Fleet Intelligence Dashboard:** View real-time value locked, total active contracts, and visually monitor predictive risk nodes across your global supply chain.
- **Explainable AI Integration:** Simulates fetching predictive risk scores to analyze parameters such as location delay, weather severity, and traffic bottlenecks.
- **Simulated Sovereign Ledger:** Includes visual blockchain-mimicking ledger capabilities built for demo purposes—verifiable payload hashes glow neon green upon execution, while compromised hashes glow red.
- **Sleek UI:** Crafted via dark mode, glassmorphism, gradient drop-shadows, matching neon layouts, micro-animations, loading sequences, and React toasts to heighten the user experience.

## Getting Started

1. Install dependencies by running:
   ```bash
   npm install
   ```
2. Start the application by running:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend Framework:** React + Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Backend/Platform:** Firebase (Auth, Firestore, Cloud Functions)

## Project Structure
- `src/components/`: Reusable interface components and global layout wrappers.
- `src/context/`: Core React contexts managing state and real-time syncing mechanism.
- `src/pages/`: Main application routes (`Dashboard`, `Tracking`, `Contracts`, `NodeStatus`, `AuditLogs`, `Settings`, `Landing`).
- `src/services/`: Firebase configurations and initializers.

## Note
This project operates by utilizing Firebase anonymous sign-ins and leverages a demo backend and simulated AI logic mechanisms to estimate and analyze delay probability.
