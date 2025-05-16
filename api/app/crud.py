from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_Transform, ST_GeomFromGeoJSON
from shapely.geometry import shape
from app.models import DeforestedZone
from app.schemas import DeforestedZoneCreate, DeforestedZoneUpdate
from app.database import Session

def get_deforested_zone(db: Session, zone_id: int):
    return db.query(models.DeforestedZone).filter(models.DeforestedZone.id == zone_id).first()

def get_deforested_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DeforestedZone).offset(skip).limit(limit).all()

def create_deforested_zone(db: Session, zone: schemas.DeforestedZoneCreate):
    # Convert GeoJSON to WKT and create geometry with SRID 3116
    geom = ST_GeomFromGeoJSON(zone.geometry.json(), srid=3116)
    
    db_zone = models.DeforestedZone(
        name=zone.name,
        description=zone.description,
        area_hectares=zone.area_hectares,
        date_detected=zone.date_detected,
        geometry=geom
    )
    
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

def update_deforested_zone(db: Session, zone_id: int, zone: schemas.DeforestedZoneUpdate):
    db_zone = get_deforested_zone(db, zone_id)
    if not db_zone:
        return None
    
    if zone.name is not None:
        db_zone.name = zone.name
    if zone.description is not None:
        db_zone.description = zone.description
    if zone.area_hectares is not None:
        db_zone.area_hectares = zone.area_hectares
    if zone.date_detected is not None:
        db_zone.date_detected = zone.date_detected
    if zone.geometry is not None:
        db_zone.geometry = ST_GeomFromGeoJSON(zone.geometry.json(), srid=3116)
    
    db.commit()
    db.refresh(db_zone)
    return db_zone

def delete_deforested_zone(db: Session, zone_id: int):
    db_zone = get_deforested_zone(db, zone_id)
    if not db_zone:
        return None
    
    db.delete(db_zone)
    db.commit()
    return db_zone