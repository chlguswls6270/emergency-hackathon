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
         {"rank": 2, "nickname": "VibeCoder99", "points": 9400, "updatedAt": (now - timedelta(days=5)).isoformat()},
         {"rank": 3, "nickname": "개발하는사자", "points": 8300, "updatedAt": (now - timedelta(days=1)).isoformat()},
         {"rank": 4, "nickname": "BackendHero", "points": 6200, "updatedAt": (now - timedelta(days=4)).isoformat()},
         {"rank": 5, "nickname": "디자인장인", "points": 5800, "updatedAt": (now - timedelta(days=8)).isoformat()},
         {"rank": 6, "nickname": "NextJS러버", "points": 5500, "updatedAt": (now - timedelta(days=14)).isoformat()},
         {"rank": 7, "nickname": "인디게임개발자", "points": 4900, "updatedAt": (now - timedelta(days=22)).isoformat()},
         {"rank": 8, "nickname": "파이썬빌더", "points": 4600, "updatedAt": (now - timedelta(days=12)).isoformat()},
         {"rank": 9, "nickname": "AI조련사", "points": 4300, "updatedAt": (now - timedelta(days=6)).isoformat()},
         {"rank": 10, "nickname": "슈퍼프론트엔드", "points": 4000, "updatedAt": (now - timedelta(days=19)).isoformat()},
         {"rank": 11, "nickname": "오픈소스기여자", "points": 3800, "updatedAt": (now - timedelta(days=3)).isoformat()},
         {"rank": 12, "nickname": "디버깅마스터", "points": 3400, "updatedAt": (now - timedelta(days=28)).isoformat()},
         {"rank": 13, "nickname": "블록체인해커", "points": 3100, "updatedAt": (now - timedelta(days=32)).isoformat()},
         {"rank": 14, "nickname": "서버아키텍트", "points": 2900, "updatedAt": (now - timedelta(days=50)).isoformat()},
    ]
    import random
    random.seed(42)
    names = ["코딩머신", "버그잡이", "해커", "디자이너", "오픈소스러", "엔지니어", "서버관리자", "넥스트제이에스", "노드제이에스", "자바스프링", "고랭최고", "파이썬맨"]
    modifiers = ["빠른", "느린", "조용한", "화난", "강력한", "행복한", "용감한", "천재", "바보"]
    for i in range(50):
        rankings.append({
            "rank": 0,
            "nickname": f"{random.choice(modifiers)}{random.choice(names)}{i}",
            "points": random.randint(100, 11000),
            "updatedAt": (now - timedelta(days=random.randint(1, 60))).isoformat()
        })
    
    if days:
        cutoff = now - timedelta(days=days)
        # Using string comparison for isoformat works fine, but parsing is safer
        # Python 3.7+ fromisoformat handles simple iso formats
        rankings = [r for r in rankings if datetime.fromisoformat(r["updatedAt"]) >= cutoff]
        
    # Re-rank strictly sequentially for the filtered (or unfiltered) output
    rankings.sort(key=lambda x: x["points"], reverse=True)
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
