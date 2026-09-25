# Habit Planner & Tracker

Web Programming Lab Projekt

Der Habit Planner ist eine Webapplikation zur Planung und Verfolgung positiver
und negativer Gewohnheiten. Positive Habits können für bestimmte Tage geplant
und anschliessend als erledigt oder verpasst markiert werden. Bei negativen
Habits kann deren Auftreten erfasst werden.

Eine Kalenderansicht ermöglicht die tägliche Planung und Erfassung. Zusätzlich
wertet eine Statistikansicht die erfassten Habit-Einträge insgesamt und nach
Kategorien aus. Benutzer können sich registrieren und anmelden; Habits und
Habit-Einträge werden benutzerspezifisch gespeichert.

## Funktionen

- Erstellen, Bearbeiten und Löschen von Habits
- Positive und negative Habits
- Kategorien für Habits
- Planung über eine Kalenderansicht
- Tracking von erledigten, verpassten und aufgetretenen Habits
- Gesamt- und Kategorie-Statistiken
- Registrierung und Login
- Benutzerbezogene Datenspeicherung
- Responsive Darstellung für Desktop, Tablet und Mobile

## Technologie-Stack

### Frontend

- Angular
- TypeScript
- HTML / CSS

### Backend

- Node.js
- Express
- REST API
- JWT Authentication
- bcrypt

### Datenbank

- MongoDB
- MongoDB Node.js Driver

### Testing

- Angular Unit Tests
- Backend Unit- und Integrationstests
- Cypress End-to-End Tests

### Deployment

- Docker
- Docker Compose

## Anwendung starten

Voraussetzung ist eine installierte Docker-Umgebung.

Das gesamte Projekt kann aus dem Root-Verzeichnis gestartet werden:

```powershell
docker compose up --build
```

Danach ist das Frontend erreichbar unter:

```text
http://localhost:8080
```

Die REST-API läuft unter:

```text
http://localhost:3000
```

## Projektstruktur

```text
habit-planner/
├── frontend/       Angular-Frontend
├── backend/        Node.js-/Express-Backend
├── docs/           Projektdokumentation
├── compose.yaml    Docker-Compose-Konfiguration
└── README.md
```

## Dokumentation

Die Architekturdokumentation basiert auf arc42 und befindet sich unter:

[Architekturdokumentation](docs/architecture/README.md)

Weitere Projektdokumente:

- [Reflexion](docs/reflection.md)
- [Journal](docs/journal.md)

## Tests

Das Projekt enthält automatisierte Tests auf mehreren Ebenen:

- 44 Frontend-Tests
- 28 Backend-Tests
- 4 Cypress-End-to-End-Tests
- **76 automatisierte Tests insgesamt**

Zusätzlich wurde der Production Build mit Lighthouse überprüft.