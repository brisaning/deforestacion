from fastapi import FastAPI
from app.database import engine, Base
from app.models import DeforestedZone  # Ahora no hay circularidad
from app.endpoints import router

app = FastAPI(
    title="Deforestation Zones API",
    description="API for managing deforested zones with geospatial data",
    version="1.0.0",
)

# Crea las tablas de la base de datos
Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Deforestation Zones API"}