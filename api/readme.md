# API REST de Zonas Deforestadas

API REST construida con **FastAPI** y **SQLAlchemy** para gestionar zonas deforestadas, con soporte para datos geoespaciales en **PostgreSQL + PostGIS** (SRID 3116).

## Características

- CRUD de zonas deforestadas.
- Almacenamiento y consulta de geometrías geoespaciales.
- Integración con PostgreSQL/PostGIS (SRID 3116).

## Instalación

```bash
pip install fastapi[all] sqlalchemy asyncpg geoalchemy2 psycopg2-binary
```

## Configuración

Configura la conexión a la base de datos en `DATABASE_URL`:

```
postgresql+psycopg2://usuario:contraseña@localhost:5432/deforestacion
```

## Ejemplo de Modelo

```python
from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ZonaDeforestada(Base):
    __tablename__ = "zonas_deforestadas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    geom = Column(Geometry(geometry_type="POLYGON", srid=3116))
```

## Endpoints Principales

- `POST /zonas/` - Registrar zona deforestada
- `GET /zonas/` - Consultar zonas
- `GET /zonas/{id}` - Consultar zona por ID
- `PUT /zonas/{id}` - Actualizar zona
- `DELETE /zonas/{id}` - Eliminar zona

## Ejecución

```bash
uvicorn main:app --reload
```

## Requisitos

- Python 3.8+
- PostgreSQL con extensión PostGIS habilitada

## Licencia

MIT