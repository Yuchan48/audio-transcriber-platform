import pytest
import requests

import app.services.deepgram_service as deepgram_service


def test_transcribe_file_returns_transcript(tmp_path, monkeypatch):
    audio_file = tmp_path / "sample.mp3"
    audio_file.write_bytes(b"fake audio")

    class MockResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {
                "results": {
                    "channels": [
                        {
                            "alternatives": [
                                {
                                    "transcript": "Hello world",
                                }
                            ]
                        }
                    ]
                }
            }

    def mock_post(*args, **kwargs):
        return MockResponse()

    monkeypatch.setattr(
        deepgram_service.requests,
        "post",
        mock_post,
    )

    result = deepgram_service.transcribe_file(str(audio_file))

    assert result == "Hello world"


def test_transcribe_file_rejects_unknown_mime_type(tmp_path):
    audio_file = tmp_path / "sample.unknown"
    audio_file.write_bytes(b"fake audio")

    with pytest.raises(Exception) as exc_info:
        deepgram_service.transcribe_file(str(audio_file))

    assert "Could not determine MIME type" in str(exc_info.value)


def test_transcribe_file_retries_after_request_failure(
    tmp_path,
    monkeypatch,
):
    audio_file = tmp_path / "sample.mp3"
    audio_file.write_bytes(b"fake audio")

    attempts = 0

    def mock_post(*args, **kwargs):
        nonlocal attempts
        attempts += 1

        if attempts < 3:
            raise requests.exceptions.RequestException()

        class MockResponse:
            def raise_for_status(self):
                pass

            def json(self):
                return {
                    "results": {
                        "channels": [
                            {
                                "alternatives": [
                                    {
                                        "transcript": "Hello world",
                                    }
                                ]
                            }
                        ]
                    }
                }

        return MockResponse()

    monkeypatch.setattr(
        deepgram_service.requests,
        "post",
        mock_post,
    )
    monkeypatch.setattr(
        deepgram_service.time,
        "sleep",
        lambda _: None,
    )

    result = deepgram_service.transcribe_file(str(audio_file))

    assert result == "Hello world"
    assert attempts == 3


def test_transcribe_file_fails_after_max_retries(
    tmp_path,
    monkeypatch,
):
    audio_file = tmp_path / "sample.mp3"
    audio_file.write_bytes(b"fake audio")

    attempts = 0

    def mock_post(*args, **kwargs):
        nonlocal attempts
        attempts += 1
        raise requests.exceptions.RequestException()

    monkeypatch.setattr(
        deepgram_service.requests,
        "post",
        mock_post,
    )
    monkeypatch.setattr(
        deepgram_service.time,
        "sleep",
        lambda _: None,
    )

    with pytest.raises(Exception) as exc_info:
        deepgram_service.transcribe_file(str(audio_file))

    assert str(exc_info.value) == "Deepgram request failed"
    assert attempts == deepgram_service.MAX_RETRIES
