import json
import random
import time
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data" / "예시자료"

def load(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)

def save(filename, data):
    with open(DATA_DIR / filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

hackathons = load("public_hackathons.json")
teams = load("public_teams.json")

first_names = ["개발", "무적", "폭풍", "슈퍼", "천재", "바이브", "열정", "오픈", "로직", "알고리즘"]
last_names = ["코더스", "해커스", "마스터스", "크루", "스쿼드", "제네레이션", "고스트", "개척자들", "빌더스", "러너스"]
roles = ["Frontend", "Backend", "Fullstack", "Designer", "PM", "AI/ML", "DevOps", "Data", "iOS", "Android"]

# Count teams per hackathon
team_counts = {}
for t in teams:
    slug = t.get("hackathonSlug", "global")
    team_counts[slug] = team_counts.get(slug, 0) + 1

new_teams = []
ts = int(time.time() * 1000)

for h in hackathons:
    slug = h["slug"]
    current_count = team_counts.get(slug, 0)
    target = 10
    if current_count < target:
        for i in range(target - current_count):
            new_teams.append({
                "teamCode": f"T-FILL-{ts}-{slug}-{i}",
                "hackathonSlug": slug,
                "name": f"{random.choice(first_names)} {random.choice(last_names)}{i}",
                "isOpen": random.choice([True, False]),
                "lookingFor": random.sample(roles, k=random.randint(0, 3)),
                "intro": f"{h['title']} 우승을 목표로 달립니다!",
                "contact": {"url": f"https://example.com/{slug}-fill{i}"}
            })

teams.extend(new_teams)
save("public_teams.json", teams)
print(f"Generated {len(new_teams)} new teams for existing hackathons to reach at least 10 teams each!")
