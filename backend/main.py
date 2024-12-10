from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your routers from the `routers` directory
from routers import Login, Event, CreateAccount, Profile, Clubs, Messages, friends

from fastapi import FastAPI

app = FastAPI()

# CORS configuration (adjust origins as needed)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],  # Allow your frontend URL
    allow_origins=["https://omadagroupevents.com"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers hi
app.include_router(Login.router, tags=["Login"])
app.include_router(Event.router, prefix="/events", tags=["Events"])
app.include_router(Profile.router, prefix="/profile", tags=["Profile"])  # New profile router
app.include_router(CreateAccount.router, prefix="/create_account", tags=["CreateAccount"])
app.include_router(Clubs.router, prefix="/Clubs", tags=["Clubs"])
app.include_router(Profile.router, prefix="/Profile", tags=["Profile"])
app.include_router(friends.router, prefix="/Friends", tags=["Friends"])
app.include_router(Messages.router, prefix="/Messages", tags=["Messages"])
# app.include_router(friends.router, prefix="/Friends", tags=["Frieds"])




# app.include_router(CreateAccount.router, tags=["CreateAccount"])

# Optionally, add a root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to My App!"}

# from services.auth import validate_jwt
# from fastapi import FastAPI, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from routers import Login, Event, CreateAccount, Profile, Clubs, Messages, friends
# from services.auth import validate_jwt  # Import the JWT validation function

# app = FastAPI()

# # CORS configuration (adjust origins as needed)
# origins = ["*"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # Allow your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include your routers
# app.include_router(Login.router, tags=["Login"])
# app.include_router(Event.router, prefix="/events", tags=["Events"])
# app.include_router(Profile.router, prefix="/profile", tags=["Profile"])  # New profile router
# app.include_router(CreateAccount.router, prefix="/create_account", tags=["CreateAccount"])
# app.include_router(Clubs.router, prefix="/Clubs", tags=["Clubs"])
# app.include_router(Profile.router, prefix="/Profile", tags=["Profile"])
# app.include_router(friends.router, prefix="/Friends", tags=["Friends"])
# app.include_router(Messages.router, prefix="/Messages", tags=["Messages"])

# # Optionally, add a root endpoint
# @app.get("/")
# def root():
#     return {"message": "Welcome to My App!"}

# # Example of a protected route
# @app.get("/protected", dependencies=[Depends(validate_jwt)])
# def protected_route():
#     return {"message": "You are authorized!"}
