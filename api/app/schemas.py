from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date
from geoalchemy2.elements import WKTElement

# Esquemas para Departamentos
class DepartamentoBase(BaseModel):
    nombre: str

class DepartamentoCreate(DepartamentoBase):
    pass

class Departamento(DepartamentoBase):
    id: int
    
    class Config:
        from_attributes = True

# Esquemas para Tipos de Proceso
class TipoProcesoBase(BaseModel):
    nombre: str

class TipoProcesoCreate(TipoProcesoBase):
    pass

class TipoProceso(TipoProcesoBase):
    id: int
    
    class Config:
        from_attributes = True

# Esquemas para Zonas Deforestadas
class ZonaDeforestadaBase(BaseModel):
    nombre_zona: str
    tipo_proceso: str
    departamento: str

class ZonaDeforestadaCreate(ZonaDeforestadaBase):
    geom: str  # WKT format for polygon in EPSG:3116

    @validator('geom')
    def validate_geom(cls, v):
        if not v.startswith('POLYGON((') or not v.endswith('))'):
            raise ValueError('Formato de geometría inválido. Debe ser WKT POLYGON')
        return v

class ZonaDeforestadaUpdate(BaseModel):
    nombre_zona: Optional[str] = None
    tipo_proceso: Optional[str] = None
    departamento: Optional[str] = None
    geom: Optional[str] = None

    class Config:
        from_attributes = True
        json_encoders = {
            WKTElement: lambda v: str(v)
        }

class ZonaDeforestada(ZonaDeforestadaBase):
    id: int
    geom: Optional[str] = None  # Campo para la geometría en WKT
    
    class Config:
        from_attributes = True
        json_encoders = {
            # Agregar conversores si es necesario
        }