from app.core.database import db
from app.models.lead import LeadCreate, LeadUpdate, LeadOut
from bson import ObjectId

leads_collection = db["leads"]

STATUS_LIST = ["New", "Contacted", "Converted", "Lost"]

def create_lead(lead: LeadCreate):
    lead_dict = lead.dict()
    lead_dict["status"] = lead_dict.get("status", "New")
    # Check for duplicate email
    if leads_collection.find_one({"email": lead_dict["email"]}):
        raise ValueError("Lead with this email already exists.")
    result = leads_collection.insert_one(lead_dict)
    return LeadOut(id=str(result.inserted_id), **lead_dict)

def get_leads():
    leads = list(leads_collection.find())
    return [LeadOut(id=str(l["_id"]), **l) for l in leads]

def update_lead(lead_id: str, lead: LeadUpdate):
    update_dict = {k: v for k, v in lead.dict().items() if v is not None}
    leads_collection.update_one({"_id": ObjectId(lead_id)}, {"$set": update_dict})
    updated = leads_collection.find_one({"_id": ObjectId(lead_id)})
    return LeadOut(id=lead_id, **updated)

def delete_lead(lead_id: str):
    leads_collection.delete_one({"_id": ObjectId(lead_id)})
    return {"msg": "Lead deleted"}

def search_leads(query: str = "", status: str = None):
    filter_ = {}
    if query:
        filter_["$or"] = [
            {"name": {"$regex": query, "$options": "i"}},
            {"email": {"$regex": query, "$options": "i"}},
            {"phone": {"$regex": query, "$options": "i"}}
        ]
    if status:
        filter_["status"] = status
    leads = list(leads_collection.find(filter_))
    return [LeadOut(id=str(l["_id"]), **l) for l in leads]
