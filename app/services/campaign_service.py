from app.core.database import db
from app.models.campaign import CampaignCreate, CampaignOut
from bson import ObjectId

campaigns_collection = db["campaigns"]
leads_collection = db["leads"]

def create_campaign(campaign: CampaignCreate):
    campaign_dict = campaign.dict()
    campaign_dict["leads"] = campaign_dict.get("leads", [])
    result = campaigns_collection.insert_one(campaign_dict)
    return CampaignOut(id=str(result.inserted_id), **campaign_dict)

def assign_leads(campaign_id: str, leads: list[str]):
    campaigns_collection.update_one({"_id": ObjectId(campaign_id)}, {"$addToSet": {"leads": {"$each": leads}}})
    return {"msg": "Leads assigned"}

def get_campaign_stats(campaign_id: str):
    campaign = campaigns_collection.find_one({"_id": ObjectId(campaign_id)})
    if not campaign:
        return {"msg": "Campaign not found"}
    lead_ids = campaign.get("leads", [])
    stats = {"total_leads": len(lead_ids)}
    status_count = {s: 0 for s in ["New", "Contacted", "Converted", "Lost"]}
    for lid in lead_ids:
        lead = leads_collection.find_one({"_id": ObjectId(lid)})
        if lead:
            status_count[lead["status"]] += 1
    stats["status_count"] = status_count
    return stats
