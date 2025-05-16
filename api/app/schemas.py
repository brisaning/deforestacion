from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

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

class ZonaDeforestadaUpdate(BaseModel):
    nombre_zona: Optional[str] = None
    tipo_proceso: Optional[str] = None
    departamento: Optional[str] = None
    geom: Optional[str] = None

class ZonaDeforestada(ZonaDeforestadaBase):
    id: int
    tipo_proceso_id: int
    departamento_id: int
    
    class Config:
        from_attributes = True