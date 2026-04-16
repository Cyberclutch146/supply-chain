const fs = require('fs');
const path = require('path');

const reportHeader = `
================================================================================
            PROJECT REPORT: CHAINSIGHT (SOVEREIGN LEDGER)
================================================================================

1. PROJECT OVERVIEW
-------------------
ChainSight is a next-generation supply chain visibility platform designed for
enterprise-grade logistics monitoring. It focuses on two core pillars:
a) Cryptographic Provenance: Ensuring every event is signed and immutable.
b) Predictive Intelligence: Using AI to analyze multi-dimensional risk factors.

2. ARCHITECTURAL DESIGN
-----------------------
- Framework: React 18+ powered by Vite.
- Styling: Tailwind CSS v4 (Modernized Utility Stack).
- Logic Engine: A centralized React Context (ShipmentContext) that acts as the
  single source of truth for shipment states and real-time risk calculations.
- Navigation: Client-side routing with deep-linking support via React Router.

3. FEATURE SPECIFICATION
------------------------
- Fleet Dashboard: A high-level bento-grid interface showing global TVL,
  active contracts, and critical risk alerts.
- Risk Intelligence: A 7-parameter heuristic engine calculating delay scores
  (0-100%). Factors include idle time, harsh braking, traffic, vehicle health,
  weather, border delays, and route deviation.
- Provenance Ledger: A vertical blockchain-style timeline with transaction
  hashes and cryptographic verification status.
- Demo Simulator: Built-in scenario injection for rapid testing of AI
  behavior (e.g., simulating theft risk or fatigue).

4. DATA FLOW & STATE MANAGEMENT
--------------------------------
The application utilizes a sophisticated local state simulation:
- [Source] -> User adds Checkpoint with specific scenario variables.
- [Engine] -> ShipmentContext runs getShipmentMetrics().
- [Evaluation] -> Multi-stage logic evaluates the "Risk Score" and identifies
  primary/secondary causes.
- [UI] -> Components (Dashboard/Detail) re-render with updated "AI Reasoning".

5. FULL CODEBASE DUMP
---------------------
The following section contains the literal source code for all critical files,
ready for analysis, feature expansion, or debugging.

================================================================================
`;

const output = [reportHeader];

const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('dist')) walk(fullPath);
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
        output.push(`\n--- FILE: ${fullPath.replace(/\\/g, '/')} ---\n` + fs.readFileSync(fullPath, 'utf-8') + `\n`);
      }
    }
  }
};

walk('src');

const rootFiles = ['package.json', 'index.html', 'tailwind.config.js', 'postcss.config.js', 'vite.config.js'];
rootFiles.forEach(f => {
  if (fs.existsSync(f)) {
    output.push(`\n--- FILE: ${f} ---\n` + fs.readFileSync(f, 'utf-8') + `\n`);
  }
});

fs.writeFileSync('Full_Project_Report_and_Codebase.txt', output.join('\n'));
console.log("Successfully created Full_Project_Report_and_Codebase.txt");
