import json
from pathlib import Path
import random
import time

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

new_hacks_2 = [
    {"slug": "fintech-security-2026", "title": "FinTech 보안 해커톤", "status": "upcoming", "tags": ["FinTech", "Security", "AI"], "thumbnailUrl": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-07-20T10:00:00+09:00", "endAt": "2026-07-25T10:00:00+09:00"}, "links": {"detail": "/hackathons/fintech-security-2026", "rules": "#", "faq": "#"}},
    {"slug": "smart-farm-ai-2026", "title": "스마트팜 AI 챌린지", "status": "ongoing", "tags": ["Agriculture", "AI", "Data"], "thumbnailUrl": "https://images.unsplash.com/photo-1592982537447-6f2a6a0a0305?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-03-27T10:00:00+09:00", "endAt": "2026-03-31T10:00:00+09:00"}, "links": {"detail": "/hackathons/smart-farm-ai-2026", "rules": "#", "faq": "#"}},
    {"slug": "spacetech-innovators", "title": "SpaceTech 혁신 해커톤", "status": "upcoming", "tags": ["Space", "Tech", "Hardware"], "thumbnailUrl": "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-08-12T10:00:00+09:00", "endAt": "2026-08-16T10:00:00+09:00"}, "links": {"detail": "/hackathons/spacetech-innovators", "rules": "#", "faq": "#"}},
    {"slug": "healthcare-wearables", "title": "헬스케어 웨어러블톤", "status": "ended", "tags": ["Health", "Wearables", "IoT"], "thumbnailUrl": "https://images.unsplash.com/photo-1550543621-e0b4aafa4f4b?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-01-05T10:00:00+09:00", "endAt": "2026-01-10T10:00:00+09:00"}, "links": {"detail": "/hackathons/healthcare-wearables", "rules": "#", "faq": "#"}},
    {"slug": "blockchain-voting", "title": "블록체인 투표 시스템 해커톤", "status": "upcoming", "tags": ["Blockchain", "Web3", "CivicTech"], "thumbnailUrl": "https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-09-15T10:00:00+09:00", "endAt": "2026-09-20T10:00:00+09:00"}, "links": {"detail": "/hackathons/blockchain-voting", "rules": "#", "faq": "#"}},
    {"slug": "ai-ethics-challenge", "title": "AI 윤리 검증 챌린지", "status": "ongoing", "tags": ["AI", "Ethics", "Policy"], "thumbnailUrl": "https://images.unsplash.com/photo-1531297172864-ab03770453e1?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-03-24T10:00:00+09:00", "endAt": "2026-03-30T10:00:00+09:00"}, "links": {"detail": "/hackathons/ai-ethics-challenge", "rules": "#", "faq": "#"}},
    {"slug": "edtech-gamification", "title": "교육 게이미피케이션 모바일톤", "status": "upcoming", "tags": ["EdTech", "Game", "UI"], "thumbnailUrl": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-10-01T10:00:00+09:00", "endAt": "2026-10-05T10:00:00+09:00"}, "links": {"detail": "/hackathons/edtech-gamification", "rules": "#", "faq": "#"}},
    {"slug": "proptech-realestate", "title": "프롭테크 부동산 자동화 해커톤", "status": "ended", "tags": ["PropTech", "RealEstate", "Data"], "thumbnailUrl": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2025-11-20T10:00:00+09:00", "endAt": "2025-11-25T10:00:00+09:00"}, "links": {"detail": "/hackathons/proptech-realestate", "rules": "#", "faq": "#"}},
    {"slug": "quantum-computing-101", "title": "양자 컴퓨팅 입문 웹 챌린지", "status": "upcoming", "tags": ["Quantum", "Research", "Physics"], "thumbnailUrl": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-11-10T10:00:00+09:00", "endAt": "2026-11-15T10:00:00+09:00"}, "links": {"detail": "/hackathons/quantum-computing-101", "rules": "#", "faq": "#"}},
    {"slug": "mobility-drone-delivery", "title": "드론 배송 라우팅 최적화 대회", "status": "ongoing", "tags": ["Mobility", "Drone", "Algorithm"], "thumbnailUrl": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600", "period": {"timezone": "Asia/Seoul", "submissionDeadlineAt": "2026-03-28T10:00:00+09:00", "endAt": "2026-04-03T10:00:00+09:00"}, "links": {"detail": "/hackathons/mobility-drone-delivery", "rules": "#", "faq": "#"}}
]
hackathons.extend(new_hacks_2)
save("public_hackathons.json", hackathons)

new_details_2 = []
for h in new_hacks_2:
    new_details_2.append({
        "slug": h["slug"],
        "title": h["title"],
        "sections": {
            "schedule": {
                "timezone": "Asia/Seoul",
                "milestones": [
                    {"name": "신청 시작", "at": h["period"]["submissionDeadlineAt"].replace("10:00:00", "00:00:00")},
                    {"name": "행사 시작", "at": h["period"]["submissionDeadlineAt"]},
                    {"name": "종료", "at": h["period"]["endAt"]}
                ]
            },
            "eval": {
                "metricName": "코드 완성도"
            }
        }
    })
if "extraDetails" in details:
    details["extraDetails"].extend(new_details_2)
else:
    if isinstance(details, list):
        details.extend(new_details_2)
save("public_hackathon_detail.json", details)

# Adds 10 random teams iteratively for each new hackathon
new_teams = []
first_names = ["코딩", "바이브", "열정", "새벽", "무한", "슈퍼", "알파", "오메가", "디지털", "지니어스"]
last_names = ["팀", "러너스", "해커스", "마스터스", "크루", "스쿼드", "제네레이션", "고스트", "개척자들", "빌더스"]
roles = ["Frontend", "Backend", "Fullstack", "Designer", "PM", "AI/ML", "DevOps", "Data"]

ts = int(time.time() * 1000)
for idx, h in enumerate(new_hacks_2):
    for i in range(10): # 10 teams per hackathon
        new_teams.append({
            "teamCode": f"T-BULK-{ts}-{idx}-{i}",
            "hackathonSlug": h["slug"],
            "name": f"{random.choice(first_names)} {random.choice(last_names)}{i}",
            "isOpen": random.choice([True, False]),
            "lookingFor": random.sample(roles, k=random.randint(0, 3)),
            "intro": f"{h['title']} 대회를 준비하는 팀입니다. 화이팅!",
            "contact": {"url": f"https://example.com/team{i}"}
        })
teams.extend(new_teams)
save("public_teams.json", teams)

print("Batch mock data with 10 Hackathons & 100 Teams Generated!")
