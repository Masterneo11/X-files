# from decouple import config
# from sqlmodel import Session, create_engine

# DATABASE_URL: str = config("DATABASE_URL")
# engine = create_engine(DATABASE_URL)

# def get_db():
#     with Session(engine) as session:
#         yield session

from decouple import config
from sqlmodel import Session, create_engine

# Ensure DATABASE_URL is pointing to the correct PostgreSQL database
DATABASE_URL: str = config("DATABASE_URL")
# Create an engine using the correct DATABASE_URL
engine = create_engine(DATABASE_URL, echo=True)  # echo=True enables logging for debugging

# Dependency to get a database session
def get_db():
    with Session(engine) as session:
        yield session
