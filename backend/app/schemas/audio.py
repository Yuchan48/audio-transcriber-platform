from pydantic import BaseModel


class AudioFileCreate(BaseModel):
    message: str
    audio_file_id: int


class AudioFileMetadata(BaseModel):
    id: int
    filename: str
    status: str


class AdminAudioFileResponse(BaseModel):
    id: int
    filename: str
    status: str
    user_id: int
    user_email: str

    class Config:
        orm_mode = True
