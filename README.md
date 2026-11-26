# HotelFlow - Housekeeping ohne Papier

**Ein persönliches Lern- und Portfolio-Projekt von Deniz Can Balcik**  
**Technologien:** HTML, CSS, JavaScript, Browser-`localStorage` und n8n (lokaler Prototyp)

> **Projektstatus:** Funktionsfähiger Web-Prototyp mit fiktiven Testdaten. Die n8n-Automatisierung wird lokal getestet; eine direkte Verbindung zur Webseite und eine gemeinsame Datenbank sind noch nicht vorhanden.

## 1. Die Idee: ein vollständig papierloses Housekeeping

Im Hotelalltag werden Zimmerlisten und Reinigungsaufgaben teilweise noch auf Papier verteilt. Neue Informationen müssen dann mündlich weitergegeben oder auf den Listen ergänzt werden. Das kann zu doppelter Arbeit, unklaren Zuständigkeiten und veralteten Informationen führen.

**Das langfristige Hauptziel von HotelFlow ist, die gesamte Zimmerorganisation papierlos zu gestalten.** Mitarbeitende sollen aktuelle Aufgaben auf einem digitalen Gerät sehen, Zimmerstatus sofort ändern und nachvollziehen können, wer welches Zimmer übernimmt. Die Housekeeping-Leitung soll die Übersicht behalten, ohne jeden Tag neue Listen ausdrucken und verteilen zu müssen.

Ein möglicher zukünftiger Ablauf:

1. Die Zimmer für den Tag werden zentral eingetragen oder aus einem vorhandenen System übernommen.
2. Die Housekeeping-Leitung weist Aufgaben den Mitarbeitenden zu.
3. Alle sehen ihre aktuellen Aufgaben auf dem Smartphone, Tablet oder Computer.
4. Nach Beginn oder Abschluss der Reinigung wird der Zimmerstatus direkt aktualisiert.
5. Änderungen werden für das Team synchronisiert. Auswertungen und Benachrichtigungen laufen bei Bedarf automatisch.

**Wichtig:** Das ist die Zielvorstellung. Die aktuelle Demo ersetzt noch keine Papierlisten in einem echten Hotel und ist nicht an ein produktives Hotelsystem angeschlossen.

## 2. Was heute schon funktioniert: die Webseite

HotelFlow ist eine browserbasierte Demo ohne externe Frameworks. Die Oberfläche ist auf Deutsch gestaltet und zeigt Zimmer, Etagen, Reinigungsstatus und zuständige Mitarbeitende.

| Funktion | Beschreibung |
| --- | --- |
| Dashboard | Zählt alle Zimmer sowie die Zimmer mit Status **Zu reinigen**, **In Bearbeitung** und **Gereinigt / Bereit**. |
| Zimmerverwaltung | Zimmer hinzufügen, Zimmernummer und Etage bearbeiten sowie Zimmer nach Bestätigung löschen. Doppelte Zimmernummern werden beim Anlegen und Bearbeiten geprüft. |
| Statusverwaltung | Für jedes Zimmer kann der Reinigungsstatus direkt geändert werden. |
| Mitarbeiterzuweisung | Jedes Zimmer kann einer Person aus der Mitarbeiterliste zugewiesen werden. |
| Mitarbeiterverwaltung | Namen hinzufügen und über eine Auswahlliste wieder entfernen. Eine Person kann erst gelöscht werden, wenn ihr keine Zimmer mehr zugeordnet sind. |
| Suche und Filter | Suche nach **Zimmernummer**; separate Dropdown-Filter für **Status** und **Etage**. |
| Mehrfachänderung | Mehrere sichtbare Zimmer über Checkboxen auswählen und ihren Status gemeinsam ändern. |
| CSV-Export | Die aktuelle Zimmerliste als `HotelFlow_Zimmerliste.csv` herunterladen. |
| Zurücksetzen | Die Zimmerdaten nach einer Rückfrage auf die Beispielwerte zurücksetzen. |
| Lokale Speicherung | Zimmer und Mitarbeitende werden im jeweiligen Browser gespeichert, sodass Änderungen beim Neuladen normalerweise erhalten bleiben. |

### Die vier Zimmerstatus

- **Zu reinigen:** Das Zimmer steht zur Reinigung an.
- **In Bearbeitung:** Die Reinigung läuft.
- **Gereinigt:** Die Reinigung wurde abgeschlossen.
- **Bereit:** Das Zimmer ist als bereit markiert.

Die Demo startet mit **30 fiktiven Zimmern auf drei Etagen** und **5 fiktiven Mitarbeitenden**. Die Liste kann durch eigene Testzimmer ergänzt werden.

## 3. Technischer Aufbau der Webseite

| Datei / Technik | Aufgabe |
| --- | --- |
| `index.html` | Struktur der Oberfläche: Dashboard, Formulare, Filter, Tabelle und Schaltflächen. |
| `style.css` | Layout, Farben, Abstände, Statusanzeigen und responsive Gestaltung. |
| `script.js` | Datenlogik: Ereignisse, Berechnungen, Einfügen, Bearbeiten, Löschen, Filtern, Speichern und CSV-Export. |
| `localStorage` | Speichert die Daten **nur in dem Browser**, in dem die Demo verwendet wird. |

JavaScript verarbeitet Benutzeraktionen und zeichnet die Tabelle nach einer Änderung neu. Dadurch werden beispielsweise ein neuer Mitarbeiter oder ein geänderter Status direkt sichtbar. Die Dashboard-Zähler werden aus den aktuellen Zimmerdaten berechnet.

Ein vereinfachtes Beispiel für ein Zimmerobjekt:

```json
{
  "number": 205,
  "floor": 2,
  "status": "In Bearbeitung",
  "employee": "Anna"
}
```

Die Demo verwendet die Browser-Schlüssel `hotelflow-demo-v1` für Zimmer und `hotelflow-people` für Mitarbeitende. Ein Browserwechsel, ein anderes Gerät oder das Löschen der Browserdaten kann zu einem anderen Datenstand beziehungsweise zum Verlust lokaler Änderungen führen. **`localStorage` ist keine gemeinsame Datenbank und keine zuverlässige Datensicherung für den Hotelbetrieb.**

## 4. Die Web-Demo starten

1. Die Dateien `index.html`, `style.css` und `script.js` in denselben Ordner legen.
2. `index.html` in einem aktuellen Browser öffnen.
3. Ein Zimmer suchen, seinen Status ändern oder eine andere Person zuweisen.
4. Optional ein Zimmer hinzufügen, mehrere Zimmer markieren oder einen CSV-Export durchführen.

Es ist für die reine Web-Demo **keine Installation von Node.js, kein Webserver und kein n8n** notwendig. Die Seite kann auch statisch gehostet werden. Dadurch entsteht aber **keine** automatische Synchronisierung zwischen den Benutzern.

### Ordnerstruktur für GitHub

```text
HotelFlow/
├── index.html
├── style.css
├── script.js
├── README.md
└── docs/
    └── n8n-workflow.png
```

## 5. Von der Webseite zur CSV-Datei

Mit **CSV exportieren** erstellt die Webseite eine Datei mit den Spalten `Zimmer`, `Etage`, `Status` und `Mitarbeiter`. Der Export enthält die aktuell gespeicherten Zimmerdaten.

Technische Details des Exports:

- Dateiname: `HotelFlow_Zimmerliste.csv`
- Trennzeichen: **Semikolon (`;`)**
- Felder: mit Anführungszeichen umschlossen
- Kodierung: **UTF-8 mit BOM** (zur besseren Erkennung durch Excel)

Die CSV-Datei dient aktuell als **manuelle Brücke** zwischen der Webseite und dem n8n-Versuch. Die Webseite verschickt die Daten noch nicht automatisch an n8n.

## 6. n8n: lokaler Automatisierungs-Prototyp

n8n ist ein Werkzeug, mit dem sich mehrere Verarbeitungsschritte zu einem Workflow verbinden lassen. Für dieses Projekt läuft n8n **lokal auf dem eigenen Windows-PC**, nicht als Bestandteil der Webseite und nicht als öffentlich erreichbarer Dienst.

Im Test wurde n8n mit einer lokalen Node.js-Umgebung gestartet. Die Oberfläche ist während des Betriebs gewöhnlich unter `http://localhost:5678` erreichbar. **`localhost` bedeutet: auf genau diesem Computer.** Wird der lokale n8n-Prozess beendet oder der PC ausgeschaltet, steht dieses Formular nicht mehr bereit.

### Der aktuelle Workflow

![Lokaler n8n-Workflow: CSV-Upload bis Excel-Ausgabe](docs/n8n-workflow.png)

**Manueller Ablauf:** In HotelFlow die CSV herunterladen -> das lokale n8n-Formular öffnen -> CSV hochladen -> Daten verarbeiten -> Excel-Datei erzeugen.

| Schritt | Node | Was passiert? | Aktueller Stand |
| --- | --- | --- | --- |
| 1 | **On form submission** | Ein n8n-Formular nimmt die heruntergeladene CSV-Datei entgegen. | Datei-Upload getestet. |
| 2 | **Extract from File** | Die CSV wird in einzelne Datensätze zerlegt. In einem Test kamen **30 Zimmer** an. | Funktioniert nach Anpassungen der Datei-/CSV-Einstellungen. |
| 3 | **Filter** | Kann ausgewählte Zimmer nach einer Bedingung weiterleiten. | Im dokumentierten Ablauf **deaktiviert**. |
| 4 | **Summarize** | Soll später zum Beispiel Zimmer pro Person oder Status zählen. | Die fachlich korrekte Auswertung ist **noch nicht fertig**. |
| 5 | **Edit Fields** | Ordnet Felder für das Ausgabeformat zu beziehungsweise bereitet sie vor. | Technisch ausgeführt; die Auswertung davor muss noch verbessert werden. |
| 6 | **Convert to File** | Wandelt die verarbeiteten Daten in eine **XLSX-Datei** um. | Datei wurde erzeugt; ihr Inhalt ist noch keine korrekte Zimmerauswertung. |

Der separat links im Screenshot sichtbare **HTTP Request** stammt aus einem früheren Versuch und ist **nicht mit dem aktiven Ablauf verbunden**.

### Warum es mehrere Fehlermeldungen gab

Beim Experimentieren traten unter anderem diese Probleme auf:

1. **Read/Write Files from Disk - Access to the file is not allowed:** Der lokale Dateizugriff war eingeschränkt. Deshalb wurde auf ein Formular zum Hochladen umgestellt.
2. **The item has no binary field:** Der Name des Binärfeldes in `Extract from File` passte zunächst nicht zum hochgeladenen Formularfeld. Bei n8n muss der tatsächliche Binärschlüssel verwendet werden, nicht einfach der sichtbare Dateiname.
3. **Invalid Opening Quote / UTF-8 BOM:** Die CSV enthält ein BOM-Zeichen sowie Semikolon-Trennzeichen und Anführungszeichen. Beim Einlesen müssen die passenden CSV-Einstellungen verwendet werden.

Diese Fehler halfen dabei, die Unterschiede zwischen **Datei**, **Binärfeld**, **CSV-Format** und **Datensätzen** besser zu verstehen. Dass ein Node grün ist, bedeutet allerdings nicht automatisch, dass die fachliche Auswertung korrekt ist.

### n8n für einen lokalen Test starten

Voraussetzung ist eine auf dem Computer funktionierende Node.js-/n8n-Installation. Für die verwendete lokale Testumgebung wurde n8n über die Kommandozeile gestartet; ein typischer Startbefehl lautet:

```powershell
npx n8n
```

Danach im Browser `http://localhost:5678` öffnen und den vorhandenen Workflow auswählen. Der Formular-Link funktioniert nur, solange der lokale n8n-Dienst erreichbar ist. Die konkreten Feldnamen in `Extract from File` müssen zur tatsächlich übermittelten Datei passen.

Der Workflow ist **nicht automatisch über GitHub Pages verfügbar**. Die Veröffentlichung der statischen Webseite startet keinen n8n-Server.

## 7. Aktueller Stand und klare Grenzen

| Bereich | Heute | Langfristiges Ziel |
| --- | --- | --- |
| Oberfläche | Funktionsfähige Web-Demo mit fiktiven Daten | Alltagstaugliche Oberfläche für das Housekeeping |
| Datenspeicherung | `localStorage` je Browser | Zentrale Datenbank und Datensicherung |
| Teamarbeit | Keine geräteübergreifende Synchronisierung | Alle sehen denselben aktuellen Zimmerstand |
| n8n | Lokaler manueller CSV-Upload | Direkte, abgesicherte Datenübertragung |
| Berichte | XLSX-Datei technisch erzeugt, Zusammenfassung noch fehlerhaft | Korrekte Tages- und Mitarbeiterberichte |
| Papierlisten | Noch nicht ersetzt | Zimmeraufgaben vollständig papierlos bearbeiten |

## 8. Geplante Weiterentwicklung

Der Weg zu einer wirklich papierlosen Lösung könnte in vier Etappen erfolgen:

**Etappe 1 - Datenqualität:** Die n8n-Zusammenfassung korrigieren und mit unterschiedlichen CSV-Dateien prüfen. Beispielsweise zählen, wie viele Zimmer jeder Person zugewiesen sind und welchen Status diese Zimmer haben.

**Etappe 2 - Zentrale Daten:** Die Zimmerliste in einer Datenbank statt nur im Browser speichern. Berechtigte Mitarbeitende könnten damit über verschiedene Geräte denselben Datenstand nutzen.

**Etappe 3 - Direkte Verbindung:** Die Webseite über eine **geschützte Schnittstelle** mit einem Backend und n8n verbinden. Damit entfällt der manuelle CSV-Upload. Im öffentlichen JavaScript dürfen keine geheimen Zugangsdaten stehen.

**Etappe 4 - Einsatz im Arbeitsalltag:** Benutzerrollen, mobile Nutzung, Änderungsverlauf, sinnvolle Benachrichtigungen, Fehlerbehandlung, Datensicherung und Datenschutz prüfen. Erst nach Tests und Freigabe könnte ein Betrieb ohne Papierlisten realistisch werden.

Eine zukünftige Architektur wäre beispielsweise:

```text
Smartphone / Tablet / PC
          |
      HotelFlow
          |
   Geschuetzte API
       /      \
  Datenbank   n8n-Workflows
                |
       Berichte / Hinweise
```

## 9. Sicherheit, Datenschutz und Transparenz

- Die Demo verwendet ausschließlich **fiktive Zimmer- und Mitarbeiternamen**.
- Es werden keine Gästedaten veröffentlicht und keine echten Hotelaufträge automatisiert.
- Eine echte Einführung würde sichere Anmeldung, Zugriffsrechte, verschlüsselte Datenübertragung und die Einhaltung der geltenden Datenschutzanforderungen erfordern.
- Öffentliche Repositories dürfen keine Passwörter, API-Schlüssel oder internen Daten enthalten.
- n8n läuft in diesem Projekt lokal. Ein öffentlicher Formular-Endpunkt oder Produktivbetrieb wurde nicht eingerichtet.
- Bei der Entwicklung habe ich auch **KI als Lernhilfe** für Erklärungen und Fehlersuche genutzt. Funktionen und Änderungen wurden Schritt für Schritt ausprobiert und überprüft.

## 10. Was ich mit HotelFlow gelernt habe

- Anforderungen aus dem Arbeitsalltag in konkrete Softwarefunktionen übersetzen.
- Eine Weboberfläche mit HTML und CSS strukturieren und gestalten.
- Mit JavaScript Formulare, Ereignisse, Tabellen, Filter und Statusänderungen umsetzen.
- Browserdaten speichern und die Grenzen von `localStorage` verstehen.
- CSV-Dateien exportieren und Dateiformate bei der Verarbeitung berücksichtigen.
- Erste Automatisierungsschritte in n8n aufbauen und Fehlermeldungen systematisch untersuchen.
- Zwischen **funktionierendem Prototyp**, **unfertiger Funktion** und **zukünftiger Idee** unterscheiden.

---

**Kurz gesagt:** HotelFlow ist ein erster praktischer Schritt in Richtung eines vollständig digitalen, papierlosen Housekeepings. Die Webseite kann bereits Zimmer und Aufgaben lokal verwalten. Der lokale n8n-Versuch untersucht die Weiterverarbeitung der CSV-Daten. Für den echten gemeinsamen Einsatz fehlen unter anderem eine zentrale Datenbank, eine sichere Verbindung und eine verlässliche Synchronisierung.
