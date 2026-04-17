# ChainSight: Enterprise Supply Chain Intelligence - Design Schema

## 1. Core Navigation (The Command Center)
Every primary action in the bottom navigation bar is mapped to a high-utility workflow:

*   **Fleet (Grid View):** 
    *   *Purpose:* Real-time visibility into the entire logistics network.
    *   *Interaction:* Toggle between Map and List views. Drill down into specific regions or transport modes.
*   **Intelligence (Psychology):** 
    *   *Purpose:* Proactive risk modeling and AI-driven forecasting.
    *   *Interaction:* Access "What-If" simulations, weather impact reports, and labor strike predictions.
*   **Ledger (Account Tree) [Active]:** 
    *   *Purpose:* Immutable audit trail and verification.
    *   *Interaction:* Search by Tx Hash, filter by "Tampered" events, and export cryptographic proofs.
*   **Alerts (Notifications):** 
    *   *Purpose:* Exception management.
    *   *Interaction:* Swipe to acknowledge, tap to jump directly to the affected shipment's "Explainable AI" panel.

## 2. Interaction Model: "The Verifiable Truth"
Buttons are categorized by their functional weight:

*   **Primary Action (Emerald/Neon):** "Block Verified" or "Acknowledge Alert." These are the "Truth" actions that update the ledger or the user's workflow state.
*   **Secondary Action (Tonal/Glass):** "Details," "View Map," or "Export PDF." Navigation-heavy actions that provide deeper context.
*   **Critical Action (Crimson/Amber):** "Tampered," "High Risk," or "Flag for Review." These demand immediate cognitive attention and trigger downstream AI explanations.

## 3. Screen-Specific Logic

### Screen 1: The Fleet Dashboard
*   **Shipment Card:** The entire card is a hit area leading to the Detail view.
*   **Risk Badge:** Tapping the "HIGH RISK" cause triggers a quick-view modal of the "Explainable AI" logic without leaving the list.
*   **Search/Filter:** Floating action buttons for rapid narrowing of thousands of shipments.

### Screen 2: Shipment Details & Ledger
*   **Confidence Meter (78%):** Tapping this expands a "Data Sources" sub-panel showing which sensors (IoT, Satellite, News) contributed to the score.
*   **Ledger Entry:** Tapping a "Tx Hash" opens the raw JSON data for developers/auditors.
*   **Verification Badge:** "Block Verified" is interactive, revealing the timestamp of the last node consensus.

## 4. Design Tokens & Visual Hierarchy
*   **Background:** `#0B0E14` (Deep Space)
*   **Accent:** `#50FFB0` (Matrix Emerald) for verification and truth.
*   **Warning:** `#FF4B4B` (Neon Crimson) for tampering and high-risk alerts.
*   **Typography:** Space Grotesk (Modern/Geometric) for a technical, precise feel.
