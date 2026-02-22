from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routes import auth, leads, campaigns
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

app = FastAPI(title="Marketing Management Web Application")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(leads.router, prefix="/leads", tags=["Leads"])
app.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns"])

# Serve static files (client UI)
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(os.path.dirname(__file__)), "client"), html=True), name="static")

# Optional: Serve index.html for root
@app.get("/")
def read_index():
    return FileResponse(os.path.join(os.path.dirname(os.path.dirname(__file__)), "client", "index.html"))
