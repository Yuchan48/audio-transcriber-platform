from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Request
from typing import Dict
from app.core.jwt import decode_access_token
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/ws", tags=["ws"])

# In memory store for active connections (per user)
active_connections: Dict[int, WebSocket] = {}

# get current user from cookie
def get_current_user_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    token = websocket.cookies.get("access_token")
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    return payload.get("sub")

@router.websocket("/transcription")
async def websocket_transcriptions(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    user_id = get_current_user_ws(websocket, db)
    if not user_id:
        await websocket.close(code=1008)  # Policy Violation
        return

    active_connections[user_id] = websocket

    # print("Cookies:", websocket.cookies)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.pop(user_id, None)

