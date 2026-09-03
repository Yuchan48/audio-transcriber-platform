from datetime import datetime, timezone, timedelta

import pytest
from fastapi import HTTPException
from jose import jwt


from app.core.jwt import (
    ALGORITHM,
    SECRET_KEY,
    create_access_token,
    decode_access_token,
)


def test_create_access_token_contains_payload():
    data = {"sub": "123", "email": "user@example.com"}

    token = create_access_token(data)
    payload = decode_access_token(token)

    assert payload["sub"] == "123"
    assert payload["email"] == "user@example.com"
    assert "exp" in payload


def test_create_access_token_does_not_modify_original_data():
    data = {"sub": "123"}

    create_access_token(data)

    assert data == {"sub": "123"}


def test_decode_access_token_rejects_invalid_token():
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token("invalid-token")

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid token"


def test_decode_access_token_rejects_expired_token():
    assert SECRET_KEY is not None

    expired_payload = {
        "sub": "123",
        "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
    }

    token = jwt.encode(
        expired_payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Token has expired"
