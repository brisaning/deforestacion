from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import schemas, crud

router = APIRouter()

# Endpoints para Departamentos
@router.post("/departamentos/", response_model=schemas.Departamento)
def crear_departamento(departamento: schemas.DepartamentoCreate, db: Session = Depends(get_db)):
    db_departamento = crud.get_departamento_by_nombre(db, nombre=departamento.nombre)
    if db_departamento:
        raise HTTPException(status_code=400, detail="Departamento ya existe")
    return crud.create_departamento(db=db, departamento=departamento)

@router.get("/departamentos/", response_model=List[schemas.Departamento])
def leer_departamentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    departamentos = crud.get_departamentos(db, skip=skip, limit=limit)
    return departamentos

@router.get("/departamentos/{departamento_id}", response_model=schemas.Departamento)
def leer_departamento(departamento_id: int, db: Session = Depends(get_db)):
    db_departamento = crud.get_departamento(db, departamento_id=departamento_id)
    if db_departamento is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return db_departamento

@router.put("/departamentos/{departamento_id}", response_model=schemas.Departamento)
def actualizar_departamento(departamento_id: int, departamento: schemas.DepartamentoCreate, db: Session = Depends(get_db)):
    db_departamento = crud.get_departamento(db, departamento_id=departamento_id)
    if db_departamento is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return crud.update_departamento(db=db, departamento_id=departamento_id, departamento=departamento)

@router.delete("/departamentos/{departamento_id}", response_model=schemas.Departamento)
def eliminar_departamento(departamento_id: int, db: Session = Depends(get_db)):
    db_departamento = crud.delete_departamento(db, departamento_id=departamento_id)
    if db_departamento is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return db_departamento

# Endpoints para Tipos de Proceso
@router.post("/procesos/", response_model=schemas.TipoProceso)
def crear_proceso(proceso: schemas.TipoProcesoCreate, db: Session = Depends(get_db)):
    db_proceso = crud.get_tipo_proceso_by_nombre(db, nombre=proceso.nombre)
    if db_proceso:
        raise HTTPException(status_code=400, detail="Tipo de proceso ya existe")
    return crud.create_tipo_proceso(db=db, tipo_proceso=proceso)

@router.get("/procesos/", response_model=List[schemas.TipoProceso])
def leer_procesos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    procesos = crud.get_tipos_proceso(db, skip=skip, limit=limit)
    return procesos

@router.get("/procesos/{proceso_id}", response_model=schemas.TipoProceso)
def leer_proceso(proceso_id: int, db: Session = Depends(get_db)):
    db_proceso = crud.get_tipo_proceso(db, tipo_proceso_id=proceso_id)
    if db_proceso is None:
        raise HTTPException(status_code=404, detail="Tipo de proceso no encontrado")
    return db_proceso

@router.put("/procesos/{proceso_id}", response_model=schemas.TipoProceso)
def actualizar_proceso(proceso_id: int, proceso: schemas.TipoProcesoCreate, db: Session = Depends(get_db)):
    db_proceso = crud.get_tipo_proceso(db, tipo_proceso_id=proceso_id)
    if db_proceso is None:
        raise HTTPException(status_code=404, detail="Tipo de proceso no encontrado")
    return crud.update_tipo_proceso(db=db, tipo_proceso_id=proceso_id, tipo_proceso=proceso)

@router.delete("/procesos/{proceso_id}", response_model=schemas.TipoProceso)
def eliminar_proceso(proceso_id: int, db: Session = Depends(get_db)):
    db_proceso = crud.delete_tipo_proceso(db, tipo_proceso_id=proceso_id)
    if db_proceso is None:
        raise HTTPException(status_code=404, detail="Tipo de proceso no encontrado")
    return db_proceso

# Endpoints para Zonas Deforestadas
@router.post("/zonas-deforestadas/", response_model=schemas.ZonaDeforestada)
def crear_zona_deforestada(zona: schemas.ZonaDeforestadaCreate, db: Session = Depends(get_db)):
    try:
        db_zona = crud.create_zona_deforestada(db=db, zona=zona)
        return db_zona
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/zonas-deforestadas/", response_model=List[schemas.ZonaDeforestada])
def leer_zonas_deforestadas(
    skip: int = 0, 
    limit: int = 100,
    departamento: str = None,
    tipo_proceso: str = None,
    db: Session = Depends(get_db)
):
    return crud.get_zonas_deforestadas(
        db, 
        skip=skip, 
        limit=limit,
        departamento=departamento,
        tipo_proceso=tipo_proceso
    )

@router.get("/zonas-deforestadas/{zona_id}", response_model=schemas.ZonaDeforestada)
def leer_zona_deforestada(zona_id: int, db: Session = Depends(get_db)):
    db_zona = crud.get_zona_deforestada(db, zona_id=zona_id)
    if db_zona is None:
        raise HTTPException(status_code=404, detail="Zona deforestada no encontrada")
    return db_zona

@router.put("/zonas-deforestadas/{zona_id}", response_model=schemas.ZonaDeforestada)
def actualizar_zona_deforestada(zona_id: int, zona: schemas.ZonaDeforestadaUpdate, db: Session = Depends(get_db)):
    try:
        db_zona = crud.update_zona_deforestada(db=db, zona_id=zona_id, zona=zona)
        if db_zona is None:
            raise HTTPException(status_code=404, detail="Zona deforestada no encontrada")
        return db_zona
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/zonas-deforestadas/{zona_id}", response_model=schemas.ZonaDeforestada)
def eliminar_zona_deforestada(zona_id: int, db: Session = Depends(get_db)):
    db_zona = crud.delete_zona_deforestada(db, zona_id=zona_id)
    if db_zona is None:
        raise HTTPException(status_code=404, detail="Zona deforestada no encontrada")
    return db_zona