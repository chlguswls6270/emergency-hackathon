import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Emergency Hackathon API", description="Provides Mock JSON Data for the Frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data" / "예시자료"

def load_json(filename: str):
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Data file not found")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/", summary="Root health check")
def read_root():
    return {"message": "Emergency Hackathon API is running. Access /docs for API documentation."}

@app.get("/api/hackathons", summary="Get all hackathons")
def get_hackathons():
    hackathons = load_json("public_hackathons.json")
    details = load_json("public_hackathon_detail.json")
    teams = load_json("public_teams.json")
    
    # create lookup for details
    detail_list = details if isinstance(details, list) else []
    if isinstance(details, dict):
        if "slug" in details: detail_list.append(details)
        detail_list.extend(details.get("extraDetails", []))

    for hack in hackathons:
        slug = hack["slug"]
        start_date = None
        for d in detail_list:
            if d.get("slug") == slug:
                sections = d.get("sections", d)
                for ms in sections.get("schedule", {}).get("milestones", []):
                    if "시작" in ms.get("name", ""):
                        start_date = ms.get("at")
                        break
                break
        hack["startDate"] = start_date
        hack["participantCount"] = sum(1 for t in teams if t.get("hackathonSlug") == slug)

    return hackathons

@app.get("/api/hackathons/{slug}", summary="Get hackathon details")
def get_hackathon_detail(slug: str):
    data = load_json("public_hackathon_detail.json")
    
    # Process if data is a list of detail objects
    if isinstance(data, list):
        for item in data:
            if item.get("slug") == slug:
                return item
                
    # Process if original structure (object with extraDetails)
    if isinstance(data, dict):
        if data.get("slug") == slug:
            return data
        for extra in data.get("extraDetails", []):
            if extra.get("slug") == slug:
                return extra
                
    raise HTTPException(status_code=404, detail="Hackathon not found")

@app.get("/api/camp", summary="Get all active camps/teams")
def get_camps(hackathon: Optional[str] = None):
    data = load_json("public_teams.json")
    if hackathon:
        filtered = [t for t in data if t.get("hackathonSlug") == hackathon]
        return filtered
    return data

@app.get("/api/leaderboard", summary="Get global or specific leaderboards")
def get_leaderboard(hackathon: Optional[str] = None):
    data = load_json("public_leaderboard.json")
    result = data if not hackathon else None

    if hackathon:
        if data.get("hackathonSlug") == hackathon:
            result = data
        else:
            for extra in data.get("extraLeaderboards", []):
                if extra.get("hackathonSlug") == hackathon:
                    result = extra
                    break

    if result is None and hackathon:
        raise HTTPException(status_code=404, detail="Leaderboard not found")

    # Inject unit dynamically based on detail metric
    if hackathon and result:
        try:
            detail = get_hackathon_detail(hackathon)
            metric = detail.get("sections", detail).get("eval", {}).get("metricName", "Score")
            result["unit"] = "pts" if "Score" in metric else metric
        except:
            result["unit"] = "pts"

    return result

from datetime import datetime, timedelta

@app.get("/api/rankings", summary="Placeholder for user rankings")
def get_rankings(days: Optional[int] = None):
    # Constructing mock global rankings
    now = datetime.now()
    rankings = [
         {"rank": 1, "nickname": "CodeMaster", "points": 12500, "updatedAt": (now - timedelta(days=2)).isoformat()},
         {"rank": 2, "nickname": "VibeCoder99", "points": 9400, "updatedAt": (now - timedelta(days=15)).isoformat()},
         {"rank": 3, "nickname": "FrontendNinja", "points": 8300, "updatedAt": (now - timedelta(days=25)).isoformat()},
         {"rank": 4, "nickname": "BackendHero", "points": 6200, "updatedAt": (now - timedelta(days=40)).isoformat()},
    ]
    
    if days:
        cutoff = now - timedelta(days=days)
        # Using string comparison for isoformat works fine, but parsing is safer
        # Python 3.7+ fromisoformat handles simple iso formats
        rankings = [r for r in rankings if datetime.fromisoformat(r["updatedAt"]) >= cutoff]
        
        for i, r in enumerate(rankings):
            r["rank"] = i + 1

    return rankings

class SubmitFormData(BaseModel):
    teamCode: str
    hackathonSlug: str
    artifactUrl: Optional[str] = None
    notes: Optional[str] = None

@app.post("/api/submit", summary="Mock submission endpoint")
def create_submission(payload: SubmitFormData):
    # In reality, frontend localstorage will track actual mutations.
    # We return a success object just to fulfill API interactions.
    return {"status": "success", "message": "Submission received", "data": payload}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
