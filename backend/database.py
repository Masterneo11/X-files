# from decouple import config
# from sqlmodel import Session, create_engine

# DATABASE_URL: str = config("DATABASE_URL")
# engine = create_engine(DATABASE_URL)

# def get_db():
#     with Session(engine) as session:
#         yield session

from decouple import config
from sqlmodel import Session, create_engine

DATABASE_URL: str = config("DATABASE_URL")

engine = create_engine(DATABASE_URL
#  echo=True
 )

def get_db():
    with Session(engine) as session:
        yield session
