from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from geojson_pydantic import Polygon
from geojson_pydantic.geometries import Polygon

class DeforestedZoneBase(BaseModel):
    name: str
    description: Optional[str] = None
    area_hectares: float = Field(..., gt=0, description="Área en hectáreas")
    date_detected: date

class DeforestedZoneCreate(DeforestedZoneBase):
    geometry: Polygon = Field(..., description="Geometría en formato GeoJSON (EPSG:3116)")

class DeforestedZoneUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    area_hectares: Optional[float] = Field(None, gt=0)
    date_detected: Optional[date] = None
    geometry: Optional[Polygon] = None

class DeforestedZone(DeforestedZoneBase):
    id: int
    geometry: dict  # GeoJSON representation
    
    class Config:
        from_attributes = True