
import mimetypes
import os
import requests
from dotenv import load_dotenv
load_dotenv()

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
DEEPGRAM_ENDPOINT = "https://api.deepgram.com/v1/listen?punctuate=true"

def transcribe_file(file_path:str) -> str:
    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        raise Exception(f"Could not determine MIME type for file: {file_path}")
    # Sends the audio file to Deepgram and returns the transcription
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": mime_type
    }
    params = {
        "model": "nova-3",
        "smart_format": "true",
    }
    # Read the audio file and send it to Deepgram
    with open(file_path, 'rb') as audio_file:
        response = requests.post(DEEPGRAM_ENDPOINT, headers=headers, params=params, data=audio_file)
    if response.status_code != 200:
        raise Exception(f"Deepgram API request failed with status code {response.status_code}: {response.text}")
    data = response.json()
    return data["results"]["channels"][0]["alternatives"][0]["transcript"]
