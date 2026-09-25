# 4. Lösungsstrategie

Der Habit Planner besteht aus drei ausführbaren Systemteilen: Angular-Frontend,
Express-Backend und MongoDB. Das Frontend enthält die Benutzeroberfläche und
verwaltet den clientseitigen Zustand. Das Backend stellt die HTTP-API bereit,
führt Validierungen und Autorisierungsprüfungen durch und greift auf die
Datenbank zu. MongoDB übernimmt die persistente Speicherung.

| Bereich | Umsetzung |
|---|---|
| Frontend | Das Frontend wird als Angular Single Page Application umgesetzt. Die Benutzeroberfläche ist in Komponenten für Authentifizierung, Habit-Verwaltung, Kalender und Statistik aufgeteilt. Angular-Services kapseln HTTP-Zugriffe und gemeinsam verwendete Anwendungsdaten. |
| Client-Server-Kommunikation | Das Angular-Frontend sendet HTTP-Requests an die `/api/...`-Endpunkte des Express-Backends. Request- und Response-Daten werden als JSON übertragen. |
| Backend | Node.js führt die Serveranwendung aus. Express definiert die REST-Endpunkte und verarbeitet die HTTP-Requests über Route Handler und Middleware. |
| Persistenz | Das Backend greift mit dem offiziellen MongoDB Node.js Driver auf MongoDB zu. Benutzer, Habits und Habit-Einträge werden in getrennten Collections gespeichert. |
| Authentifizierung | Beim Login prüft das Backend Benutzername und Passwort. Passwörter werden mit bcrypt gehasht gespeichert. Nach erfolgreicher Anmeldung erstellt das Backend einen JWT. |
| Autorisierung | Das Frontend sendet den JWT bei geschützten Requests im `Authorization`-Header. Eine Express-Middleware validiert den Token und stellt die darin enthaltene Benutzer-ID für die nachfolgenden Request-Handler bereit. Datenbankabfragen auf Habits und Habit-Einträge werden zusätzlich anhand dieser Benutzer-ID eingeschränkt. |
| Validierung | Das Backend validiert eingehende Habit- und HabitEntry-Daten vor Datenbankoperationen. MongoDB-IDs werden vor der Verwendung als `ObjectId` geprüft. |
| Tests | Frontend-Komponenten und Services werden durch Unit-Tests getestet. Backend-Hilfsfunktionen und Middleware werden ebenfalls mit Unit-Tests geprüft. Integrationstests testen die REST-Endpunkte. Cypress führt End-to-End-Tests gegen die Anwendung aus. |
| Deployment | Frontend, Backend und MongoDB werden in getrennten Docker-Containern ausgeführt. Docker Compose definiert die Services, Port-Zuordnungen, Umgebungsvariablen und die persistente MongoDB-Datenablage. |
| Responsive Darstellung | CSS Media Queries verändern Layout und Kalenderdarstellung abhängig von der verfügbaren Bildschirmbreite. Auf kleineren Displays werden Kalendereinträge zunächst als Statuspunkte dargestellt; der ausgewählte Tag zeigt die vollständigen Einträge. |