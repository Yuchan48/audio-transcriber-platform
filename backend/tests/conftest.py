import sys
from pathlib import Path

# Ensure backend root is importable when running pytest from repository root.
BACKEND_ROOT = Path(__file__).resolve().parents[1]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))
