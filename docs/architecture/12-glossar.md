# 12. Glossar

| Begriff | Bedeutung |
|---|---|
| Habit | Eine vom Benutzer erfasste Gewohnheit. Ein Habit besitzt einen Namen, einen Typ und eine Kategorie. |
| Positiver Habit | Eine gewünschte Gewohnheit, die für einen Tag geplant und anschliessend als erledigt oder verpasst erfasst werden kann. |
| Negativer Habit | Eine unerwünschte Gewohnheit. Ihr Auftreten kann für einen Tag mit dem Status `occurred` erfasst werden. |
| HabitEntry | Ein gespeicherter Eintrag, der einen Habit mit einem Datum und einem Status verknüpft. |
| `planned` | Status eines positiven HabitEntry, der für einen Tag geplant wurde. |
| `completed` | Status eines positiven HabitEntry, der vom Benutzer als erledigt markiert wurde. |
| `missed` | Status eines positiven HabitEntry, der vom Benutzer als verpasst markiert wurde. |
| `occurred` | Status für das erfasste Auftreten eines negativen Habits. |
| SPA | Single Page Application. Die Angular-Anwendung wird im Browser ausgeführt und aktualisiert ihre Darstellung ohne vollständiges Neuladen der Webseite. |
| REST | Architekturansatz für die HTTP-basierte Kommunikation zwischen Frontend und Backend. Im Habit Planner werden darüber unter anderem CRUD-Operationen ausgeführt. |
| CRUD | Create, Read, Update und Delete. Bezeichnet die grundlegenden Operationen zum Erstellen, Lesen, Ändern und Löschen von Daten. |
| JWT | JSON Web Token. Wird nach erfolgreicher Anmeldung vom Backend erzeugt und für authentifizierte API-Requests verwendet. |
| Bearer Token | Übertragungsform des JWT im HTTP-Header `Authorization`. |
| bcrypt | Bibliothek beziehungsweise Verfahren, das im Backend zum Hashen und Prüfen von Benutzerpasswörtern verwendet wird. |
| Angular | Framework, mit dem das Frontend des Habit Planners implementiert ist. |
| Express | Node.js-Webframework, mit dem die REST-API des Backends implementiert ist. |
| MongoDB | Dokumentenorientierte Datenbank zur persistenten Speicherung der Anwendungsdaten. |
| Collection | Gruppe von Dokumenten innerhalb einer MongoDB-Datenbank. Der Habit Planner verwendet `users`, `habits` und `habitEntries`. |
| ObjectId | Von MongoDB verwendeter ID-Typ zur Identifikation von Dokumenten. |
| Middleware | Funktion innerhalb der Express-Request-Verarbeitung, die einen Request vor dem nachfolgenden Route Handler verarbeitet. |
| Auth Interceptor | Angular HTTP Interceptor, der den JWT bei authentifizierten Requests in den `Authorization`-Header einfügt. |
| CORS | Cross-Origin Resource Sharing. Browsermechanismus, über den das Backend festlegt, von welchen Origins Requests zugelassen werden. |
| Docker | Container-Plattform, mit der die Laufzeitumgebungen von Frontend, Backend und MongoDB bereitgestellt werden. |
| Docker Compose | Konfiguration zum gemeinsamen Bauen und Starten der Docker-Services des Habit Planners. |
| Docker Volume | Persistenter Speicher ausserhalb des Container-Dateisystems. Für MongoDB wird `mongodb_data` verwendet. |