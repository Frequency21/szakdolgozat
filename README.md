# Szakdolgozat munkaterv

[Téma kiírás](https://docs.google.com/document/d/1VllMbMdSKZ6yyhZe3ADl-Sam3ohCbMjg7E28BQaBJ9o/edit#heading=h.hla3koyfzxlg)

[Google Drive](https://drive.google.com/drive/u/0/folders/13YJWOTPm5rYxoNnLLGlBq1WRqWowBnOt)

A szakdolgozat célja egy full stack áruhírdető webalkalmazás fejlesztése Angular és NestJS technológiák segítségével.

## Specifikáció

A webalkalmazás szempontjából 3 különböző típusú felhasználói csoport van, ezek a vendég (guest), regisztrált (registered), rendszergazda (admin) felhasználók.

A szerepkörökhöz tartozó megengedett tevékenységek:

- közös:
  - be- és kijelentkezés (e-mail vagy facebook)
  - termékek és profilok megtekintése
- vendég:
  - regisztrálás
- regisztrált felhasználó:
  - hírdetés feladása (fix ár, vagy aukció)
  - kérdezés az eladótól (komment szerű szekció)
  - licitálás egy hírdetésre
  - termékek kosárba helyezése
  - kosár tartalmának véglegesítése
  - vásárlást követő értékelés (vevő az eladót és eladó a vevőt)
  - hírdetés megfigyelése / nyomonkövetése
  - kategória megfigyelése / nyomonkövetése
- admin:
  - felhasználó, hírdetés, komment, értékelés törlése
  - felhasználó blokkolása

### Egyéb specifikációk

Felhasználó:

- id
- név
- email
- ?profilkép (backenden tárolni)
- ?születési dátum
- ?telefonszám

Profilon megjelenő adatok:

- név
- email
- ?telefonszám
- hírdetések (új oldalra irányít, szűrési lehetőségekkel),
  ilyen például a kategória / aktív, inaktív, ár
- értékelések:
  - x :star: :star: :star: :star: :star:
  - y :star: :star: :star: :star:
  - z :star: :star: :star:
  - v :star: :star:
  - w :star:
- üzenetküldési lehetőségek, csevegés megtekintése

## Piackutatás

|                            |       Vatera       |      Jófogás       |      TeszVesz      |
| :------------------------- | :----------------: | :----------------: | :----------------: |
| Reszponzív                 | :white_check_mark: | :white_check_mark: |        :x:         |
| Bejelentkezés Facebookkal  | :white_check_mark: |        :x:         |        :x:         |
| Aukció                     | :white_check_mark: |        :x:         | :white_check_mark: |
| Chat / Üzenet              | :white_check_mark: |        :x:         |        :x:         |
| Kérdezés a vevőtől         | :white_check_mark: |        :x:         | :white_check_mark: |
| Hírdetés figyelés          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Kategória figyelés         |        :x:         |        :x:         |        :x:         |
| Részletes keresés / Szűrők | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Eladó értékelése           | :white_check_mark: | :white_check_mark: |        :x:         |
| Vevő értékelése            | :white_check_mark: |        :x:         | :white_check_mark: |
