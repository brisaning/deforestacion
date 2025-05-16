from fastapi import FastAPI
from .database import engine, Base
from . import models
from .endpoints import router

app = FastAPI(
    title="API de Monitoreo de Deforestación",
    description="API para el registro y monitoreo de zonas deforestadas",
    version="1.0.0",
)

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "API de Monitoreo de Deforestación"}