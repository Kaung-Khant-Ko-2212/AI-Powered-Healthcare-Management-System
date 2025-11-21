# AI-Powered Healthcare Management System

> End-to-end digital health platform that connects patients, doctors, and administrators through intelligent automation, real-time analytics, and AI-assisted engagement.

![React](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-6db33f?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL%208-00618a?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/Status-Active%20Development-purple)

---

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Feature Highlights](#feature-highlights)
4. [Tech Stack](#tech-stack)
5. [Repository Layout](#repository-layout)
6. [Getting Started](#getting-started)
7. [AI & Automation](#ai--automation)
8. [Key API Endpoints](#key-api-endpoints)
9. [Available Scripts](#available-scripts)
10. [Roadmap](#roadmap)
11. [Contributing](#contributing)

---

## Overview

The AI-Powered Healthcare Management System is a full-stack platform built to modernize patient-provider interactions. It digitizes appointment scheduling, patient communication, doctor workflow management, and administrative analytics. By combining a React-based experience layer with a Spring Boot microservice backend and AI-powered utilities, the solution delivers:

- Personalized patient journeys with profile management, reminders, and location-aware services
- Doctor-facing dashboards for schedule orchestration, patient insights, and real-time notifications
- Administrative control over clinics, articles, specialties, foods/nutrition guidance, and hospital assets
- AI chatbot assistance for preliminary symptom triage and health education

---

## System Architecture

```
            ┌────────────────────────┐
            │   React Frontend       │
            │ (ezhealthare app)      │
            └──────────┬─────────────┘
                       │ HTTPS / REST
            ┌──────────▼─────────────┐
            │ Spring Boot Backend    │
            │ (EZHealthcare service) │
            └──────────┬─────────────┘
                       │ JPA / JDBC
            ┌──────────▼─────────────┐
            │   MySQL Database       │
            └──────────┬─────────────┘
                       │ File storage
            ┌──────────▼─────────────┐
            │  Media Uploads (S3/FS) │
            └────────────────────────┘
```

---

## Feature Highlights

- **Patient Experience**
  - Intelligent chatbot for symptom checks and FAQs
  - Appointment booking, history tracking, and cancellation management
  - Personalized dashboards with nutrition, articles, and clinic discovery

- **Doctor Workspace**
  - Availability calendars, schedule locking, and cancellation workflows
  - Patient overviews, stats cards, and engagement alerts
  - Profile management with hospital/clinic affiliations

- **Administrative Control**
  - CRUD management for doctors, specialties, foods, clinics, and hospitals
  - Article publishing pipeline with media uploads
  - Analytics on gender distribution, appointment stats, and system health

- **AI & Automation**
  - Chatbot endpoints for context-aware responses
  - Rate limiting, JWT-based security, and role-specific access layers

---

## Tech Stack

| Layer        | Technology                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, custom CSS modules, Axios                     |
| Backend      | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Lombok            |
| Database     | MySQL 8 (schema seed in `ezdatabase.sql`)                                   |
| Messaging    | In-app notifications & email hooks (configurable)                           |
| DevOps       | Maven Wrapper, npm/yarn scripts, `.idea` project metadata for JetBrains IDE |

---

## Repository Layout

```
.
├── ezhealthare/                      # React + Vite frontend
│   ├── public/                       # Static assets (icons, hero shots, logos)
│   ├── src/
│   │   ├── components/               # Patient-facing modules
│   │   ├── admins/                   # Admin dashboards & widgets
│   │   ├── doctor/                   # Doctor portal components
│   │   ├── pages/                    # Routed screens
│   │   └── styles/                   # Feature-scoped stylesheets
├── EZHealthcare-backend/             # Spring Boot backend
│   ├── EZHealthcare/EZHealthcare/    # Main service (Maven project)
│   └── uploads/                      # Local media storage (articles, doctors, profiles)
├── ezdatabase.sql                    # Seed data & schema
└── README.md                         # You are here
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+ (or Yarn)
- Java 17 (Temurin/Oracle/OpenJDK)
- Maven 3.9+ (optional, Maven Wrapper included)
- MySQL 8.x
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kaung-Khant-Ko-2212/AI-Powered-Healthcare-Management-System.git
cd AI-Powered-Healthcare-Management-System-main
```

### 2. Configure environment variables

**Frontend (`ezhealthare/.env`):**

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_KEY=<optional>
```

**Backend (`EZHealthcare-backend/EZHealthcare/EZHealthcare/src/main/resources/application.properties`):**

```
spring.datasource.url=jdbc:mysql://localhost:3306/ezhealthcare
spring.datasource.username=root
spring.datasource.password=<password>
spring.jpa.hibernate.ddl-auto=update
jwt.secret=<32+ char secret>
file.upload-dir=uploads
```

### 3. Install & run the frontend

```bash
cd ezhealthare
npm install
npm run dev   # visit http://localhost:5173
```

### 4. Install & run the backend

```bash
cd EZHealthcare-backend/EZHealthcare/EZHealthcare
./mvnw clean spring-boot:run  # Windows: mvnw.cmd spring-boot:run
```

### 5. Seed the database

```bash
mysql -u root -p ezhealthcare < ../ezdatabase.sql
```

---

## AI & Automation

- `ChatbotService` aggregates FAQ data, article snippets, and specialty knowledge to create contextual responses.
- `RateLimiter` plus JWT security ensures safe public endpoints.
- Appointment & notification services run scheduled tasks for reminders and doctor alerts.

---

## Key API Endpoints

| Method | Endpoint                               | Description                               |
|--------|-----------------------------------------|-------------------------------------------|
| POST   | `/api/auth/login`                       | Authenticate patient/admin/doctor         |
| GET    | `/api/appointments/{userId}`            | Retrieve appointments for a user          |
| POST   | `/api/appointments`                     | Book an appointment                       |
| POST   | `/api/chatbot/query`                    | AI chatbot conversation entry point       |
| GET    | `/api/articles`                         | List health articles                      |
| GET    | `/api/dashboard/stats`                  | Aggregate metrics for admin dashboards    |
| POST   | `/api/doctors/{id}/schedules`           | Publish doctor availability               |

> Full controller implementations live in `EZHealthcare-backend/.../controller`.

---

## Available Scripts

| Context   | Command                      | Purpose                                  |
|-----------|------------------------------|------------------------------------------|
| Frontend  | `npm run dev`                | Start Vite dev server                    |
| Frontend  | `npm run build`              | Create production build                  |
| Frontend  | `npm run test`               | Execute Jest/Vitest suites               |
| Backend   | `./mvnw spring-boot:run`     | Launch Spring Boot service               |
| Backend   | `./mvnw test`                | Run JUnit tests                          |
| Backend   | `./mvnw package`             | Build executable JAR                     |

---

## Roadmap

- [ ] Integrate real-time video consultation links
- [ ] Expand chatbot with multilingual LLM support
- [ ] Add push notification gateway (FCM/WebPush)
- [ ] Containerize services with Docker & Compose
- [ ] Harden CI/CD with automated quality gates

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-upgrade`
3. Commit changes: `git commit -m "feat: add amazing upgrade"`
4. Push to branch: `git push origin feature/amazing-upgrade`
5. Open a pull request – detailed descriptions and screenshots are appreciated!

For major changes, please open an issue first to discuss what you would like to change.

---

Built with ❤️ to make healthcare more accessible, data-driven, and intelligent.

