from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. The Database URL
# This tells SQLAlchemy to create a local file named 'ridesync_prod.db' right inside your app folder.
SQLALCHEMY_DATABASE_URL = "sqlite:///./ridesync_prod.db"

# 2. The Engine
# The 'check_same_thread' argument is a special requirement ONLY for SQLite.
# It allows FastAPI to handle multiple incoming requests (like 3 users looking for a ride at once) 
# without locking up the database.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. The Session
# This creates a temporary "workspace" every time a user requests a pool. 
# It handles saving their data and then cleanly closes the workspace when done.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. The Base Class
# We import this into models.py so SQLAlchemy knows which classes are database tables.
Base = declarative_base()

# 5. The Dependency Injection
# This function is used in main.py to give each API request its own database session.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()