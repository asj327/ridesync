import math
import uuid
from sqlalchemy.orm import Session
from models import PoolRequest

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """Calculates the physical distance in kilometers between two GPS coordinates."""
    R = 6371.0 
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def process_pool_request(db: Session, request_data, max_radius_km=5.0):
    """Saves user to the SQLite database, searches for matches, and updates statuses."""
    
    # 1. Save the new user's request to the database
    new_request = PoolRequest(
        user_id=request_data.user_id,
        station_id=request_data.station_id,
        dest_lat=request_data.dest_lat,
        dest_lng=request_data.dest_lng,
        status="waiting"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # 2. Query the database for other users waiting at the SAME station
    waiting_users = db.query(PoolRequest).filter(
        PoolRequest.station_id == request_data.station_id,
        PoolRequest.status == "waiting",
        PoolRequest.id != new_request.id # Don't match with ourselves
    ).all()

    potential_matches = []
    
    # 3. Apply Haversine filtering
    for passenger in waiting_users:
        distance = calculate_haversine_distance(
            request_data.dest_lat, request_data.dest_lng, 
            passenger.dest_lat, passenger.dest_lng
        )
        if distance <= max_radius_km:
            potential_matches.append(passenger)

    # 4. Form the Pool (Need 2 others + the current user = 3 total)
    if len(potential_matches) >= 2:
        pool_code = f"#KCH-{str(uuid.uuid4())[:4].upper()}"
        
        # Update the new user
        new_request.status = "matched"
        new_request.pool_code = pool_code
        
        # Update the matched passengers in the DB
        matched_passengers = potential_matches[:2]
        for p in matched_passengers:
            p.status = "matched"
            p.pool_code = pool_code
            
        db.commit() # Save all status changes to the database

        return {
            "status": "matched",
            "pool_code": pool_code,
            "meeting_point": f"{request_data.station_id.capitalize()} Station - Exit A Auto Stand",
            "co_passengers": [{"user_id": p.user_id} for p in matched_passengers]
        }
    
    return {"status": "waiting", "message": "Added to database queue. Scanning for co-passengers..."}