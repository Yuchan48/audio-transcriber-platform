import io

import pytest
from fastapi import HTTPException, UploadFile

from app.utils.file_validation import (
    validate_file_size,
    validate_file_type,
)


def create_upload_file(
    filename: str,
    content: bytes = b"test content",
) -> UploadFile:
    return UploadFile(
        file=io.BytesIO(content),
        filename=filename,
    )


def test_validate_file_type_accepts_mp3():
    file = create_upload_file("audio.mp3")

    validate_file_type(file)


def test_validate_file_type_rejects_unsupported_extension():
    file = create_upload_file("audio.txt")

    with pytest.raises(HTTPException) as exc_info:
        validate_file_type(file)

    assert exc_info.value.status_code == 400
    assert "Unsupported file type" in exc_info.value.detail


def test_validate_file_type_rejects_missing_filename():
    file = create_upload_file("")

    with pytest.raises(HTTPException) as exc_info:
        validate_file_type(file)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Filename is missing"


def test_validate_file_size_accepts_file_within_limit(monkeypatch):
    import app.utils.file_validation as file_validation

    monkeypatch.setattr(file_validation, "MAX_FILE_SIZE", 10)

    file = create_upload_file("audio.mp3", b"12345")

    result = validate_file_size(file)

    assert result == b"12345"


def test_validate_file_size_rejects_file_over_limit(monkeypatch):
    import app.utils.file_validation as file_validation

    monkeypatch.setattr(file_validation, "MAX_FILE_SIZE", 5)

    file = create_upload_file("audio.mp3", b"123456")

    with pytest.raises(HTTPException) as exc_info:
        validate_file_size(file)

    assert exc_info.value.status_code == 403
    assert "File size exceeds the limit" in exc_info.value.detail
