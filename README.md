# Szakdolgozat munkaterv

A szakdolgozat célja egy full stack áruhírdető webalkalmazás fejlesztése Angular és NestJS technológiák segítségével.

## Specifikáció

A webalkalmazás szempontjából 3 különböző típusú felhasználói csoport van, ezek a vendég (guest), regisztrált (registered), rendszergazda (admin) felhasználók.

A szerepkörökhöz tartozó megengedett tevékenységek:
- közös:
  - be- és kijelentkezés
  - termékek és profilok megtekintése
- vendég:
  - regisztrálás
- regisztrált felhasználó:
  - hírdetés feladása
  - kérdezés az eladótól (komment szerű szekció)
  - termék licitálás
  - termékek kosárba helyezése
  - kosár tartalmának véglegesítése
  - vásárlást követő értékelés (vevő az eladót és eladó a vevőt)

## off

Piackutatás:

|                            |       Vatera       |      Jófogás       |      TeszVesz      |
| :------------------------- | :----------------: | :----------------: | :----------------: |
| Reszponzív                 | :white_check_mark: | :white_check_mark: |        :x:         | <!-- y --> |
| Bejelentkezés Facebookkal  | :white_check_mark: |        :x:         |        :x:         | <!-- y --> |
| Aukció                     | :white_check_mark: |        :x:         | :white_check_mark: | <!-- y --> |
| Chat / Üzenet              | :white_check_mark: |        :x:         |        :x:         | <!-- y --> |
| Kérdezés a vevőtől         | :white_check_mark: |        :x:         | :white_check_mark: | <!-- y --> |
| Hírdetés figyelés          | :white_check_mark: | :white_check_mark: | :white_check_mark: | <!-- y --> |
| Kategória figyelés         |        :x:         |        :x:         |        :x:         | <!-- y --> |
| Részletes keresés / Szűrők | :white_check_mark: | :white_check_mark: | :white_check_mark: | <!-- y --> |
| Eladó értékelése           | :white_check_mark: | :white_check_mark: |        :x:         | <!-- y --> |
| Vevő értékelése            | :white_check_mark: |        :x:         | :white_check_mark: | <!-- y --> |

## end off
