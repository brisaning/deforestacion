from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload  
from geoalchemy2 import WKTElement
from . import models, schemas

# CRUD para Departamentos
def get_departamento(db: Session, departamento_id: int):
    return db.query(models.Departamento).filter(models.Departamento.id == departamento_id).first()

def get_departamento_by_nombre(db: Session, nombre: str):
    return db.query(models.Departamento).filter(models.Departamento.nombre == nombre).first()

def get_departamentos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Departamento).offset(skip).limit(limit).all()

def create_departamento(db: Session, departamento: schemas.DepartamentoCreate):
    db_departamento = models.Departamento(nombre=departamento.nombre)
    db.add(db_departamento)
    db.commit()
    db.refresh(db_departamento)
    return db_departamento

def update_departamento(db: Session, departamento_id: int, departamento: schemas.DepartamentoCreate):
    db_departamento = get_departamento(db, departamento_id)
    if db_departamento:
        db_departamento.nombre = departamento.nombre
        db.commit()
        db.refresh(db_departamento)
    return db_departamento

def delete_departamento(db: Session, departamento_id: int):
    db_departamento = get_departamento(db, departamento_id)
    if db_departamento:
        db.delete(db_departamento)
        db.commit()
    return db_departamento

# CRUD para Tipos de Proceso
def get_tipo_proceso(db: Session, tipo_proceso_id: int):
    return db.query(models.TipoProceso).filter(models.TipoProceso.id == tipo_proceso_id).first()

def get_tipo_proceso_by_nombre(db: Session, nombre: str):
    return db.query(models.TipoProceso).filter(models.TipoProceso.nombre == nombre).first()

def get_tipos_proceso(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TipoProceso).offset(skip).limit(limit).all()

def create_tipo_proceso(db: Session, tipo_proceso: schemas.TipoProcesoCreate):
    db_tipo = models.TipoProceso(nombre=tipo_proceso.nombre)
    db.add(db_tipo)
    db.commit()
    db.refresh(db_tipo)
    return db_tipo

def update_tipo_proceso(db: Session, tipo_proceso_id: int, tipo_proceso: schemas.TipoProcesoCreate):
    db_tipo = get_tipo_proceso(db, tipo_proceso_id)
    if db_tipo:
        db_tipo.nombre = tipo_proceso.nombre
        db.commit()
        db.refresh(db_tipo)
    return db_tipo

def delete_tipo_proceso(db: Session, tipo_proceso_id: int):
    db_tipo = get_tipo_proceso(db, tipo_proceso_id)
    if db_tipo:
        db.delete(db_tipo)
        db.commit()
    return db_tipo

# CRUD para Zonas Deforestadas
def get_zona_deforestada(db: Session, zona_id: int):
    # Obtener la zona con las relaciones cargadas
    zona = db.query(models.ZonaDeforestada).\
        options(
            joinedload(models.ZonaDeforestada.tipo_proceso),
            joinedload(models.ZonaDeforestada.departamento)
        ).\
        filter(models.ZonaDeforestada.id == zona_id).\
        first()
    
    if not zona:
        return None
    
    # Convertir a formato compatible con el esquema Pydantic
    return {
        "id": zona.id,
        "nombre_zona": zona.nombre_zona,
        "tipo_proceso": zona.tipo_proceso.nombre,  # Solo el nombre
        "departamento": zona.departamento.nombre,  # Solo el nombre
        "geom": db.scalar(zona.geometry.ST_AsText()) if zona.geometry else None  # Opcional
    }

def get_zonas_deforestadas(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    departamento: str = None,
    tipo_proceso: str = None
):
    # Construir la consulta base con joins para las relaciones
    query = db.query(
        models.ZonaDeforestada,
        models.TipoProceso.nombre.label("tipo_proceso_nombre"),
        models.Departamento.nombre.label("departamento_nombre")
    ).join(
        models.TipoProceso
    ).join(
        models.Departamento
    )
    
    # Aplicar filtros si existen
    if departamento:
        query = query.filter(models.Departamento.nombre == departamento)
    if tipo_proceso:
        query = query.filter(models.TipoProceso.nombre == tipo_proceso)
    
    # Ejecutar la consulta
    results = query.offset(skip).limit(limit).all()
    
    # Formatear los resultados
    zonas = []
    for zona, tipo_nombre, depto_nombre in results:
        zonas.append({
            "id": zona.id,
            "nombre_zona": zona.nombre_zona,
            "tipo_proceso": tipo_nombre,  # Usamos el nombre ya cargado
            "departamento": depto_nombre, # Usamos el nombre ya cargado
            # Si necesitas incluir la geometría:
            "geom": db.scalar(zona.geometry.ST_AsText()) if zona.geometry else None
        })
    
    return zonas

def create_zona_deforestada(db: Session, zona: schemas.ZonaDeforestadaCreate):
    # Verificar existencia
    departamento = db.query(models.Departamento).filter(
        models.Departamento.nombre == zona.departamento
    ).first()
    if not departamento:
        raise ValueError(f"Departamento {zona.departamento} no existe")
    
    tipo_proceso = db.query(models.TipoProceso).filter(
        models.TipoProceso.nombre == zona.tipo_proceso
    ).first()
    if not tipo_proceso:
        raise ValueError(f"Tipo de proceso {zona.tipo_proceso} no existe")
    
    # Crear la zona
    db_zona = models.ZonaDeforestada(
        nombre_zona=zona.nombre_zona,
        tipo_proceso_id=tipo_proceso.id,
        departamento_id=departamento.id,
        #geometry=func.ST_GeomFromText(zona.geom, 3116)
        geometry=WKTElement(zona.geom, srid=3116)
    )
    
    db.add(db_zona)
    db.commit()
    db.refresh(db_zona)
    
    # Devolver los nombres en lugar de los objetos
    return {
        "id": db_zona.id,
        "nombre_zona": db_zona.nombre_zona,
        "tipo_proceso": tipo_proceso.nombre,  # Nombre en lugar de objeto
        "departamento": departamento.nombre,  # Nombre en lugar de objeto
        "geom": zona.geom
    }

def update_zona_deforestada(db: Session, zona_id: int, zona: schemas.ZonaDeforestadaUpdate):
    db_zona = get_zona_deforestada(db, zona_id)
    if not db_zona:
        return None
    
    if zona.nombre_zona is not None:
        db_zona.nombre_zona = zona.nombre_zona
    
    if zona.tipo_proceso is not None:
        tipo_proceso = get_tipo_proceso_by_nombre(db, zona.tipo_proceso)
        if not tipo_proceso:
            raise ValueError(f"Tipo de proceso {zona.tipo_proceso} no existe")
        db_zona.tipo_proceso_id = tipo_proceso.id
    
    if zona.departamento is not None:
        departamento = get_departamento_by_nombre(db, zona.departamento)
        if not departamento:
            raise ValueError(f"Departamento {zona.departamento} no existe")
        db_zona.departamento_id = departamento.id
    
    if zona.geom is not None:
        db_zona.geometry = WKTElement(zona.geom, srid=3116)
    
    db.commit()
    db.refresh(db_zona)
    # Devolver los nombres en lugar de los objetos
    return {
        "id": db_zona.id,
        "nombre_zona": db_zona.nombre_zona,
        "tipo_proceso": tipo_proceso.nombre,  # Nombre en lugar de objeto
        "departamento": departamento.nombre,  # Nombre en lugar de objeto
        "geom": zona.geom
    }

def delete_zona_deforestada(db: Session, zona_id: int):
    db_zona = get_zona_deforestada(db, zona_id)
    if not db_zona:
        return None
    
    # Guardar los datos necesarios para la respuesta antes de eliminar
    response_data = {
        "id": db_zona.id,
        "nombre_zona": db_zona.nombre_zona,
        "tipo_proceso": db_zona.tipo_proceso.nombre,  # Acceder al nombre a través de la relación
        "departamento": db_zona.departamento.nombre   # Acceder al nombre a través de la relación
    }
    
    db.delete(db_zona)
    db.commit()
    
    return response_data