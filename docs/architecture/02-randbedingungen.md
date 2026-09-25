# 2. Randbedingungen

Die folgenden Randbedingungen ergeben sich aus den Vorgaben des Web Programming
Lab und aus der Entwicklungsumgebung des Projekts.

## 2.1 Technische Randbedingungen

| Randbedingung | Auswirkung auf die Umsetzung |
|---|---|
| Webanwendung | Die Anwendung wird über einen Webbrowser verwendet und benötigt keine Installation einer nativen Client-Anwendung. |
| Single Page Application | Das Frontend wird als SPA umgesetzt. Navigation und Aktualisierung der dargestellten Daten erfolgen clientseitig. |
| Persistente Datenhaltung | Benutzer-, Habit- und HabitEntry-Daten müssen über Neustarts der Anwendung hinweg gespeichert bleiben. |
| REST-Schnittstelle | Der Zugriff des Frontends auf die serverseitigen Daten und Funktionen erfolgt über eine HTTP-basierte REST-API. |
| Responsive Darstellung | Die Benutzeroberfläche muss auf Desktop-, Tablet- und Mobilgeräten verwendbar sein. |
| Reproduzierbarer Start | Die Anwendung muss als Produktions-Bundle über eine öffentliche URL oder reproduzierbar über `docker compose up` bereitgestellt werden können. |
| Browserbasierte Kommunikation | Frontend und Backend kommunizieren über HTTP. Dadurch gelten insbesondere die Same-Origin- und CORS-Regeln des Browsers. |

## 2.2 Qualitäts- und Testvorgaben

| Randbedingung | Auswirkung auf die Umsetzung |
|---|---|
| Automatisierte Tests | Für die Anwendung müssen sinnvolle automatisierte Unit-, Integrations- und End-to-End-Tests vorhanden sein. |
| Lighthouse | Die Anwendung muss bei der Lighthouse-Auswertung im Durchschnitt mindestens 90 Punkte für Mobile und Desktop erreichen. |
| Codequalität | Quellcode und Projektstruktur sollen so aufgebaut sein, dass die Implementierung nachvollziehbar und erweiterbar bleibt. |

## 2.3 Organisatorische Randbedingungen

| Randbedingung | Auswirkung auf das Projekt |
|---|---|
| Einzelarbeit | Entwicklung, Tests und Dokumentation werden im Rahmen eines Einzelprojekts durchgeführt. |
| Zeitrahmen | Für Implementierung und Dokumentation sind ungefähr 60 Arbeitsstunden vorgesehen. |
| Versionsverwaltung | Quellcode und Dokumentation werden mit Git versioniert und im Projekt-Repository abgelegt. |
| Projektartefakte | Neben der lauffähigen Software werden Architekturdokumentation, Reflexion und Arbeitsjournal erstellt. |