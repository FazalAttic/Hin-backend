# Hin-backend

## Project Setup

### Prerequisites
- Docker & Docker Compose

### Environment Variables
Create a `.env` file in the root directory. Example structure:

```
MONGO_URI=mongodb://mongo:27017/hin_db
PORT=5000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

See `.env.example` for the required keys.

---

## Running with Docker

### Main Commands

1. **Build and start containers:**
   ```sh
   docker-compose up --build
   ```
   This will build the Docker images and start all services (backend, MongoDB, Redis).

2. **Stop containers:**
   ```sh
   docker-compose down
   ```
   This will stop and remove all running containers.

3. **Run server setup script inside the backend container:**
   ```sh
   docker-compose exec backend sh scripts/server_setup.sh
   ```
   This will install dependencies and start the server in development mode inside the container.

4. **View logs for a service:**
   ```sh
   docker-compose logs backend
   docker-compose logs mongo
   docker-compose logs redis
   ```

---

## Local Development

1. Copy `.env.example` to `.env.local` and fill in your local values.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npx nodemon app.js
   ```

---

## Folder Structure



The `scripts/` folder contains shell scripts for common server and container operations:

- `server_run.sh`: Starts the server, waits for MongoDB, runs migrations, and launches in development or production mode.
- `server_setup.sh`: Runs migrations and seeds the database.
- `celery_run.sh`: Placeholder for starting a background worker (customize as needed).
- `entrypoint_pubsub.sh`: Entry point for pub/sub service, waits for backend/DB if in development mode.

You can use these scripts as Docker entrypoints or for local setup automation.
---

## Notes
- Make sure to keep your `.env` file secure and never commit secrets.
- For production, use strong secrets and update environment variables accordingly.
