import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal
from app.models.models import AudioFile


def cleanup_orphan_files():
    db = SessionLocal()

    try:
        db_files = {
            Path(a.file_path).name
            for a in db.query(AudioFile).all()
            if a.file_path
        }

        upload_dir = Path("uploads")  # adjust if needed

        deleted = 0

        for file in upload_dir.iterdir():
            if file.is_file() and file.name not in db_files:
                print(f"Deleting orphan file: {file.name}")
                file.unlink()
                deleted += 1

        print(f"\nCleanup complete. Deleted {deleted} files.")

    finally:
        db.close()


if __name__ == "__main__":
    cleanup_orphan_files()

""" import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))


from app.db.session import SessionLocal
from app.models.models import AudioFile

def cleanup_orphan_files():
    db = SessionLocal()
    try:
        db_files = {
            Path(a.file_path).name for a in db.query(AudioFile).all() if a.file_path
        }
        BASE_DIR = Path(__file__).resolve().parents[1]
        upload_dir = BASE_DIR / "uploads"
        deleted_files = 0

        for file in upload_dir.iterdir():
            print("Checking:", file.name)
            if file.is_file() and file.name not in db_files:
                print(f"Deleting orphan file: {file.name}")
                file.unlink()
                deleted_files += 1
        print(f"Deleted {deleted_files} orphan files.")
    finally:
        db.close()
 """
