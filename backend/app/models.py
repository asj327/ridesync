from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class PoolRequest(Base):
    """
    This class defines the 'pool_requests' table in our SQLite database.
    Every time a user clicks 'Find Co-Passengers', a new row is added here.
    """
    __tablename__ = "pool_requests"

    # Unique identifier for the database row
    id = Column(Integer, primary_key=True, index=True)
    
    # Who is riding and from where
    user_id = Column(String, index=True)
    station_id = Column(String, index=True)
    
    # Where they are going
    dest_lat = Column(Float)
    dest_lng = Column(Float)
    
    # State management for the matching engine
    status = Column(String, default="waiting")  # Can be 'waiting', 'matched', or 'completed'
    
    # The shared code generated when a match is successfully found
    pool_code = Column(String, nullable=True)
    
    # Timestamp to track how long people have been waiting
    created_at = Column(DateTime, default=datetime.utcnow)