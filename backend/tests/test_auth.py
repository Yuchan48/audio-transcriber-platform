def test_register_success_sets_auth_cookie(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "new-user@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["email"] == "new-user@example.com"
    assert payload["role"] == "user"
    assert "access_token" in response.cookies


def test_register_duplicate_email_returns_400(client, register_user):
    register_user("dup@example.com", "password123")

    response = client.post(
        "/api/auth/register",
        json={"email": "dup@example.com", "password": "password123"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success_sets_auth_cookie(client, register_user):
    register_user("login-user@example.com", "password123")

    response = client.post(
        "/api/auth/login",
        json={"email": "login-user@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "login-user@example.com"
    assert "access_token" in response.cookies


def test_login_invalid_credentials_returns_401(client, register_user):
    register_user("invalid-login@example.com", "password123")

    response = client.post(
        "/api/auth/login",
        json={"email": "invalid-login@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_logout_clears_cookie(client, register_user):
    register_user("logout-user@example.com", "password123")
    login_response = client.post(
        "/api/auth/login",
        json={"email": "logout-user@example.com", "password": "password123"},
    )
    assert login_response.status_code == 200
    assert "access_token" in client.cookies

    response = client.post("/api/auth/logout")

    assert response.status_code == 200
    assert response.json()["message"] == "Logout successful"
