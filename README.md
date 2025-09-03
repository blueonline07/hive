# Synapso

Lightweight implementation of the Synapso real-time collaborative file sharing system.

## Overview

This is a lightweight implementation of the Synapso project, which provides:

- User authentication with JWT
- File upload and download with MinIO/S3 pre-signed URLs
- Real-time file collaboration using Socket.io
- API documentation with Swagger

## Features

- **User Management**: Sign up, login, profile management with JWT authentication
- **File Storage**: Upload, download, list, and delete files using MinIO/S3
- **Real-Time Collaboration**: WebSocket integration for real-time file editing
- **API Documentation**: Swagger UI for exploring and testing API endpoints

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- MinIO (or any S3-compatible storage)
- Redis (for production deployments with multiple nodes)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hive
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure it:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the Prisma database:

```bash
npx prisma generate
npx prisma migrate dev
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Middlewares
├── models/          # Prisma client and database models
├── routes/          # API routes
├── services/        # Business logic
├── socket.js        # Socket.io setup
├── swagger.json     # API documentation
└── index.js         # Application entry point
```

## Environment Variables

| Variable              | Description                              | Default                                   |
|-----------------------|------------------------------------------|-----------------------------------------|
| PORT                  | Port for the server                      | 3000                                    |
| NODE_ENV              | Environment (development/production)     | development                             |
| JWT_SECRET            | Secret key for JWT tokens                | (required)                              |
| JWT_EXPIRATION_TIME   | JWT token expiration time                | 1d                                      |
| DATABASE_URL          | PostgreSQL connection string             | (required)                              |
| MINIO_ENDPOINT        | MinIO server hostname                    | localhost                               |
| MINIO_PORT            | MinIO server port                        | 9000                                    |
| MINIO_USE_SSL         | Whether to use SSL for MinIO             | false                                   |
| MINIO_ACCESS_KEY      | MinIO access key                         | minioadmin                              |
| MINIO_SECRET_KEY      | MinIO secret key                         | minioadmin                              |
| MINIO_BUCKET_NAME     | MinIO bucket name                        | hive-files                             |

## License

[MIT](LICENSE)
