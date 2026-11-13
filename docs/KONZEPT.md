# Opus – Konzept

Opus steuert, organisiert und überwacht die **interne Folienproduktion**. Ein Auftrag, den Ordo (Automatik
oder Mitarbeiter) in die interne Produktion gibt, wird zum **Job**. Regeln entscheiden anhand der
Konfiguration, welche **Arbeitsschritte** an welchen **Arbeitsstationen** nötig sind.

Stand: 2026-11-12 · Status: Konzept, Gerüst angelegt · Gesamtablauf: `sw6-ordo/docs/KONZEPT.md`

## 1. Begriffe

| Begriff | Bedeutung | Beispiel |
|---|---|---|
| **Station** | Arbeitsplatz, frei anlegbar, mit Reihenfolge, Kapazität und Anzeige | Datenprüfung, Druckdatenerstellung, Druck (Maschine A), Laminieren, Schneiden, Verpacken, Versand |
| **Job** | eine Bestellposition in der internen Produktion | 50 Stk. Folie 500×300 mm, glänzend laminiert, Freiformschnitt |
| **Arbeitsschritt** | Job an einer Station mit Status `waiting`, `in_progress`, `done`, `blocked`, `skipped` | „Laminieren – in Arbeit seit 10:42, M. Muster“ |
| **Routing-Regel** | Bedingung über die Konfiguration → Stationen hinzufügen/entfernen | Laminat ≠ „ohne“ → Station „Laminieren“ |
| **Laufzettel** | Jobticket (PDF) mit QR-Code, Vorschau und allen Angaben | liegt beim Material, wird an jeder Station gescannt |

**Interne Produktion = Coloroprint (COL).** Stationen heute (laut SOM, 2026): Rip → Druck (Mimaki 160 A/B/C/D) → Laminieren → Schneiden
(Mimaki Plott, Hand schneiden, Wild) → Verpacken → Versand (GLS). Engpässe: Laminieren Ø 19 h,
Druck Ø 12–15 h, Plott Ø 16 h Liegezeit (Details: `sw6-ordo/docs/SOM-AUSWERTUNG.md`).

## 2. Regelbasiertes Routing

Grundidee: Eine **Standard-Route** (alle Stationen in Reihenfolge) wird durch Regeln verändert. Regeln sind
in der Administration pflegbar, erweiterbar und mit einem **Simulator** testbar („Diese Konfiguration
durchläuft: …“).

- **Eingang:** strukturierte Konfiguration aus Mensura (`ldMensura`-Payload/Schnappschuss: Kalkulation,
  Material, Format, Optionen `group`/`value`, Motive). Der Positionstext dient nur der Anzeige; Regeln
  arbeiten auf den technischen Schlüsseln, damit Umbenennungen nichts brechen.
- **Bedingungen:** Kalkulation ist …, Material ist/gehört zu …, Option *Gruppe* = *Wert*, Format größer
  als …, Menge größer als …, Express ja/nein; verknüpft mit UND/ODER. Optional eine Shopware-Regel
  (Rule Builder) für Kunden-/Bestellbedingungen.
- **Aktionen:** Station hinzufügen, entfernen oder ersetzen (z. B. „Schneiden“ → „Plotter“ statt
  „Schneidemaschine“), Hinweis für die Station setzen, Priorität ändern.
- **Reihenfolge:** Regeln mit Priorität; Ergebnis = geordnete Liste der Stationen, beim Anlegen des Jobs
  gespeichert (spätere Regeländerungen ändern laufende Jobs nicht).
- **Erweiterbar:** neue Bedingungstypen per Symfony-Tag (`opus.routing_condition`), neue Stationen ohne
  Programmierung.
- **Von Hand:** an jedem Job lassen sich Schritte hinzufügen, überspringen oder neu ordnen (protokolliert).

Beispiel: *Folie, Laminat glänzend, Freiformschnitt* → Datenprüfung → Druckdatenerstellung (mit Kontur)
→ Druck → Laminieren → Schneiden (Plotter) → Verpacken → Versand.

## 3. Stationsansicht

- Vollbild am PC/Laptop (kein Scanner, keine Tablets – E10), große Knöpfe, je Station eine Liste „wartet / in Arbeit / fertig“, sortiert nach Termin,
  Ampel und Express-Kennzeichen; gruppierbar nach Material (Sammeldruck).
- **Start/Fertig per Knopf**; Job wandert zur nächsten Station. QR auf dem Laufzettel optional
  (Suche per Auftragsnummer, später Smartphone-App).
- **Problem melden:** Grund (Datenfehler, Material fehlt, Fehldruck/Nachdruck …) → Schritt `blocked`,
  Kundenservice wird benachrichtigt.
- Mitarbeiter sehen nur ihre Stationen und wo ein Auftrag gerade liegt; keine Preise.
- Versandstation: nutzt den Versandarbeitsplatz aus Ordo/Vectura (Lieferschein, Label).

## 4. Datenmodell (Entwurf)

| Entity | Inhalt |
|---|---|
| `ld_opus_station` | Name, Kürzel, Reihenfolge, Farbe/Icon, aktiv, Kapazität (optional) |
| `ld_opus_routing_rule` | Name, Priorität, Bedingungen (JSON), Aktionen (JSON), aktiv |
| `ld_opus_job` | Bestellposition (ID), Bestellung (ID), Status, Termin, Priorität, Route (Schnappschuss) |
| `ld_opus_job_step` | Job, Station, Position, Status, Start/Ende, Benutzer, Hinweis, Sperrgrund |

## 5. Schnittstellen

- Alle Stationsaktionen auch über die Admin-API, damit eine spätere **Android-App** (eigenes Projekt:
  Station abschließen und weiterleiten, Stand verfolgen) ohne Umbau andocken kann. Kein Scanner nötig;
  QR auf dem Laufzettel bleibt optional (Smartphone-Kamera).
- Ordo → Opus: `JobService::createForLineItem($orderLineItemId)` (beim Freigabe-Tor).
- Opus → Ordo: Events/Flow `opus.job.created`, `opus.step.started`, `opus.step.finished`,
  `opus.step.blocked`, `opus.job.finished` (Position versandbereit).
- Status je Position für Kundenservice: `JobStatusProvider::forOrder($orderId)`.

## 6. Fahrplan

1. Gerüst ✔ · 2. Stationen + Jobs + Stationsansicht · 3. Routing-Regeln + Simulator ·
4. Laufzettel mit QR + Scan · 5. Problem melden, Kennzahlen (Durchlaufzeit je Station) ·
6. später: Sammeldruck/Nesting, Kapazitätsplanung, Zeiterfassung.

## 7. Offene Fragen

- Welche Stationen und Maschinen gibt es heute genau (Drucker, Laminator, Plotter/Schneidetisch)?
- Wird an Stationen per Tablet/PC gearbeitet, gibt es Barcode-Scanner und Drucker für Laufzettel?
- Werden Aufträge zu Sammeldrucken zusammengefasst (gleiches Material)? Durch wen?
- Soll Zeiterfassung je Arbeitsschritt erfolgen (Nachkalkulation)?
