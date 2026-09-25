# 10. Qualitätsanforderungen

Die Qualitätsanforderungen konkretisieren die in Kapitel 1 definierten
Qualitätsziele. Für überprüfbare Anforderungen werden messbare Kriterien und
die im Projekt verwendeten Nachweise angegeben.

## 10.1 Qualitätsszenarien

| Qualitätsziel | Szenario | Kriterium | Nachweis |
|---|---|---|---|
| Funktionale Zuverlässigkeit | Änderungen an zentralen Funktionen sollen automatisiert überprüft werden. | Unit-, Integrations- und End-to-End-Tests müssen erfolgreich ausgeführt werden. | 44 Frontend-Tests, 28 Backend-Tests und 4 Cypress-End-to-End-Tests werden erfolgreich ausgeführt. |
| Performance | Die gebaute Anwendung wird mit Lighthouse analysiert. | Der Durchschnitt der Lighthouse-Bewertungen muss für Mobile und Desktop mindestens 90 Punkte erreichen. | Production Build: Mobile 95 Performance, 91 Accessibility, 100 Best Practices, 90 SEO. Desktop 100 Performance, 91 Accessibility, 100 Best Practices, 90 SEO. |
| Geräteunabhängige Bedienbarkeit | Die Anwendung wird auf unterschiedlichen Bildschirmbreiten verwendet. | Habit-Verwaltung, Statistik, Authentifizierung und Kalender müssen auf Desktop-, Tablet- und Mobilansichten bedienbar bleiben. | Responsive CSS und Media Queries passen Layout und Kalenderdarstellung an kleinere Bildschirmbreiten an. |
| Zugriffsschutz | Ein Benutzer versucht ohne gültigen JWT auf einen geschützten REST-Endpunkt zuzugreifen. | Der Request darf nicht als authentifizierter Request verarbeitet werden. | Die Auth Middleware prüft den Bearer Token vor geschützten Route Handlern. |
| Datentrennung | Ein authentifizierter Benutzer versucht über eine bekannte Objekt-ID auf Daten eines anderen Benutzers zuzugreifen. | Datenbankoperationen müssen zusätzlich auf die Benutzer-ID des authentifizierten Benutzers eingeschränkt werden. | Habit- und HabitEntry-Operationen verwenden die Benutzer-ID aus dem validierten JWT. |
| Reproduzierbarer Betrieb | Die Anwendung wird in einer Umgebung mit Docker und Docker Compose gestartet. | Frontend, Backend und MongoDB müssen gemeinsam gebaut und gestartet werden können. | `docker compose up --build` startet die drei Services. |
| Persistenz | Die MongoDB-Laufzeitumgebung wird neu erstellt. | Bereits gespeicherte Daten dürfen nicht allein durch das Neuerstellen des Containers verloren gehen. | MongoDB verwendet das Docker Volume `mongodb_data`. |

## 10.2 Automatisierte Tests

Die Anwendung wird auf mehreren Testebenen überprüft.

### Frontend

Die Frontend-Tests prüfen Angular-Komponenten, Services und den
Auth Interceptor.

Der aktuelle Testlauf umfasst:

- 9 Testdateien
- 44 erfolgreich ausgeführte Tests

Unter anderem werden Authentifizierung, Habit-Verwaltung, Habit-Einträge,
Kalenderlogik und Statistik getestet.

### Backend

Die Backend-Tests umfassen Unit- und Integrationstests.

Der aktuelle Testlauf umfasst:

- 28 erfolgreich ausgeführte Tests

Getestet werden unter anderem die Auth Middleware, Validierungsfunktionen,
Authentifizierungsendpunkte, Habit-Endpunkte und HabitEntry-Endpunkte.

### End-to-End

Cypress testet zentrale Benutzerabläufe über die Benutzeroberfläche und die
dahinterliegende Anwendung.

Der aktuelle Testlauf umfasst:

- 4 erfolgreich ausgeführte End-to-End-Tests

Damit werden insgesamt 76 automatisierte Tests erfolgreich ausgeführt.

## 10.3 Lighthouse

Die Lighthouse-Messungen wurden gegen den Angular-Production-Build
durchgeführt.

### Mobile

| Kategorie | Ergebnis |
|---|---:|
| Performance | 95 |
| Accessibility | 91 |
| Best Practices | 100 |
| SEO | 90 |

Zusätzliche Messwerte:

| Messwert | Ergebnis |
|---|---:|
| First Contentful Paint | 2.3 s |
| Largest Contentful Paint | 2.4 s |
| Total Blocking Time | 10 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 2.3 s |

### Desktop

| Kategorie | Ergebnis |
|---|---:|
| Performance | 100 |
| Accessibility | 91 |
| Best Practices | 100 |
| SEO | 90 |

Zusätzliche Messwerte:

| Messwert | Ergebnis |
|---|---:|
| First Contentful Paint | 0.5 s |
| Largest Contentful Paint | 0.5 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 0.5 s |

## 10.4 Responsive Design

Das Layout wurde für Desktop-, Tablet- und Mobilansichten umgesetzt.

Auf kleineren Bildschirmbreiten werden Formulare und Bedienelemente
untereinander angeordnet. Die Kalenderdarstellung verwendet auf kleinen
Displays eine kompaktere Darstellung der Habit-Status.

Für den ausgewählten Kalendertag werden die vollständigen Habit-Einträge
angezeigt, während nicht ausgewählte Tage auf kleinen Displays über
Statusindikatoren dargestellt werden.

Dadurch bleiben Planung und Erfassung von Habits auch bei reduzierter
verfügbarer Bildschirmbreite möglich.

## 10.5 Zusammenfassung

Die definierten Qualitätsanforderungen werden durch automatisierte Tests,
Lighthouse-Messungen, serverseitige Authentifizierungs- und
Autorisierungsprüfungen, Responsive Design und die Docker-Konfiguration
überprüft.

Die Anwendung erreicht im Production Build in allen vier gemessenen
Lighthouse-Kategorien mindestens 90 Punkte und alle 76 aktuell vorhandenen
automatisierten Tests werden erfolgreich ausgeführt.