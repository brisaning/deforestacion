from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import schemas
from app.crud import (
    get_deforested_zone,
    get_deforested_zones,
    create_deforested_zone,
    update_deforested_zone,
    delete_deforested_zone
)

router = APIRouter()

@router.post("/zones/", response_model=schemas.DeforestedZone)
def create_zone(zone: schemas.DeforestedZoneCreate, db: Session = Depends(get_db)):
    return create_deforested_zone(db, zone)

@router.get("/zones/", response_model=List[schemas.DeforestedZone])
def read_zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    zones = get_deforested_zones(db, skip=skip, limit=limit)
    return zones

@router.get("/zones/{zone_id}", response_model=schemas.DeforestedZone)
def read_zone(zone_id: int, db: Session = Depends(get_db)):
    db_zone = get_deforested_zone(db, zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    return db_zone

@router.put("/zones/{zone_id}", response_model=schemas.DeforestedZone)
def update_zone(zone_id: int, zone: schemas.DeforestedZoneUpdate, db: Session = Depends(get_db)):
    db_zone = update_deforested_zone(db, zone_id, zone)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    return db_zone

@router.delete("/zones/{zone_id}", response_model=schemas.DeforestedZone)
def delete_zone(zone_id: int, db: Session = Depends(get_db)):
    db_zone = delete_deforested_zone(db, zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    return db_zone