# BookIt - Sistema de Reservas de Citas

Aplicación web full stack para gestionar servicios y reservas de citas de clientes. Permite consultar servicios disponibles, registrar citas, listar citas registradas, filtrar por estado, marcar citas como atendidas y cancelar citas.

## Tecnologías

- **Frontend:** React 18 + Vite, servido con Nginx
- **Backend:** Java 21 + Spring Boot 3.4
- **Base de datos:** PostgreSQL 17

## Imágenes en Docker Hub

- Frontend: [6414camilo/bookit-frontend](https://hub.docker.com/r/6414camilo/bookit-frontend)
- Backend: [6414camilo/bookit-backend](https://hub.docker.com/r/6414camilo/bookit-backend)

## Pasos para subir las imágenes a Docker Hub

1. Asegúrate de haber iniciado sesión en Docker:
   ```bash
   docker login
   ```
2. Construye las imágenes desde la raíz del proyecto (backend y frontend respectivamente):
   ```bash
   docker build -t 6414camilo/bookit-backend:latest ./backend
   docker build -t 6414camilo/bookit-frontend:latest ./frontend
   ```
3. Sube las imágenes a tu repositorio en Docker Hub:
   ```bash
   docker push 6414camilo/bookit-backend:latest
   docker push 6414camilo/bookit-frontend:latest
   ```

## Cómo levantar la aplicación paso a paso

1. **Requisitos previos:** Asegúrate de tener Docker y Docker Compose instalados en tu sistema.
2. **Descarga el proyecto:** Clona este repositorio o descarga los archivos.
3. **Levanta los contenedores:** Abre una terminal en la raíz del proyecto (donde está el archivo `docker-compose.yml`) y ejecuta:
   ```bash
   docker compose up -d
   ```
4. **Verificación:** Puedes comprobar que los contenedores (db, backend, frontend) están funcionando con:
   ```bash
   docker compose ps
   ```

## URLs de acceso

- **Frontend:** http://localhost:8080
- **Backend (health):** http://localhost:3000/health

## Resumen de Endpoints del Backend

A continuación, la lista de los endpoints disponibles en el servidor:

| Método   | Endpoint                        | Descripción                                                                 |
| :------- | :------------------------------ | :-------------------------------------------------------------------------- |
| `GET`    | `/health`                       | Verifica el estado del servidor (Healthcheck).                              |
| `GET`    | `/services`                     | Lista todos los servicios disponibles para agendar.                         |
| `GET`    | `/appointments`                 | Obtiene todas las citas. Se puede filtrar pasando `?estado=PENDING` o `DONE`|
| `POST`   | `/appointments`                 | Crea una nueva cita a partir de un JSON con los datos del cliente.          |
| `PATCH`  | `/appointments/{id}/status`     | Actualiza el estado de una cita a `DONE` o `CANCELLED`.                     |
| `DELETE` | `/appointments/{id}`            | Elimina una cita específica según su ID.                                    |
