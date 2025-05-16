from fastapi import FastAPI
from .database import engine, Base
from . import models
from .endpoints import router

app = FastAPI(
    title="Deforestation Zones API",
    description="API for managing deforested zones with geospatial data",
    version="1.0.0",
)

# Create database tables
Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Deforestation Zones API"}