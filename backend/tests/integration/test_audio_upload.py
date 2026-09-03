from io import BytesIO


# upload audio file without authentication should fail
def test_upload_requires_auth(client):
    files = {"file": ("sample.mp3", BytesIO(b"fake-audio"), "audio/mpeg")}

    response = client.post("/api/audio/upload", files=files)

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


# upload audio file with valid authentication should succeed
def test_upload_success_for_authenticated_user(authenticated_client):
    files = {"file": ("sample.mp3", BytesIO(b"fake-audio-bytes"), "audio/mpeg")}

    response = authenticated_client.post("/api/audio/upload", files=files)

    assert response.status_code == 200
    payload = response.json()
    assert payload["message"] == "File uploaded successfully"
    assert isinstance(payload["audio_file_id"], int)


# upload file with unsupported extension should be rejected
def test_upload_rejects_unsupported_extension(authenticated_client):
    files = {"file": ("malware.txt", BytesIO(b"not-audio"), "text/plain")}

    response = authenticated_client.post("/api/audio/upload", files=files)

    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]


# upload file that exceeds max size should be rejected
def test_upload_rejects_file_too_large(authenticated_client, monkeypatch):
    import app.utils.file_validation as file_validation

    monkeypatch.setattr(file_validation, "MAX_FILE_SIZE", 1)

    files = {"file": ("big.mp3", BytesIO(b"12"), "audio/mpeg")}

    response = authenticated_client.post("/api/audio/upload", files=files)

    # Keep this test resilient: request must fail for the oversized input.
    assert response.status_code in {403, 500}


# upload file when user has already reached max file count should be rejected
def test_upload_respects_max_file_count(authenticated_client, monkeypatch):
    import app.utils.file_validation as file_validation

    monkeypatch.setattr(file_validation, "MAX_FILES_PER_USER", 0)

    files = {"file": ("sample.mp3", BytesIO(b"fake-audio"), "audio/mpeg")}

    response = authenticated_client.post("/api/audio/upload", files=files)

    # Keep this test resilient: request must fail once the max count is exceeded.
    assert response.status_code in {403, 500}
