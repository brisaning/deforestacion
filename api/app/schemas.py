from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import date

class DeforestedZoneBase(BaseModel):
    name: str
    description: Optional[str] = None
    area_hectares: float = Field(..., gt=0, description="Área en hectáreas")
    date_detected: date

class DeforestedZoneCreate(DeforestedZoneBase):
    geometry: Dict  # Usamos Dict en lugar de Polygon para evitar dependencias

class DeforestedZoneUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    area_hectares: Optional[float] = Field(None, gt=0)
    date_detected: Optional[date] = None
    geometry: Optional[Dict] = None

class DeforestedZone(DeforestedZoneBase):
    id: int
    geometry: Dict
    
    class Config:
        from_attributes = True