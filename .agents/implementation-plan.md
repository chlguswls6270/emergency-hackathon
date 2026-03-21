# Phase 1: Discovery & Alignment (Planner Report)

## Background Context
The objective is to architect and build an elegant, premium web platform for Hackathon discovery and management, based on the `public_hackathons.json`, `public_hackathon_detail.json`, `public_teams.json`, and `public_leaderboard.json` data. This plan adheres strictly to the `website-builder-pipeline` 4-stage protocol.

## Value-Add Features Proposed
1. **Premium Modern Aesthetics (Vanilla CSS)**: Implementing a highly curated design system featuring sleek dark modes, glassmorphism effects, fluid gradients, and engaging micro-animations (hover states, load ins) to ensure a "wow" first impression.
2. **Interactive Dashboard & Filtering**: Interactive views for Hackathon listings with tag filtering, search, and dynamic status indicators (e.g., Live Countdowns for "ongoing" hackathons).
3. **Animated Leaderboard & Teams List**: Sortable and visually distinct leaderboards with animated transitions and rank highlights.
4. **Mock Submission Flow**: A functional UI flow allowing users to draft and "submit" their artifacts using LocalStorage to mock persistence.
5. **Role-based Authentication Simulation**: A mock toggle for "Visitor" vs "Participant" vs "Judge" to view different capabilities on the platform.

## Image Analysis (memo.png & Hackathon-UI-Flow.png)
Based on the provided flow designs, the following structural mandates will be strictly enforced:
- **Global & Local Storage**: Data mutations (new teams, submissions) and dynamic state (submissions, leaderboards, hackathons, camp) must be persisted in **localStorage**.
- **Main Page (`/`)**: Must feature 3 large CTA buttons: `Go to Hackathons`, `Find Team (/camp)`, and `View Rankings`. 
- **Hackathon Detail (`/hackathons/:slug`)**: This is the core view. It MUST contain exactly 7 mandatory sections: Overview(안내/개요), Evaluation(평가), Schedule(일정), Prize(상금), Teams(팀/캠프), Submit(제출), and Leaderboard(리더보드). Submit interactions directly update the Leaderboard.
- **Camp (`/camp`)**: A global recruitment board filtering by `?hackathon=slug` optionally, requiring forms for team name, description, open status, roles, and contact link.
- **Security Rule**: STRICTLY prohibit exposing internal, private, or other teams' internal information.

## User Review Required
> [!IMPORTANT]
> I have analyzed the PNG files. Please review the updated Implementation Plan and the Image Analysis above. Do you approve moving forward to Stage 2 (Parallel Implementation) to start writing code?

---

## Proposed Changes

### Backend (`/backend`)
We will set up a Python FastAPI server to serve the JSON data.
#### [NEW] `requirements.txt`
Dependencies (fastapi, uvicorn, pydantic).
#### [NEW] `main.py`
API application entry point, including CORS and base configuration.
#### [NEW] `routes.py`
Endpoints that read the JSON files from `/data/예시자료` and serve them:
- `GET /api/hackathons`
- `GET /api/hackathons/{slug}`
- `GET /api/camp`
- `GET /api/leaderboard`
- `GET /api/rankings`
- `POST /api/submit`

---

### Frontend (`/frontend`)
We will initialize a Vite project (React). According to the aesthetic guidelines, we will rely exclusively on Vanilla CSS for styling.
#### [NEW] `index.css`
A comprehensive, custom CSS design system using CSS variables, custom font imports (Google Fonts: Inter/Outfit), and premium UI utility classes.
#### [NEW] `src/App.jsx`
Main layout, routing (Home, Details, Leaderboard, Rankings, Camp, Submit).
#### [NEW] `src/services/api.js`
Fetch functions targeting the FastAPI endpoints.
#### [NEW] `src/components/`
Modular, reusable components like `HackathonCard`, `LeaderboardRow`, `CampCard`, enriched with Vanilla CSS micro-animations.

## Verification Plan
### Automated Tests
- We will start the FastAPI backend and test endpoints programmatically to ensure valid 200 OK responses matching the expected Pydantic schemas.
- We will build the Vite frontend bundle (`npm run build`) to ensure there are no compilation errors.

### Manual Verification
- The User will be asked to open the development URLs (`http://localhost:5173`) to verify the dynamic design, aesthetic quality, and correct integration with the backend API.
