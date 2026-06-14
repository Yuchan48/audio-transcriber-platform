from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)
