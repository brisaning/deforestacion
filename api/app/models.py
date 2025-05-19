from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.database import Base

class Departamento(Base):
    __tablename__ = "departamentos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    
    zonas = relationship("ZonaDeforestada", back_populates="departamento")

class TipoProceso(Base):
    __tablename__ = "tipos_proceso"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    
    zonas = relationship("ZonaDeforestada", back_populates="tipo_proceso")

class ZonaDeforestada(Base):
    __tablename__ = "zonas_deforestadas"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre_zona = Column(String, index=True)
    tipo_proceso_id = Column(Integer, ForeignKey("tipos_proceso.id"))
    departamento_id = Column(Integer, ForeignKey("departamentos.id"))
    geometry = Column(Geometry(geometry_type='POLYGON', srid=3116))
    
    tipo_proceso = relationship("TipoProceso", back_populates="zonas", lazy="joined")
    departamento = relationship("Departamento", back_populates="zonas", lazy="joined")