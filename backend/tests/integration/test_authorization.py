# Protected routes should return 401 if no valid auth cookie is provided
def test_me_requires_auth(client):
    response = client.get("/api/user/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


# Protected routes should return user info if valid auth cookie is provided
def test_me_with_valid_cookie_returns_user(authenticated_client):
    response = authenticated_client.get("/api/user/me")

    assert response.status_code == 200
    payload = response.json()
    assert payload["email"] == "auth-user@example.com"
    assert payload["role"] == "user"


# Admin-only routes for /api/user/all should return 403 if authenticated user is not an admin
def test_admin_users_route_forbidden_for_normal_user(authenticated_client):
    response = authenticated_client.get("/api/user/all")

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


# Admin-only routes for /api/audio/all should return 403 if authenticated user is not an admin
def test_admin_audio_route_forbidden_for_normal_user(authenticated_client):
    response = authenticated_client.get("/api/audio/all")

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


# Admin-only routes for /api/user/all should return 200 and list of users if authenticated user is an admin
def test_admin_route_allowed_for_admin_user(client, admin_user):
    login_response = client.post(
        "/api/auth/login",
        json={"email": admin_user["email"], "password": admin_user["password"]},
    )
    assert login_response.status_code == 200

    response = client.get("/api/user/all")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
