from google.oauth2 import id_token
from google.auth.transport import requests

import os
from dotenv import load_dotenv

load_dotenv()


def verify_google_token(token: str):
    try:
        google_user = id_token.verify_oauth2_token(
            token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID")
        )

        return {
            "email": google_user["email"],
            "sub": google_user["sub"],
            "name": google_user.get("name"),
            "picture": google_user.get("picture"),
        }
    except Exception as e:
        raise ValueError("Invalid Google token") from e
