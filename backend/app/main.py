from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Import our local modules
import models
import database
from decision_engine import process_pool_request

# 1. Initialize the Database
# This line tells SQLAlchemy to look at models.py and instantly create the 
# 'ridesync_prod.db' file and tables if they don't exist yet.
models.Base.metadata.create_all(bind=database.engine)

# 2. Start FastAPI
app = FastAPI(title="RideSync API", version="1.0")

# 3. CORS Configuration
# Crucial for local hackathon development so your HTML file isn't blocked by browser security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Pydantic Schema (Data Validation)
# This validates the JSON coming from your frontend api.js file
class PoolRequestSchema(BaseModel):
    user_id: str
    station_id: str
    dest_lat: float
    dest_lng: float

# 5. The Core Matching Endpoint
@app.post("/api/request-pool")
def request_pool(request: PoolRequestSchema, db: Session = Depends(database.get_db)):
    """
    Receives frontend request, opens a DB session, and hands it to the decision engine.
    """
    print(f"📥 DB Request: User {request.user_id} entering queue at {request.station_id}")
    
    # Hand off to the logic in decision_engine.py
    match_result = process_pool_request(db, request)
    return match_result

# 6. The Hackathon Debug Endpoint
@app.get("/api/debug/db")
def view_database(db: Session = Depends(database.get_db)):
    """
    Shows all current database rows in your browser. 
    Go to http://127.0.0.1:8000/api/debug/db to view it live during the pitch!
    """
    all_requests = db.query(models.PoolRequest).all()
    return {
        "status": "success",
        "total_active_users": len(all_requests),
        "data": all_requests
    }

 