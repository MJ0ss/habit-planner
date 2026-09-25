# 9. Architekturentscheidungen

Dieses Kapitel dokumentiert Architekturentscheidungen, die den Aufbau und
die technische Umsetzung des Habit Planners bestimmen.

## 9.1 Angular als Single Page Application

### Ausgangssituation

Die Anwendung benötigt mehrere interaktive Ansichten für Habit-Verwaltung,
Kalender, Statistik und Authentifizierung. Änderungen an Habit- und
HabitEntry-Daten sollen ohne vollständiges Neuladen der Webseite dargestellt
werden.

### Entscheidung

Das Frontend wird als Single Page Application mit Angular und TypeScript
umgesetzt. Die Benutzeroberfläche wird in Angular-Komponenten aufgeteilt.
HTTP-Zugriffe und gemeinsam verwendete Daten werden über Angular-Services
verwaltet.

### Konsequenzen

Die Benutzeroberfläche wird nach dem initialen Laden im Browser ausgeführt.
Datenoperationen erfolgen über HTTP-Requests an das Backend. Frontend und
Backend können dadurch als getrennte Anwendungsteile entwickelt und getestet
werden.

## 9.2 REST-API zwischen Frontend und Backend

### Ausgangssituation

Das Angular-Frontend benötigt Zugriff auf Benutzer-, Habit- und
HabitEntry-Daten. Der Browser soll keinen direkten Zugriff auf die Datenbank
erhalten.

### Entscheidung

Das Express-Backend stellt HTTP-Endpunkte unter `/api/...` bereit.
Frontend und Backend übertragen Request- und Response-Daten als JSON.

CRUD-Operationen für Habits und Habit-Einträge werden über entsprechende
HTTP-Requests ausgeführt.

### Konsequenzen

Sämtliche Datenbankzugriffe erfolgen über das Backend. Die REST-Endpunkte
bilden die Kommunikationsgrenze zwischen Angular und Express.

Authentifizierung und Autorisierung können dadurch serverseitig vor einer
Datenbankoperation durchgeführt werden.

## 9.3 Node.js und Express für das Backend

### Ausgangssituation

Für die Anwendung wird ein Backend benötigt, das HTTP-Requests verarbeitet,
Authentifizierung durchführt und auf MongoDB zugreift.

### Entscheidung

Das Backend wird mit Node.js und Express umgesetzt.

Express übernimmt die Verarbeitung der HTTP-Requests und stellt Middleware
sowie Route Handler bereit. Die Anwendung wird in `app.js` konfiguriert und
über `server.js` gestartet.

### Konsequenzen

Frontend und Backend verwenden beide JavaScript beziehungsweise TypeScript
als zentrale Programmiersprache.

Die Route Handler befinden sich aktuell überwiegend in `app.js`.
Authentifizierung und Validierungsfunktionen sind mit `auth.js` und
`validation.js` teilweise in separate Module ausgelagert.

## 9.4 MongoDB als persistente Datenbank

### Ausgangssituation

Benutzerkonten, Habits und Habit-Einträge müssen über Neustarts der Anwendung
hinweg gespeichert werden.

Die Anwendung benötigt Beziehungen zwischen Benutzern, Habits und
Habit-Einträgen, verwendet für diese Daten jedoch keine komplexen relationalen
Abfragen.

### Entscheidung

Die persistente Speicherung wird mit MongoDB umgesetzt. Das Backend greift
über den offiziellen MongoDB Node.js Driver auf die Datenbank zu.

Die Daten werden auf die Collections `users`, `habits` und `habitEntries`
verteilt. Beziehungen zwischen den Dokumenten werden über IDs gespeichert.

### Konsequenzen

Das Backend arbeitet direkt mit MongoDB-Dokumenten und `ObjectId`-Werten.
Referenzen zwischen den Collections werden von der Anwendung verwaltet.

Beim Löschen eines Habits entfernt das Backend deshalb explizit auch die
zugehörigen Habit-Einträge.

## 9.5 JWT-basierte Authentifizierung

### Ausgangssituation

Die Anwendung unterstützt mehrere Benutzer. Habits und Habit-Einträge eines
Benutzers dürfen über die REST-API nicht als Daten eines anderen Benutzers
verarbeitet werden.

### Entscheidung

Nach erfolgreicher Anmeldung erzeugt das Backend einen JSON Web Token (JWT).
Das Frontend sendet diesen bei geschützten Requests als Bearer Token im
`Authorization`-Header.

Eine Express-Middleware validiert den Token und stellt die daraus ermittelte
Benutzer-ID für die nachfolgenden Route Handler bereit.

Passwörter werden vor der Speicherung mit bcrypt gehasht.

### Konsequenzen

Geschützte Route Handler können die Benutzer-ID aus der serverseitig
validierten Authentifizierungsinformation verwenden. Die Benutzer-ID für
Datenbankoperationen muss dadurch nicht aus den vom Client übertragenen
Habit- oder HabitEntry-Daten übernommen werden.

Requests ohne gültige Authentifizierung werden vor der Verarbeitung durch
geschützte Route Handler abgewiesen.

## 9.6 Docker Compose für die Laufzeitumgebung

### Ausgangssituation

Frontend, Backend und MongoDB benötigen unterschiedliche Laufzeitumgebungen
und müssen gemeinsam reproduzierbar gestartet werden können.

Zusätzlich müssen die MongoDB-Daten einen Neustart beziehungsweise das
Neuerstellen des MongoDB-Containers überstehen.

### Entscheidung

Frontend, Backend und MongoDB werden als getrennte Docker-Services betrieben.
Docker Compose beschreibt den gemeinsamen Start der Services.

Für MongoDB wird das Docker Volume `mongodb_data` verwendet.

### Konsequenzen

Die vollständige Anwendung kann mit folgendem Befehl gebaut und gestartet
werden:

```powershell
docker compose up --build
```

Das Frontend wird über Port `8080` bereitgestellt und das Backend stellt die
REST-API über Port `3000` bereit. MongoDB läuft in einem eigenen Container.

Die Datenbankdaten werden im Docker Volume gespeichert und sind dadurch nicht
an das beschreibbare Dateisystem des MongoDB-Containers gebunden.