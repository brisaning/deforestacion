# Base de Datos PostgreSQL en Docker con Extensión PostGIS

Este proyecto utiliza una base de datos PostgreSQL ejecutándose en un contenedor Docker, con la extensión espacial PostGIS habilitada.

## Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Uso rápido

1. Contiene un archivo `docker-compose.yml` con el siguiente contenido:

    ```yaml
    services:
      db:
         image: ${POSTGRESQL_CONTAINER_NAME}
         environment:
            - POSTGRESQL_DATABASE=${POSTGRESQL_DATABASE}
            - POSTGRESQL_USERNAME=${POSTGRESQL_USERNAME}
            - POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD}
         ports:
            - "5432:5432"
         volumes:
            - fletx_data:/bitnami/postgresql:rw
    ```

Las variables de entorno son:

POSTGRESQL_IMAGE=postgis/postgis:latest
POSTGRESQL_CONTAINER_NAME=deforestationsql
POSTGRESQL_DATABASE=deforestation
POSTGRESQL_USERNAME=deforestationuser
POSTGRESQL_PASSWORD=deforestationpassword
POSTGRESQL_PORTS=5432:5432

2. Inicia el contenedor:

    ```bash
    docker-compose up -d
    ```

3. Conéctate a la base de datos:

    ```bash
    psql -h localhost -U deforestationuser -d deforestationpassword
    ```

## Notas

- Los datos persistirán en el volumen `defos_data`.
- PostGIS estará habilitado por defecto en la base de datos.

## Referencias

- [PostGIS Docker Hub](https://hub.docker.com/r/postgis/postgis/)
- [Documentación oficial de PostGIS](https://postgis.net/documentation/)