
# OHJE AI-AGENTILLE: Projektin valmistelu Vercel-julkaisua ja PWA-asennusta varten

Tämä projekti on tällä hetkellä kehitysympäristössä. Tehtäväsi on päivittää projektin rakenne siten, että se voidaan julkaista Vercelissä turvallisesti ja asentaa puhelimeen PWA-sovelluksena. 

Noudata seuraavia askeleita tarkasti:

### 1. Projektin perusrakenteen päivitys (Build-työkalut)
Luo tai päivitä seuraavat konfiguraatiotiedostot, jotta pilvipalvelu (Vercel) osaa kääntää TypeScript-koodin:

- **package.json**: Lisää `scripts` (dev, build, preview) ja tarvittavat riippuvuudet (`vite`, `@vitejs/plugin-react`, `recharts`, jne.).
- **vite.config.ts**: Luo standardi Vite-konfiguraatio Reactille. Varmista, että `process.env` on määritelty `define`-osiossa, jotta API-avaimet toimivat.
- **index.html**: Varmista, että `viewport` on asetettu mobiiliystävälliseksi (`user-scalable=no`) ja että `importmap` on ajan tasalla.

### 2. Turvallisuuden parantaminen (LockScreen)
Koska sovellus julkaistaan julkiseen URL-osoitteeseen, se on suojattava salasanalla.
- Luo uusi komponentti `components/LockScreen.tsx`.
- Komponentin tulee kysyä pääsykoodia, jota verrataan ympäristömuuttujaan `import.meta.env.VITE_APP_PASSWORD`.
- Sovelluksen ei tule ladata mitään AI-toiminnallisuuksia tai näyttää dataa ennen kuin koodi on syötetty oikein.

### 3. App.tsx logiikan päivitys
Muokkaa päätiedostoa (`App.tsx`) seuraavasti:
- Lisää tila `isAuthenticated` (lue alustava arvo `sessionStorage`-muistista).
- Tarkista muuttuja `import.meta.env.VITE_APP_PASSWORD`.
- Jos salasana on asetettu, näytä `LockScreen` ennen varsinaista sovellusta.
- Kun salasana syötetään oikein, aseta `sessionStorage.setItem('unlocked', 'true')` ja päivitä tila. Tämä varmistaa, ettei salasanaa kysytä joka välilehden päivityksellä, vaan se nollautuu vasta kun välilehti suljetaan.

### 4. Ympäristömuuttujien hallinta
Varmista, että koodi käyttää `VITE_`-alkuisia ympäristömuuttujia (esim. `VITE_GEMINI_API_KEY`). Älä koskaan kirjoita API-avainta suoraan koodiin.

### 5. Julkaisuohjeen luominen
Luo tiedosto `deploy.md`, joka opastaa käyttäjää:
1. Miten projekti viedään Verceliin.
2. Miten `VITE_GEMINI_API_KEY` ja `VITE_APP_PASSWORD` asetetaan Vercelin asetuksissa.
3. Miten sovellus asennetaan puhelimeen "Add to Home Screen" -toiminnolla.

---
**TÄRKEÄÄ:** Pidä sovelluksen nykyinen treeni- ja seurantalogiikka ennallaan, mutta kääri se näiden uusien suojaus- ja rakennuskerrosten sisään.