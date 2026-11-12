# Opus – Steuerung der internen Produktion für Shopware 6

> In Entwicklung – Gerüst und Konzept, noch nicht nutzbar.

Shopware-6.7-Plugin der Lohndruckerei: Arbeitsstationen (frei erweiterbar), regelbasiertes Routing anhand der Konfiguration aus Mensura, Jobs, Laufzettel mit QR-Code und touchtaugliche Stationsansichten.
Teil der Familie [Ordo](https://github.com/Lohndruckerei/sw6-ordo) (Auftragsworkflow), allein lauffähig.

## Dokumentation
- [Konzept, Datenmodell, Fahrplan, offene Fragen](docs/KONZEPT.md)
- [Schnittstellen](docs/INTEGRATION.md) · [Entwicklung](docs/ENTWICKLUNG.md)

## Installation (Entwicklung)
```bash
docker exec shopware bash -c "cd /var/www/html && bin/console plugin:refresh && bin/console plugin:install --activate LdOpus"
```
