from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, UserOut
from app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    return register_user(user)

@router.post("/login")
def login(user: UserLogin):
    return login_user(user)
