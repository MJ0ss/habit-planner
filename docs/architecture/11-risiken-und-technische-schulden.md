# 11. Risiken und technische Schulden

Dieses Kapitel dokumentiert bekannte technische Einschränkungen der aktuellen
Implementierung. Die aufgeführten Punkte verhindern die vorgesehene Nutzung
des Habit Planners nicht, können jedoch bei einer Weiterentwicklung relevant
werden.

## 11.1 Zentrale Route Handler in app.js

Die REST-Endpunkte für Authentifizierung, Habits und Habit-Einträge befinden
sich überwiegend gemeinsam in `app.js`.

Für den aktuellen Projektumfang ist diese Struktur funktionsfähig. Mit
zusätzlichen Ressourcen und Endpunkten würde die Datei jedoch weiter wachsen
und mehrere Verantwortlichkeiten enthalten.

Eine mögliche Weiterentwicklung wäre die Aufteilung in separate Router und
darauf aufbauend gegebenenfalls Controller oder Services. Eine solche
Aufteilung wurde im aktuellen Projekt nicht umgesetzt.

## 11.2 Fest konfigurierte CORS-Origins

Die für CORS zugelassenen Frontend-Origins sind im Backend konfiguriert.
Aktuell werden die für die lokale Entwicklung und den Docker-Betrieb
verwendeten Origins berücksichtigt.

Bei einem Deployment unter einer anderen Domain müsste die CORS-Konfiguration
entsprechend angepasst werden.

Eine mögliche Weiterentwicklung wäre die Konfiguration der erlaubten Origins
über Umgebungsvariablen.

## 11.3 MongoDB ohne zusätzliche Datenbankschicht

Das Backend verwendet den MongoDB Node.js Driver direkt in den Route Handlern.
Eine separate Repository- oder Data-Access-Schicht existiert nicht.

Dadurch enthalten die Route Handler neben der HTTP-Verarbeitung auch
MongoDB-Abfragen und Datenbankoperationen.

Bei wachsendem Projektumfang könnten diese Operationen in separate Module
ausgelagert werden. Im aktuellen Projekt wurde darauf verzichtet.

## 11.4 Manuell verwaltete Beziehungen in MongoDB

Die Beziehungen zwischen `users`, `habits` und `habitEntries` werden über IDs
durch die Anwendung verwaltet.

Beim Löschen eines Habits entfernt das Backend beispielsweise explizit die
zugehörigen Habit-Einträge.

Die Konsistenz dieser Beziehungen wird damit durch die Anwendungslogik und
nicht durch relationale Fremdschlüssel oder entsprechende
Datenbank-Constraints sichergestellt.

## 11.5 Lokale Deployment-Konfiguration

Die aktuelle Docker-Konfiguration ist für den reproduzierbaren Start der
Anwendung ausgelegt. Frontend und Backend werden über lokale Ports
bereitgestellt.

Für einen öffentlichen Produktivbetrieb wären zusätzliche Aspekte zu
berücksichtigen, beispielsweise HTTPS, Domain-Konfiguration und eine an die
Zielumgebung angepasste Verwaltung von Secrets und Konfigurationswerten.

Diese Aspekte sind nicht Bestandteil des aktuellen Projektumfangs.

## 11.6 Zusammenfassung

Die vorhandenen technischen Schulden betreffen hauptsächlich die interne
Struktur des Backends und die Konfiguration für einen möglichen späteren
Produktivbetrieb.

Für den aktuellen Funktionsumfang wurden diese Einschränkungen akzeptiert.
Bei einer Erweiterung der Anwendung sollten insbesondere die Aufteilung von
`app.js`, die Trennung des Datenbankzugriffs von den Route Handlern und die
externe Konfiguration umgebungsabhängiger Werte geprüft werden.