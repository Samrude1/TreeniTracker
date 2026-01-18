# TreeniTrack Pro 🚀

TreeniTrack Pro on moderni, tekoälypohjainen treenipäiväkirja, joka on suunniteltu auttamaan sinua seuraamaan edistymistäsi, analysoimaan suorituksiasi ja saavuttamaan kuntotavoitteesi maailmanluokan tekoälyvalmentajan avulla.

## Keskeiset ominaisuudet

- **Älykäs treenien kirjaaminen:** Nopeampi syöttö liike-ehdotusten ja modernien käyttöliittymäelementtien avulla.
- **Tekoälyvalmentajan analyysi:** Rakenteellista palautetta treeneistäsi ja ravinnostasi Google Gemini 1.5 Flashin avulla.
- **Visuaalinen edistyminen:** Dynaamiset kaaviot treenivolyymin ja painon kehityksen seuraamiseen.
- **Premium-käyttöliittymä:** Tyylikäs, mobiili edellä suunniteltu kokonaisuus, rakennettu Reactilla ja Tailwind CSS:llä.
- **Yksityisyys edellä:** Kaikki tiedot tallennetaan paikallisesti selaimeesi.

## Aloittaminen

### Esivaatimukset
- [Node.js](https://nodejs.org/) (Versio 18 tai uudempi)
- [Visual Studio Code](https://code.visualstudio.com/) (Suositus)

### Paikallinen asennus

1. **Kloonaa repositorio** (tai lataa lähdekoodi).
2. **Asenna riippuvuudet:**
   Avaa terminaali projektikansiossa ja aja:
   ```bash
   npm install
   ```
3. **Määritä ympäristömuuttujat:**
   Nimeä `.env.example` uudelleen muotoon `.env.local` (tai luo se) ja lisää Gemini API-avaimesi:
   ```env
   VITE_GEMINI_API_KEY=oma_api_avaimesi_tähän
   ```
   *Hanki avain täältä: [Google AI Studio](https://aistudio.google.com/).*
4. **Käynnistä kehityspalvelin:**
   ```bash
   npm run dev
   ```
   Sovellus on käytettävissä osoitteessa `http://localhost:5173`.

---

## Työskentely VS Codessa 💻

Saadaksesi parhaan kehityskokemuksen TreeniTrack Pron parissa VS Codessa:

### 1. Suositellut laajennukset (Extensions)
- **ESLint:** Koodin laadun ylläpitoon.
- **Prettier:** Johdonmukaiseen koodin muotoiluun.
- **Tailwind CSS IntelliSense:** Nopeampaan tyylittelyyn automaattisen täydennyksen avulla.
- **PostCSS Language Support:** PostCSS-tukeen.

### 2. Hyödylliset pikanäppäimet
- `Ctrl + \`` (Takalainausmerkki): Avaa/sulje integroitu terminaali.
- `F5`: Aloita debuggaus (jos määritetty).
- `Ctrl + P`: Etsi ja avaa tiedostoja nopeasti.
- `Alt + Z`: Rivitys päälle/pois (hyödyllinen pitkien tekoälykehotteiden lukemiseen).

### 3. Käyttö VS Codesta käsin
Ulkoisen terminaalin sijaan käytä **integroitua terminaalia** (`Ctrl + \``) ajaaksesi komennon `npm run dev`. Tämä pitää työnkulkusi yhtenäisenä.

---

## Tekninen pino
- **Kehys:** React 18
- **Rakennustyökalu:** Vite
- **Tyylittely:** Tailwind CSS
- **Ikonit:** Lucide React
- **Kaaviot:** Recharts
- **Tekoäly:** Google Generative AI (Gemini API)

---

## Lisenssi & AI Studio
Tämä projekti on alun perin alustettu ja sitä voidaan hallita [Google AI Studion](https://ai.studio) kautta.
