from app.core.security import hash_password, verify_password


def test_hash_password_returns_different_value():
    password = "password123"

    hashed = hash_password(password)

    assert hashed != password
    assert isinstance(hashed, str)


def test_hash_password_creates_different_hashes():
    password = "password123"

    hash_one = hash_password(password)
    hash_two = hash_password(password)

    assert hash_one != hash_two


def test_verify_password_accepts_correct_password():
    password = "password123"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_verify_password_rejects_incorrect_password():
    password = "password123"
    hashed = hash_password(password)

    assert verify_password("wrong-password", hashed) is False
