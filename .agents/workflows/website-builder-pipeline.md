---
description: This document defines the immutable workflow for the autonomous agentic team. Every agent must adhere to these cycles to ensure project integrity, security, and "simple/elegant" design standards.
---

# Global Pipeline Protocol: Emergency-Hackathon

This document defines the immutable workflow for the autonomous agentic team. Every agent must adhere to these cycles to ensure project integrity, security, and "simple/elegant" design standards.

## 📂 Project Structure & Context
All agents must operate within the following directory context:
* **Root:** `/emergency-hackathon`
* **Source of Truth:** `/emergency-hackathon/data` (Contains PNGs and JSONs)
* **Frontend:** `/emergency-hackathon/frontend`
* **Backend:** `/emergency-hackathon/backend` (FastAPI)

---

## 🔄 The 4-Stage Work Cycle

### Stage 1: Discovery & Alignment (The "Planner" Gate)
* **Action:** The Planner analyzes `/data`, proposes a Phase 1 report, and suggests "Value-Add" features.
* **Condition:** Work **MUST STOP** until the User (Human) provides explicit approval. No code is to be written until Phase 2 is triggered.

### Stage 2: Parallel Implementation (Engineering Phase)
* **Frontend:** Builds the UI using chosen modern tools. Must report progress to the User after every major page/component.
* **Backend:** Builds FastAPI endpoints and generates necessary **Mock Data** to unblock the Frontend.
* **Sync:** The Backend must provide the `/docs` (Swagger) URL or a Pydantic schema file for the Frontend to consume.

### Stage 3: The Automated Review (The "Reviewer" Gate)
* **Trigger:** Initiated automatically once Frontend and Backend report "Done."
* **Audit:** The Reviewer compares the code in `/frontend` and `/backend` against the Plan and the files in `/data`.
* **The Loop:**
    * If **REJECTED**: The offending agent receives specific logs and must refactor.
    * If **PASSED**: The pipeline moves to the final stage.

### Stage 4: Final Handover
* **Action:** The Reviewer compiles a summary of the working features.
* **Result:** The project is presented to the User for the final hackathon submission.

---

## ⚡ Technical Mandates
1. **Consistency:** All UI elements must be uniform. All API responses must be stable.
2. **Security:** FastAPI must include basic validation and security middleware by default.
3. **Usability:** If a feature isn't intuitive, it must be simplified or explained via a UI tooltip.
4. **Vibe Coding Integrity:** Agents are encouraged to be creative with "Value-Add" features but must never ignore the core JSON schema in the data folder.

---

## 🚨 Conflict Resolution
In case of a logic conflict between the Frontend and Backend agents, the **Reviewer** has the final tie-breaking vote based on the **Planner's** Phase 2 documentation.