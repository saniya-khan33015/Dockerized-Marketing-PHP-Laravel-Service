from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
