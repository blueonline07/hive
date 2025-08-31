# Weave – Real-Time Collaborative File Sharing System

## 📌 Context
Weave is a backend project designed to showcase advanced backend development skills beyond CRUD applications. It is a **real-time collaborative file sharing and editing system**, where multiple users can:
- Upload/share files.
- Edit content simultaneously.
- Manage permissions (read/write).
- Search and version their documents.

This project demonstrates expertise in **real-time systems, distributed coordination, CRDTs, event sourcing, and cloud-native deployment**.

---

## 🎯 Core Features
1. **User Management** (sign up, login, JWT auth).
2. **File Storage & Metadata** (upload, download, permissions).
3. **Real-Time Editing** (WebSockets + CRDTs).
4. **Multi-User Sharing** (read/write access).
5. **Versioning** (rollback to earlier snapshots).
6. **Search** (content indexing + query).
7. **Scalability & Observability** (Redis, metrics, logs, tracing).

---

## 🛠️ Implementation Order
1. **Project Setup**
   - NestJS + Prisma + Postgres.
   - User system + JWT auth.

2. **File Storage (MinIO/S3)**
   - Upload/download with pre-signed URLs.
   - Store metadata in Postgres.

3. **Basic Sharing**
   - Permissions (owner, read, write).
   - REST endpoints for sharing links.

4. **Real-Time Editing**
   - WebSocket gateway in NestJS.
   - Yjs CRDT integration for text-based files.
   - Redis pub/sub for multi-node sync.

5. **Versioning**
   - Store snapshots or diffs in Postgres.
   - Simple rollback feature.

6. **Search (ElasticSearch)**
   - Index file contents.
   - Add API to search across files.

7. **Scalability Polish** (optional, portfolio booster)
   - Deploy to Kubernetes.
   - Horizontal scaling with Redis coordination.

---

## ⚙️ Tech Stack (TypeScript)

### **Core Backend**
- **NestJS** → Structured, enterprise-ready framework (controllers, services, DI).
- **Prisma (with PostgreSQL)** → For metadata storage (files, users, permissions, versions).

### **Real-Time Editing**
- **WebSockets (Socket.IO / NestJS Gateway)** → Real-time collaboration channel.
- **Yjs or Automerge** → CRDT library to handle concurrent edits & merge changes.
- **Redis Pub/Sub** → To sync changes across multiple backend nodes.

### **File Handling**
- **MinIO / S3** → For storing actual files (binary data).
- **Pre-signed URLs** → For secure upload/download.

### **Search**
- **ElasticSearch / OpenSearch** → For full-text search in file contents.

### **Auth & Security**
- **JWT (JSON Web Tokens)** → For authentication (minimal, but can extend).
- **Role-based Access Control (RBAC)** → Share files with read/write permissions.

### **DevOps**
- **Docker Compose** → Run Postgres + MinIO + Redis + ElasticSearch locally.
- **CI/CD (GitHub Actions)** → Tests + lint + build.
- **Kubernetes (optional)** → For infra scaling.

### **Extras (Portfolio Boosters)**
- **Tracing**: OpenTelemetry + Jaeger → distributed tracing.
- **Monitoring**: Prometheus + Grafana → track metrics (users, edits/sec, latency).
- **Testing**: Jest + Supertest for API + WebSocket coverage.
- **Docs**: Swagger/OpenAPI auto-generated from NestJS.

---

✅ With this setup, *Weave* highlights skills in:
- **Real-time backend dev** (WebSockets, Redis, CRDTs).
- **Scalable infra** (Docker, K8s, Redis clustering).
- **Modern TS stack** (NestJS, Prisma, ElasticSearch).
- **DevOps & observability** (CI/CD, tracing, monitoring).

This ensures *Weave* stands out as a **cool, minimal-feature but tech-heavy project** for a backend portfolio.

