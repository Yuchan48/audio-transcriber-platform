import mimetypes
import os
import time

import requests
from dotenv import load_dotenv
from requests.exceptions import RequestException, Timeout

load_dotenv()

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
DEEPGRAM_ENDPOINT = "https://api.deepgram.com/v1/listen?punctuate=true"

MAX_RETRIES = 3
REQUEST_TIMEOUT = 30  # seconds


def transcribe_file(file_path: str) -> str:

    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        raise Exception(f"Could not determine MIME type for file: {file_path}")
    # Sends the audio file to Deepgram and returns the transcription
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": mime_type,
    }
    params = {
        "model": "nova-3",
        "smart_format": "true",
    }

    for attempt in range(MAX_RETRIES):
        try:
            with open(file_path, "rb") as audio_file:
                response = requests.post(
                    DEEPGRAM_ENDPOINT,
                    headers=headers,
                    params=params,
                    data=audio_file,
                    timeout=REQUEST_TIMEOUT,
                )

            # Check if the request was successful
            response.raise_for_status()
            data = response.json()

            return data["results"]["channels"][0]["alternatives"][0]["transcript"]

        except Timeout:
            # If it's the last attempt, raise an exception. Otherwise, wait and retry.
            if attempt == MAX_RETRIES - 1:
                raise Exception("Deepgram request timed out")
            # Exponential backoff before retrying
            time.sleep(2**attempt)

        except RequestException:
            # If it's the last attempt, raise an exception. Otherwise, wait and retry.
            if attempt == MAX_RETRIES - 1:
                raise Exception("Deepgram request failed")
            # Exponential backoff before retrying
            time.sleep(2**attempt)

    raise Exception("Transcription failed")
