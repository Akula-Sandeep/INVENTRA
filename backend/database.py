import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./test.db",  # Use SQLite for local testing
)

engine = create_engine(DB_URL, pool_pre_ping=True)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)