from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your routers from the `routers` directory
from routers import Login, Event

app = FastAPI(title="My App", version="1.0.0")

# CORS configuration (adjust origins as needed)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers hi
app.include_router(Login.router, tags=["Login"])
app.include_router(Event.router, prefix="/events", tags=["Events"])

# app.include_router(CreateAccount.router, tags=["CreateAccount"])

# Optionally, add a root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to My App!"}
