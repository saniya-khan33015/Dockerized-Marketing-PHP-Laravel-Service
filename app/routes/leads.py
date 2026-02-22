from fastapi import APIRouter, Depends, HTTPException
from app.models.lead import LeadCreate, LeadUpdate, LeadOut
from app.services.lead_service import create_lead, get_leads, update_lead, delete_lead, search_leads

router = APIRouter()

@router.post("/", response_model=LeadOut)
def create(lead: LeadCreate):
    try:
        return create_lead(lead)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[LeadOut])
def read():
    return get_leads()

@router.put("/{lead_id}", response_model=LeadOut)
def update(lead_id: str, lead: LeadUpdate):
    return update_lead(lead_id, lead)

@router.delete("/{lead_id}")
def delete(lead_id: str):
    return delete_lead(lead_id)

@router.get("/search", response_model=list[LeadOut])
def search(query: str = "", status: str = None):
    return search_leads(query, status)
