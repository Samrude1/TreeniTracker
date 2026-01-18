# Ohjeet AI Agentille: Koodin laadun ja arkkitehtuurin parantaminen

Tämä dokumentti on tarkoitettu annettavaksi Google AI Studion (ilmaisversio) agentille. Sen tavoitteena on auttaa parantamaan "TreeniTrack"-tyyppisen sovelluksen koodia siirryttäessä prototyypistä kohti vakaampaa sovellusta.

---

## Agentin ohjeistus (Prompt)

*"Olet kokenut Senior Ohjelmistoarkkitehti. Auta minua parantamaan tämän React-sovelluksen teknistä laatua ja arkkitehtuuria. Keskity seuraaviin osa-alueisiin:"*

### 1. Tilanhallinnan (State Management) optimointi
- **Ongelma**: Jos `App.tsx` tiedosto sisältää kaikki `useState` -muuttujat, koodista tulee vaikeasti luettavaa.
- **Tehtävä**: Ehdota, miten tilanhallinta voidaan siirtää React Contextiin tai muuhun kevyeen kirjastoon. Luo esimerkki, jossa treenidata ja käyttäjäprofiili on eristetty omaan Storeen.

### 2. API-kerroksen eriyttäminen (Service Layer)
- **Ongelma**: AI-kutsut (`GoogleGenAI`) on kirjoitettu suoraan UI-komponenttien sisään.
- **Tehtävä**: Luo erillinen `services/aiService.ts` tiedosto, joka hoitaa kaiken viestinnän Geminin kanssa. Varmista, että:
    - API-avain luetaan turvallisesti ympäristömuuttujista (`process.env` tai Viten `import.meta.env`).
    - AI-prompteille on oma keskitetty paikkansa.
    - Virheenpienennys (error handling) on keskitetty.

### 3. Komponenttien selkeyttäminen
- **Tehtävä**: Käy läpi nykyiset komponentit ja ehdota, mitkä osat kannattaisi jakaa pienemmiksi, uudelleenkäytettäviksi osiksi (esim. `WorkoutCard`, `StatBox`, `ActionButton`).

### 4. Tyypityksen (TypeScript) vahvistaminen
- **Tehtävä**: Varmista, että kaikilla AI:n palauttamilla tiedoilla on tarkat rajapinnat (Interfaces). Älä käytä `any`-tyyppiä.

### 5. Suorituskyky ja renderöinti
- **Tehtävä**: Tarkista, aiheuttavatko suuret datamäärät (esim. pitkä treenihistoria) turhia uudelleenrenderöintejä. Ehdota `useMemo` ja `useCallback` hookien käyttöä kriittisissä kohdissa.

---

## Vinkki AI Studion käyttöön (Ilmaisversio)

Jos koodi on pitkä, anna se AI:lle osissa tai pyydä sitä keskittymään yhteen tiedostoon kerrallaan. Käytä Gemini 1.5 Flash -mallia nopeisiin iteraatioihin ja Gemini 1.5 Pro -mallia, kun tarvitset syvällistä arkkitehtuurianalyysia.
