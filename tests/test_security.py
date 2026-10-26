from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.main import app
from app.office.store import OfficeStore

client = TestClient(app)


def test_api_token_protects_api_routes_but_not_health(monkeypatch) -> None:
    token = "test-access-token-0123456789abcdef"
    monkeypatch.setattr(app.state, "api_access_token", token)

    assert client.get("/api/v1/health").status_code == 200
    assert client.get("/api/v1/office/agent-registry").status_code == 401
    response = client.get(
        "/api/v1/tasks/not-a-real-task",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404


def test_agent_serializer_never_returns_api_key() -> None:
    row = SimpleNamespace(
        agent_id="agt-test",
        name="Test",
        slug="test",
        description="",
        agent_type="general",
        status="idle",
        model_config={"api_key": "super-secret", "model_name": "test-model"},
        last_active_at=None,
        error_message=None,
        extra_metadata={},
        created_at=None,
        updated_at=None,
    )

    payload = OfficeStore._agent_row_to_dict(row)

    assert payload["model_config"]["api_key"] == ""
    assert payload["model_config"]["api_key_configured"] is True
    assert "super-secret" not in repr(payload)
