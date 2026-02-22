from pydantic import BaseModel
from typing import List, Optional

class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    leads: Optional[List[str]] = []

class CampaignCreate(CampaignBase):
    pass

class CampaignOut(CampaignBase):
    id: str
    statistics: Optional[dict] = {}
