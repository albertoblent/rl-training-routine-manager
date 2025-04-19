# Docker Setup for RL Training Routine Manager

This guide explains how to use Docker for local development and deployment on Render.com.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Local Development with Docker

### Starting the Application

To start the application in development mode:

```bash
./local-dev/docker-start.sh
```

This will build and start the following containers:
- PostgreSQL database (`db`)
- Django backend (`web`)
- React frontend (`frontend`)

The application will be available at:
- Django backend: http://localhost:8000
- React frontend: http://localhost:3000

### Stopping the Application

To stop the application:

```bash
./local-dev/docker-stop.sh
```

Or press `Ctrl+C` in the terminal where the containers are running.

## Project Structure

```
rl-training-routine-manager/
├── docker-compose.yml       # Docker Compose config for local development
├── local-dev/
│   ├── docker-start.sh      # Script to start Docker containers
│   └── docker-stop.sh       # Script to stop Docker containers
├── trm/
│   ├── Dockerfile           # Production Dockerfile for the Django app
│   ├── .dockerignore        # Files to exclude from Docker build
│   ├── render.yaml          # Render.com deployment configuration
│   ├── frontend/
│   │   └── Dockerfile.dev   # Development Dockerfile for React app
```

## Deploying to Render.com

This project is configured to be deployed on Render.com using Docker.

1. Push your changes to your Git repository
2. Log in to your Render.com account
3. Create a new Web Service
4. Connect your Git repository
5. Select "Docker" as the environment
6. Configure the service:
   - Root Directory: `trm`
   - No need to specify build or start commands (they're in the Dockerfile)
7. Add environment variables as needed
8. Deploy!

### Notes for Render.com Deployment

- The Dockerfile is configured to build for the `linux/amd64` platform as required by Render
- The Docker image size is kept under 10GB as per Render's requirements
- The application is set to listen on the port specified by the `PORT` environment variable
- The base image is Ubuntu to match Render.com's environment

## Troubleshooting

### Database Migrations

If you need to run migrations manually:

```bash
docker-compose exec web python manage.py migrate
```

### Shell Access

To access the Django shell:

```bash
docker-compose exec web python manage.py shell
```

### Viewing Logs

```bash
docker-compose logs -f
```

To view logs for a specific service:

```bash
docker-compose logs -f web  # Django backend
docker-compose logs -f db   # PostgreSQL
docker-compose logs -f frontend  # React frontend
```