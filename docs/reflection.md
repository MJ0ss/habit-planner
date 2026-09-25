# Reflexion

Während des Projekts konnte ich mehrere Themen aus dem Web Programming Lab
an einer vollständigen Anwendung vertiefen.

Besonders interessant war für mich die Umsetzung der Authentifizierung mit
JWT. Dabei wurde mir der Unterschied zwischen Authentifizierung und
Autorisierung deutlich. Ein gültiger Login allein reicht nicht aus. Das
Backend muss bei geschützten Operationen zusätzlich sicherstellen, dass die
angefragten Habits und Habit-Einträge zum authentifizierten Benutzer gehören.
Die Benutzer-ID wird deshalb aus dem validierten JWT verwendet und nicht
einfach vom Frontend übernommen.

Im Angular-Frontend konnte ich den Einsatz von Services und HTTP Interceptors
vertiefen. Der Auth Interceptor ergänzt geschützte Requests automatisch um
den JWT. Dadurch muss diese Logik nicht in jeder einzelnen Komponente oder
jedem Service erneut implementiert werden.

Ein weiterer wichtiger Punkt waren die verschiedenen Testebenen. Im Projekt
wurden insgesamt 76 automatisierte Tests umgesetzt. Dabei wurde für mich der
Unterschied zwischen Frontend-Tests, Backend-Integrationstests und
End-to-End-Tests mit Cypress deutlich. Besonders die E2E-Tests waren
interessant, da sie einen vollständigen Ablauf über Benutzeroberfläche,
REST-API und Datenbank überprüfen.

Auch Docker Compose hat mein Verständnis für die Laufzeit einer Webanwendung
vertieft. Frontend, Backend und MongoDB laufen als getrennte Services. Dabei
war insbesondere die Verwendung eines Docker Volumes interessant: Der
MongoDB-Container kann neu erstellt werden, ohne dass dadurch automatisch die
gespeicherten Anwendungsdaten verloren gehen.

Rückblickend würde ich bei einem weiteren Projekt die automatisierten Tests
früher parallel zur Entwicklung erstellen und das Backend früher in mehrere
Module aufteilen. Insgesamt hat mir das Projekt vor allem geholfen, die im
Unterricht einzeln behandelten Technologien als zusammenhängendes System zu
verstehen.