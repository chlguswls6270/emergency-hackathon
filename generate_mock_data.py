import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data" / "예시자료"

def load(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)

def save(filename, data):
    with open(DATA_DIR / filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

hackathons = load("public_hackathons.json")
details = load("public_hackathon_detail.json")
teams = load("public_teams.json")
leaderboards = load("public_leaderboard.json")

# 1. Add 10 Hackathons
new_hacks = [
    {"slug": "edtech-vision-2026", "title": "EdTech Vision: 교육의 미래 해커톤", "status": "upcoming", "tags": ["EdTech", "Education", "AI"], "thumbnailUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-06-15T10:00:00+09:00", "endAt": "2026-06-20T10:00:00+09:00"}, "links": {"detail": "/hackathons/edtech-vision-2026", "rules": "#", "faq": "#"}},
    {"slug": "health-med-ai-2026", "title": "메디텍 AI 헬스케어 해커톤", "status": "ongoing", "tags": ["HealthTech", "MedTech", "AI"], "thumbnailUrl": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-03-24T10:00:00+09:00", "endAt": "2026-03-28T10:00:00+09:00"}, "links": {"detail": "/hackathons/health-med-ai-2026", "rules": "#", "faq": "#"}},
    {"slug": "game-jam-indie-2026", "title": "2026 인디 게임잼 페스티벌", "status": "ended", "tags": ["Game", "Unity", "Unreal"], "thumbnailUrl": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-01-15T10:00:00+09:00", "endAt": "2026-01-20T10:00:00+09:00"}, "links": {"detail": "/hackathons/game-jam-indie-2026", "rules": "#", "faq": "#"}},
    {"slug": "cybersec-defense-2026", "title": "사이버보안 방어기제 해커톤", "status": "upcoming", "tags": ["Security", "Network", "Hacking"], "thumbnailUrl": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-07-01T10:00:00+09:00", "endAt": "2026-07-10T10:00:00+09:00"}, "links": {"detail": "/hackathons/cybersec-defense-2026", "rules": "#", "faq": "#"}},
    {"slug": "open-source-contrib-2026", "title": "오픈소스 기여톤 (Contribthon)", "status": "ongoing", "tags": ["OpenSource", "GitHub", "Community"], "thumbnailUrl": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-03-29T10:00:00+09:00", "endAt": "2026-04-05T10:00:00+09:00"}, "links": {"detail": "/hackathons/open-source-contrib-2026", "rules": "#", "faq": "#"}},
    {"slug": "data-science-climate-2026", "title": "기후변화 대응 데이터 사이언스", "status": "upcoming", "tags": ["Data", "Climate", "Python"], "thumbnailUrl": "https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-08-10T10:00:00+09:00", "endAt": "2026-08-20T10:00:00+09:00"}, "links": {"detail": "/hackathons/data-science-climate-2026", "rules": "#", "faq": "#"}},
    {"slug": "smart-city-mobility-2026", "title": "스마트시티 모빌리티 챌린지", "status": "ended", "tags": ["Mobility", "SmartCity", "Hardware"], "thumbnailUrl": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-02-01T10:00:00+09:00", "endAt": "2026-02-05T10:00:00+09:00"}, "links": {"detail": "/hackathons/smart-city-mobility-2026", "rules": "#", "faq": "#"}},
    {"slug": "robotics-control-2026", "title": "차세대 로보틱스 제어 해커톤", "status": "upcoming", "tags": ["Robotics", "C++", "ROS"], "thumbnailUrl": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-09-01T10:00:00+09:00", "endAt": "2026-09-10T10:00:00+09:00"}, "links": {"detail": "/hackathons/robotics-control-2026", "rules": "#", "faq": "#"}},
    {"slug": "cloud-native-devops-2026", "title": "Cloud Native DevOps 대회", "status": "ongoing", "tags": ["Cloud", "DevOps", "Kubernetes"], "thumbnailUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-03-31T10:00:00+09:00", "endAt": "2026-04-02T10:00:00+09:00"}, "links": {"detail": "/hackathons/cloud-native-devops-2026", "rules": "#", "faq": "#"}},
    {"slug": "ar-vr-metaverse-2026", "title": "AR/VR 메타버스 크리에이터톤", "status": "ended", "tags": ["AR", "VR", "Metaverse"], "thumbnailUrl": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2025-12-10T10:00:00+09:00", "endAt": "2025-12-25T10:00:00+09:00"}, "links": {"detail": "/hackathons/ar-vr-metaverse-2026", "rules": "#", "faq": "#"}}
]
hackathons.extend(new_hacks)
save("public_hackathons.json", hackathons)

# 2. Add 10 Details
new_details = []
for h in new_hacks:
    new_details.append({
        "slug": h["slug"],
        "title": h["title"],
        "sections": {
            "schedule": {
                "timezone": "Asia/Seoul",
                "milestones": [
                    {"name": "접수 시작", "at": h["period"]["submissionDeadlineAt"].replace("10:00:00", "00:00:00")},
                    {"name": "본 행사 시작", "at": h["period"]["submissionDeadlineAt"]},
                    {"name": "제출 마감", "at": h["period"]["endAt"]}
                ]
            },
            "eval": {
                "metricName": "종합점수"
            }
        }
    })
if "extraDetails" in details:
    details["extraDetails"].extend(new_details)
else:
    if isinstance(details, list):
        details.extend(new_details)
save("public_hackathon_detail.json", details)

# 3. Add 10 Teams
new_teams = [
    {"teamCode": f"T-NEW-{i+1}", "hackathonSlug": new_hacks[i]["slug"], "name": f"Team {new_hacks[i]['tags'][0]}", "isOpen": True, "lookingFor": ["Designer", "Frontend"], "intro": f"{new_hacks[i]['title']}에 참가할 멋진 팀원을 구합니다. 열정이 가장 중요합니다!", "contact": {"url": f"https://open.kakao.com/o/new{i}"}}
    for i in range(10)
]
teams.extend(new_teams)
save("public_teams.json", teams)

# 4. Add Leaderboards for these
if "extraLeaderboards" not in leaderboards:
    leaderboards["extraLeaderboards"] = []

for i, h in enumerate(new_hacks):
    if h["status"] == "ended":
        leaderboards["extraLeaderboards"].append({
            "hackathonSlug": h["slug"],
            "entries": [
                {"rank": 1, "nickname": f"Team {h['tags'][0]}", "score": 98.5},
                {"rank": 2, "nickname": "CodeBreakers", "score": 92.0},
                {"rank": 3, "nickname": "Innovators", "score": 88.5}
            ]
        })
    elif h["status"] == "ongoing":
        # Add some submissions
        leaderboards["extraLeaderboards"].append({
            "hackathonSlug": h["slug"],
            "entries": [
                {"rank": 1, "nickname": "EarlyBirds", "score": 85.0},
                {"rank": 2, "nickname": f"Team {h['tags'][0]}", "score": "Pending"}
            ]
        })
save("public_leaderboard.json", leaderboards)

print("Mock data successfully generated!")
