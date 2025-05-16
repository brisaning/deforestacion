from sqlalchemy import Column, Integer, String, Float, Date
from geoalchemy2 import Geometry
from .database import Base

class DeforestedZone(Base):
    __tablename__ = "deforested_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    area_hectares = Column(Float)
    date_detected = Column(Date)
    geometry = Column(Geometry(geometry_type='POLYGON', srid=3116))
    
    def __repr__(self):
        return f"<DeforestedZone {self.name}>"