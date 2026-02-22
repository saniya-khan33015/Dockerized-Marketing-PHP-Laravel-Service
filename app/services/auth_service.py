from app.core.database import db
from app.models.user import UserCreate, UserLogin, UserOut
from app.utils.bcrypt import hash_password, verify_password
from app.utils.jwt import create_access_token
from bson import ObjectId

ROLE_ADMIN = "Admin"
ROLE_EXECUTIVE = "Marketing Executive"

users_collection = db["users"]

def register_user(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise Exception("User already exists")
    # Only allow one Admin
    if user.role == ROLE_ADMIN:
        if users_collection.find_one({"role": ROLE_ADMIN}):
            raise Exception("An Admin already exists")
    hashed = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed
    user_dict["role"] = user_dict.get("role", ROLE_EXECUTIVE)
    result = users_collection.insert_one(user_dict)
    return UserOut(id=str(result.inserted_id), **user_dict)

def login_user(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise Exception("Invalid credentials")
    token = create_access_token({"sub": str(db_user["_id"]), "role": db_user["role"]})
    return {"access_token": token, "token_type": "bearer"}
