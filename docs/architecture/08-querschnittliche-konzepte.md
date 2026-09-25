# 8. Querschnittliche Konzepte

Dieses Kapitel beschreibt technische Konzepte, die mehrere Bausteine des
Habit Planners betreffen.

## 8.1 Authentifizierung und Autorisierung

Die Authentifizierung basiert auf JSON Web Tokens (JWT).

Bei der Registrierung wird das Passwort mit bcrypt gehasht, bevor es in der
`users`-Collection gespeichert wird. Beim Login vergleicht das Backend das
eingegebene Passwort mit dem gespeicherten Hash. Nach erfolgreicher Prüfung
erzeugt das Backend einen JWT.

Das Frontend verwaltet den erhaltenen Token im Auth Service. Der Auth
Interceptor ergänzt geschützte HTTP-Requests um den Header:

```text
Authorization: Bearer <JWT>
```

Im Backend liest die Auth Middleware den Token aus diesem Header und validiert
ihn. Die aus dem Token ermittelte Benutzer-ID steht anschliessend den
geschützten Route Handlern zur Verfügung.

Die Benutzer-ID für geschützte Datenoperationen wird damit nicht aus den vom
Frontend übertragenen Habit- oder HabitEntry-Daten übernommen.

## 8.2 Benutzerbezogene Datenhaltung

Habits und Habit-Einträge werden einem Benutzer zugeordnet.

Bei Abfragen und Änderungen verwendet das Backend die Benutzer-ID des
authentifizierten Benutzers zusätzlich zur jeweiligen Objekt-ID. Dadurch wird
nicht allein anhand einer vom Client übertragenen Habit- oder HabitEntry-ID
auf Daten zugegriffen.

Ein HabitEntry enthält zusätzlich eine Referenz auf den zugehörigen Habit.
Beim Erstellen eines HabitEntry prüft das Backend den referenzierten Habit.

Beim Löschen eines Habits werden die zugehörigen Habit-Einträge ebenfalls
gelöscht.

## 8.3 Validierung

Eingehende Daten werden im Backend vor den entsprechenden
Datenbankoperationen geprüft.

Die in `validation.js` ausgelagerten Funktionen prüfen unter anderem:

- Habit-Daten wie Name, Kategorie und Typ
- zulässige Habit-Typen (`positive`, `negative`)
- zulässige HabitEntry-Statuswerte (`planned`, `completed`, `missed`, `occurred`)

MongoDB-IDs werden vor ihrer Verwendung als `ObjectId` auf ein gültiges
Format geprüft.

Die serverseitige Validierung erfolgt unabhängig von Eingabebeschränkungen im
Angular-Frontend. Dadurch müssen auch Requests, die direkt an die REST-API
gesendet werden, die definierten Datenbedingungen erfüllen.

## 8.4 Kommunikation zwischen Frontend und Backend

Das Angular-Frontend kommuniziert über HTTP mit der REST-API des
Express-Backends. Request- und Response-Daten werden als JSON übertragen.

Der Zugriff auf die REST-API wird im Frontend über Angular-Services gekapselt.
Der Habit Service verarbeitet Requests für Habits, der Habit Entry Service
Requests für Habit-Einträge und der Auth Service Requests für Registrierung
und Anmeldung.

Geschützte Requests werden vom Auth Interceptor um den JWT im
`Authorization`-Header ergänzt.

Das Frontend greift nicht direkt auf MongoDB zu. Sämtliche Datenbankoperationen
werden im Backend ausgeführt.

## 8.5 HTTP-Fehlerbehandlung

Das Backend verwendet HTTP-Statuscodes, um erfolgreiche und fehlgeschlagene
API-Operationen zu unterscheiden.

Authentifizierungsfehler werden zurückgegeben, wenn kein Bearer Token
vorhanden ist oder ein Token nicht erfolgreich validiert werden kann.

Die Route Handler prüfen zusätzlich die für eine Operation benötigten
Eingabedaten und IDs. Kann eine Operation nicht durchgeführt werden, wird
eine entsprechende Fehlerantwort an das Frontend zurückgegeben.

Das Angular-Frontend erhält diese Antworten über die jeweiligen Services.
Nach erfolgreichen Schreiboperationen werden die im Frontend verwendeten
Daten aktualisiert.

## 8.6 Persistenz und Datenbeziehungen

Die persistente Speicherung erfolgt in MongoDB. Das Backend verwendet dafür
den offiziellen MongoDB Node.js Driver.

Die Daten sind auf drei Collections verteilt:

| Collection | Beziehung |
|---|---|
| `users` | Enthält die registrierten Benutzer. |
| `habits` | Ein Habit ist einem Benutzer zugeordnet. |
| `habitEntries` | Ein HabitEntry ist einem Benutzer und einem Habit zugeordnet. |

Die Zuordnungen werden über IDs gespeichert. Bei Datenbankoperationen auf
benutzerbezogenen Daten berücksichtigt das Backend die Benutzer-ID des
authentifizierten Benutzers.

Die MongoDB-Daten werden beim Docker-Betrieb über das Volume `mongodb_data`
ausserhalb des MongoDB-Containers persistent gespeichert.