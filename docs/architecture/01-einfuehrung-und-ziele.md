# 1. Einführung und Ziele

## 1.1 Aufgabenstellung

Der Habit Planner ist eine Webanwendung zur Planung und Auswertung von
positiven und negativen Gewohnheiten. Benutzer können Habits erstellen,
bearbeiten und löschen. Positive Habits können für bestimmte Kalendertage
geplant und anschliessend als erledigt oder verpasst erfasst werden.
Bei negativen Habits kann deren Auftreten für einen Tag erfasst werden.

Die gespeicherten Habit-Einträge werden in einer Kalenderansicht dargestellt
und für statistische Auswertungen verwendet. Die Statistik unterscheidet
zwischen positiven und negativen Habits und fasst Ergebnisse zusätzlich nach
Kategorien zusammen.

Die Anwendung unterstützt mehrere Benutzer. Benutzer registrieren sich mit
Benutzername und Passwort und müssen sich für den Zugriff auf ihre Daten
anmelden. Habits und Habit-Einträge werden einem Benutzer zugeordnet.

Die Anwendung wird als Single Page Application mit einem separaten Backend
umgesetzt. Das Frontend kommuniziert über eine HTTP-basierte REST-API mit dem
Backend. Benutzer-, Habit- und HabitEntry-Daten werden persistent in MongoDB
gespeichert.

## 1.2 Qualitätsziele

Die folgenden Qualitätsziele haben direkten Einfluss auf die Architektur des
Systems.

| Priorität | Qualitätsziel | Konkretisierung |
|---|---|---|
| 1 | Funktionale Zuverlässigkeit | Zentrale Funktionen werden automatisiert auf mehreren Ebenen geprüft. Dazu gehören Unit-Tests für Frontend und Backend, Integrationstests der REST-API und End-to-End-Tests der Benutzerabläufe. |
| 2 | Zugriffsschutz | Geschützte REST-Endpunkte erfordern einen gültigen JWT. Datenbankoperationen für Habits und Habit-Einträge werden zusätzlich anhand der Benutzer-ID des authentifizierten Benutzers eingeschränkt. Passwörter werden nicht im Klartext, sondern als bcrypt-Hash gespeichert. |
| 3 | Geräteunabhängige Bedienbarkeit | Die Benutzeroberfläche muss auf Desktop-, Tablet- und Mobilgeräten bedienbar sein. Das Layout und insbesondere die Kalenderdarstellung werden über CSS Media Queries an kleinere Bildschirmbreiten angepasst. |
| 4 | Reproduzierbarer Betrieb | Frontend, Backend und MongoDB werden als getrennte Docker-Services definiert. Die vollständige Anwendung kann über Docker Compose gebaut und gestartet werden. Die MongoDB-Daten werden über ein Docker Volume persistent gespeichert. |
| 5 | Änderbarkeit | Benutzeroberfläche, HTTP-Zugriffe, serverseitige Request-Verarbeitung und Persistenz sind auf getrennte Angular-Komponenten und -Services beziehungsweise Backend-Module verteilt. Änderungen an einer Darstellungskomponente erfordern dadurch beispielsweise keine Änderung des Datenbankzugriffs. |

Konkrete Nachweise und messbare Qualitätsszenarien werden in
[Kapitel 10 – Qualitätsanforderungen](10-qualitaetsanforderungen.md)
beschrieben.

## 1.3 Stakeholder

| Rolle | Bezug zum System und Erwartung |
|---|---|
| Benutzer | Verwenden die Weboberfläche zur Verwaltung, Planung und Erfassung ihrer Habits sowie zur Anzeige der daraus berechneten Statistiken. |
| Entwickler | Implementieren und warten Frontend, Backend, Datenmodell, Tests und Container-Konfiguration. Die Architektur muss dafür die Verantwortlichkeiten und Abhängigkeiten der Softwarebausteine dokumentieren. |
| Dozierende | Beurteilen die Umsetzung anhand der Projektanforderungen, der Software, der automatisierten Tests und der Projektdokumentation. |