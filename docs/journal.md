# Journal

Dieses Journal dokumentiert die Bearbeitung der Unterrichtsinhalte während
der Blockwoche sowie die anschliessende Entwicklung des Habit-Planner-Projekts.

> **Hinweis:** Die Arbeitszeiten wurden während der Durchführung nicht exakt
> protokolliert. Die folgenden Zeitangaben wurden nachträglich anhand der
> Unterrichtszeiten, Arbeitstage und Projektaktivitäten rekonstruiert und sind
> deshalb als ungefähre Werte zu verstehen.

## Blockwoche

| Datum | Aufwand | Tätigkeit |
|---|---:|---|
| 31.08.2026 | ca. 7 h | Einstieg in das Web Programming Lab und Beschäftigung mit verschiedenen Architekturansätzen für Webanwendungen. Bearbeitung der JavaScript-Grundlagen und Übungen zu Variablen, Datentypen, Objekten, Arrays, Funktionen, Scope, Klassen sowie Promises und `async`/`await`. |
| 01.09.2026 | ca. 7 h | Vertiefung von clientseitigem JavaScript. Übungen zum DOM mit `querySelector` und `querySelectorAll`, Lesen und Ändern von HTML-Attributen sowie dynamisches Erzeugen von HTML-Inhalten aus JavaScript-Daten. Zusätzlich Beschäftigung mit Events, Forms, HTTP-Zugriff und dem Browser Object Model. |
| 02.09.2026 | ca. 8 h | Einstieg in Single Page Applications und Angular. Beschäftigung mit Angular-Komponenten, Directives, Services, Dependency Injection, Pipes, Routing und HTTP. Bearbeitung der Angular-Übungen und erste praktische Verwendung von Services und Client-Side Routing. Zusätzlich Ausarbeitung der Projektidee für den Habit Planner und Erstellung des Projektvorschlags mit User Stories und Technologie-Stack. |
| 03.09.2026 | ca. 8 h | Vertiefung der Angular- und Server-Themen. Beschäftigung mit Angular Testing und RxJS. Übungen zur serverseitigen Verarbeitung und persistenten Speicherung von Daten mit Node.js und MongoDB. Verwendung des offiziellen MongoDB Node.js Drivers und Umsetzung beziehungsweise Erprobung von REST-Endpunkten für das Speichern und Laden von Daten. |
| 04.09.2026 | ca. 8 h | Beschäftigung mit CORS und verschiedenen Verfahren zur Authentifizierung von Webanwendungen. Vergleich von Basic Authentication, Digest Authentication und JWT sowie weitere behandelte Verfahren. Praktische Übungen mit einer geschützten Express-Ressource und einer JWT-basierten Anmeldung. |
| 05.09.2026 | ca. 6 h | Weiterarbeit an Übungen aus der Blockwoche, die während der Unterrichtstage noch nicht vollständig abgeschlossen waren. Wiederholung und Vertiefung der behandelten Inhalte. |

**Aufwand Blockwoche: ca. 44 h**

## Unterbruch durch FX-Prüfung

| Zeitraum | Aufwand | Tätigkeit |
|---|---:|---|
| 06.09.–14.09.2026 | 0 h | Keine wesentliche Arbeit am Habit-Planner-Projekt. In dieser Zeit lag der Fokus auf der Vorbereitung auf die FX-Prüfung. Die eigentliche Implementierung des Projekts wurde deshalb erst danach begonnen. |

## Projektumsetzung

| Datum | Aufwand | Tätigkeit |
|---|---:|---|
| 15.09.2026 | ca. 3 h | Start der eigentlichen Projektumsetzung. Git-Repository eingerichtet und grundlegende Projektstruktur für Frontend und Backend vorbereitet. |
| 16.09.2026 | ca. 3 h | Angular-Frontend eingerichtet und lokal gestartet. Express-Backend erstellt und MongoDB angebunden. Erste REST-Endpunkte implementiert und die persistente Speicherung getestet. |
| 17.09.2026 | ca. 4 h | Angular-Frontend mit der Habits-API verbunden. HabitService für HTTP-Zugriffe verwendet und Habit-Daten aus dem Express-Backend im Frontend dargestellt. |
| 18.09.–20.09.2026 | ca. 20 h | Habit-Modell und HabitService überarbeitet. Erstellen, Löschen und Bearbeiten von Habits im Angular-Frontend umgesetzt. Anschliessend die Kalenderfunktion erweitert, sodass Habits für Tage geplant und Habit-Einträge erfasst werden können. |
| 21.09.2026 | ca. 3 h | Kalendernavigation und Hervorhebung des ausgewählten Tages umgesetzt. Statistikansicht ergänzt und Berechnung einer allgemeinen Erfolgsrate implementiert. Dabei die Behandlung von positiven und negativen Habits in der Statistik definiert. |
| 22.09.2026 | ca. 3 h | Registrierung und Login mit JWT und bcrypt umgesetzt. Habits und Habit-Einträge einem Benutzer zugeordnet und Backend-Zugriffe auf die Daten des authentifizierten Benutzers eingeschränkt. Kategorien und Kategorie-Statistiken ergänzt. Beim Löschen eines Habits werden zugehörige Habit-Einträge ebenfalls entfernt. Zusätzlich Backend-Validierung und Zugriffsschutz erweitert sowie die Angular-Testkonfiguration korrigiert. |
| 23.09.2026 | ca. 3 h | Frontend-Tests ausgebaut. Unit-Tests für Statistiklogik und HTTP-Zugriffe des HabitService erstellt. Tests für den Auth Interceptor ergänzt und weitere bestehende Frontend-Funktionen automatisiert getestet. |
| 24.09.2026 | ca. 4 h | Backend für automatisierte Tests vorbereitet und Unit- sowie Integrationstests ergänzt. Cypress-End-to-End-Tests für vollständige Benutzerabläufe umgesetzt. Responsive Design insbesondere für kleinere Bildschirmgrössen und die Kalenderansicht überarbeitet. Anschliessend Frontend, Backend und MongoDB in Docker Compose integriert und den vollständigen Start der Anwendung über Docker getestet. |
| 25.09.2026 | ca. 6 h | Projektdateien mit Prettier einheitlich formatiert. Production Build und Lighthouse-Messungen überprüft. Architekturdokumentation nach arc42 fertiggestellt und mit der tatsächlichen Implementierung abgeglichen. Reflexion und Journal für die Projektabgabe erstellt. |

**Aufwand Projektumsetzung: ca. 49 h**

## Gesamtaufwand

| Bereich | Aufwand |
|---|---:|
| Blockwoche und Übungen | ca. 44 h |
| Projektumsetzung | ca. 49 h |
| **Gesamt** | **ca. 93 h** |

Die angegebenen Zeiten sind nachträglich rekonstruierte Näherungswerte.

## Ergebnis

Am Ende des Projekts besteht der Habit Planner aus einem Angular-Frontend,
einem Node.js-/Express-Backend und einer MongoDB-Datenbank. Die Anwendung
unterstützt benutzerspezifische Habits, Kalenderplanung, Tracking und
Statistiken sowie Registrierung und Login.

Frontend, Backend und MongoDB können gemeinsam über Docker Compose gestartet
werden. Die Anwendung wird durch Frontend-, Backend- und
End-to-End-Tests überprüft.