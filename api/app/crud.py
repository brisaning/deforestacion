from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_GeomFromGeoJSON
from app.models import DeforestedZone
from app.schemas import DeforestedZoneCreate, DeforestedZoneUpdate

def get_deforested_zone(db: Session, zone_id: int):
    return db.query(DeforestedZone).filter(DeforestedZone.id == zone_id).first()

def get_deforested_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DeforestedZone).offset(skip).limit(limit).all()

def create_deforested_zone(db: Session, zone: DeforestedZoneCreate):
    geom = ST_GeomFromGeoJSON(str(zone.geometry), srid=3116)
    
    db_zone = DeforestedZone(
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

def update_deforested_zone(db: Session, zone_id: int, zone: DeforestedZoneUpdate):
    db_zone = get_deforested_zone(db, zone_id)
    if not db_zone:
        return None
    
    updates = {k: v for k, v in zone.dict().items() if v is not None}
    
    if 'geometry' in updates:
        updates['geometry'] = ST_GeomFromGeoJSON(str(updates['geometry']), srid=3116)
    
    for key, value in updates.items():
        setattr(db_zone, key, value)
    
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