import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "daily-hacker"))
from backend import main, security

TOKEN = "test-access-code-" * 3
HEADERS = {"Authorization": f"Bearer {TOKEN}"}


@pytest.fixture
def client(monkeypatch, tmp_path):
    monkeypatch.setenv("DEMO_ACCESS_TOKEN", TOKEN)
    monkeypatch.delenv("ALLOW_LOCAL_DEMO", raising=False)
    monkeypatch.setattr(main, "UPLOAD_DIR", tmp_path / "uploads")
    main.UPLOAD_DIR.mkdir()
    security._requests.clear()
    return TestClient(main.app)


def upload(client, filename="report.txt", content=b"hello", headers=HEADERS):
    return client.post("/api/submit", data={"teamCode": "team", "hackathonSlug": "demo"},
                       files={"file": (filename, content)}, headers=headers)


def test_traversal_name_cannot_escape_and_round_trip(client):
    result = upload(client, "../../outside.txt")
    assert result.status_code == 200
    stored = result.json()["filename"]
    assert "/" not in stored and stored != "outside.txt"
    assert (main.UPLOAD_DIR / stored).read_bytes() == b"hello"
    assert not (main.UPLOAD_DIR.parent / "outside.txt").exists()
    response = client.get(f"/api/download/{stored}", headers=HEADERS)
    assert response.content == b"hello"
    assert response.headers["content-type"] == "application/octet-stream"
    assert "attachment" in response.headers["content-disposition"]
    assert response.headers["x-content-type-options"] == "nosniff"


def test_duplicate_names_do_not_overwrite(client):
    first = upload(client).json()["filename"]
    second = upload(client, content=b"second").json()["filename"]
    assert first != second
    assert (main.UPLOAD_DIR / first).read_bytes() == b"hello"


def test_auth_required_for_both_operations(client):
    assert upload(client, headers={}).status_code == 401
    assert client.get("/api/download/" + "a" * 32 + ".txt").status_code == 401
    assert not list(main.UPLOAD_DIR.iterdir())


def test_missing_token_fails_closed(client, monkeypatch):
    monkeypatch.delenv("DEMO_ACCESS_TOKEN")
    assert upload(client).status_code == 503


def test_reject_executable_extension(client):
    assert upload(client, "payload.html").status_code == 400
    assert not list(main.UPLOAD_DIR.iterdir())


def test_size_limit_cleans_partial_upload(client, monkeypatch):
    monkeypatch.setattr(main, "MAX_UPLOAD_BYTES", 4)
    assert upload(client).status_code == 413
    assert not list(main.UPLOAD_DIR.iterdir())


def test_storage_quota_cleans_partial_upload(client, monkeypatch):
    monkeypatch.setattr(main, "MAX_STORAGE_BYTES", 4)
    assert upload(client).status_code == 507
    assert not list(main.UPLOAD_DIR.iterdir())


def test_symlink_download_is_rejected(client):
    outside = main.UPLOAD_DIR.parent / "private.txt"
    outside.write_text("private")
    name = "a" * 32 + ".txt"
    (main.UPLOAD_DIR / name).symlink_to(outside)
    assert client.get(f"/api/download/{name}", headers=HEADERS).status_code == 404


def test_arbitrary_filename_is_rejected(client):
    assert client.get("/api/download/private.txt", headers=HEADERS).status_code == 404


def test_oversized_request_is_rejected_before_multipart_parsing(client):
    response = client.post("/api/submit", content=b"x" * (10 * 1024 * 1024 + 65_537),
                           headers={**HEADERS, "Content-Type": "application/octet-stream"})
    assert response.status_code == 413
    assert not list(main.UPLOAD_DIR.iterdir())

