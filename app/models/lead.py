from pydantic import BaseModel, EmailStr
from typing import Optional

class LeadBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    status: str

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[str] = None

class LeadOut(LeadBase):
    id: str
