import os 
from dotenv import load_dotenv

load_dotenv() 

class Settings:
    """"
    Central configuration for the RideSync API.
    """
    PROJECT_NAME: str = "RideSync API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Environment
    DEBUG_MODE: bool = os.getenv("DEBUG_MODE", True)
    
    # Database Settings (Mocked for MVP)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ridesync_mock.db")
    
    # Core Algorithm Constraints
    # We define the max grouping radius here so it can be easily adjusted without touching the math logic
    MAX_POOL_RADIUS_KM: float = float(os.getenv("MAX_POOL_RADIUS_KM", 5.0))
    MAX_WAIT_TIME_MINUTES: int = int(os.getenv("MAX_WAIT_TIME_MINUTES", 10))
    
    # External API Keys (Placeholder for future scaling)
    MAPS_API_KEY: str = os.getenv("MAPS_API_KEY", "your-api-key-goes-here")

# Instantiate the settings so they can be imported across the app
settings = Settings()