import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://mongo:27017/")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "marketing_db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    BCRYPT_ROUNDS: int = int(os.getenv("BCRYPT_ROUNDS", 12))

settings = Settings()
