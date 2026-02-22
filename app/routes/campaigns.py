from fastapi import APIRouter, Depends
from app.models.campaign import CampaignCreate, CampaignOut
from app.services.campaign_service import create_campaign, assign_leads, get_campaign_stats

router = APIRouter()

@router.post("/", response_model=CampaignOut)
def create(campaign: CampaignCreate):
    return create_campaign(campaign)

@router.post("/{campaign_id}/assign")
def assign(campaign_id: str, leads: list[str]):
    return assign_leads(campaign_id, leads)

@router.get("/{campaign_id}/stats")
def stats(campaign_id: str):
    return get_campaign_stats(campaign_id)
