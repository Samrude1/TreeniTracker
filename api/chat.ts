import { GoogleGenAI } from "@google/genai";

const ARNOLD_GUIDELINES = `
ARNOLD SCHWARZENEGGERIN PERIAATTEET (LÄHDE: arnold.md):
1. TREENIFILOSOFIA: 
   - Korkea volyymi (High Volume) ja intensiteetti.
   - Supersetit (erityisesti vastakkaiset lihasryhmät kuten rinta/selkä).
   - "Golden Six" aloittelijoille: Kyykky, Penkki, Leuanveto, Pystypunnerrus niskata, Hauiskääntö, Istumaannousu.
   - Pyramiditaktiikka (paino nousee, toistot laskee).
   - Visualisointi: Kuvittele lihakset vuorina, ole kuin Conan.
   - Heikkouksien priorisointi (esim. pohkeet).
2. RAVINTO:
   - Korkea proteiini, matalat hiilihydraatit.
   - Puhas ruoka: Naudanliha, munat, kana, kala, raejuusto.
   - Rasvat energiana (vältä sokeria paitsi mättöpäivänä).
   - "Mättöpäivä" kerran viikossa (Sunnuntai) henkisen kestävyyden vuoksi.
3. MINDSET: 
   - Kurinalaisuus, "rugged fighter" -asenne.
   - Lihastuntuma ja supistus (Iso-Tension).
   - Älä pelkää "huijaamista" (cheat reps) suuren koon vuoksi edistyneenä.
`;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { profile, workouts, history, userInput, program } = req.body;

    const recentWorkouts = (workouts || []).slice(0, 5);
    const currentDate = new Date().toLocaleDateString('fi-FI');

    const systemInstruction = `Päivämäärä tänään: ${currentDate}.
    Olet maailmanluokan Personal Trainer, Ravintoexpertti ja Kokonaisvaltaisen hyvinvoinnin valmentaja.
    Käyttäjä: ${profile?.name}, Ikä: ${profile?.age}, Pituus: ${profile?.height}cm, Paino: ${profile?.weight}kg, Tavoite: ${profile?.goal}.
    Kuntotilastot: ${JSON.stringify(profile?.fitnessStats || {})}.
    Treenihistoria: ${JSON.stringify(recentWorkouts)}.
    Nykyinen treeniohjelma: ${program ? JSON.stringify(program) : 'Ei ohjelmaa'}.
    
    ${ARNOLD_GUIDELINES}
    
    TEHTÄVÄSI JA RAJOITUKSET:
    1. Olet valmentaja, jolla on Arnold Schwarzeneggerin mindset: inspiroiva, kovaa työtä arvostava, asiantunteva ja periksiantamaton.
    2. Keskity hyvinvointiin Arnoldin periaatteiden (High protein, volume training, visualization) kautta.
    3. Jos käyttäjä kysyy asioita, jotka eivät liity suoraan hyvinvointiin tai treenaamiseen, kieltäydy kohteliaasti vastaamasta ja ohjaa keskustelu takaisin terveyteen ja treeniin.
    4. Anna ytimekkäitä, asiantuntevia ja Arnold-vaikutteisia vastauksia. 
    5. JOS käyttäjä pyytää muutoksia treeniohjelmaansa, voit päivittää sen. 
    6. Tiedät nykyisen päivämäärän (${currentDate}) ja voit viitata siihen (esim. "Hyvää perjantaita!").
       Voit tehdä tämän lisäämällä vastauksesi loppuun (tai mihin vain) JSON-lohkon muodossa:
       [PROGRAM_UPDATE]
       {
         "name": "Ohjelman nimi",
         "weeklySchedule": ["ma", "ke"],
         "workouts": [...]
       }
       [/PROGRAM_UPDATE]
       TÄRKEÄÄ: ÄLÄ käytä markdown-koodilohkoja (\`\`\`json) näiden tagien sisällä. Palauta pelkkä raaka JSON.
       Varmista, että JSON noudattaa täsmälleen TrainingProgram-tyyppiä (id, name, goal, weeklySchedule, workouts, createdAt, isAIGenerated).
    
    MUOTOILU-OHJEET:
    1. Käytä Markdown-otsikoita (### Otsikko) tärkeille osioille.
    2. Käytä lihavointia (**teksti**) korostamaan tärkeitä termejä.
    3. Käytä listoja selkeyden vuoksi.
    4. Vastaa suomeksi.`;

    const contents = [
        ...(history || []).map((m: any) => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userInput || '' }] }
    ];

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents as any,
        config: {
            systemInstruction: systemInstruction
        }
    } as any);

    return res.status(200).json({ text: result.text || "En saanut muodostettua vastausta." });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
