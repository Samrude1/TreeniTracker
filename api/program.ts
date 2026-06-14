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
    const { profile } = req.body;

    const currentDate = new Date().toLocaleDateString('fi-FI');
    const prompt = `Päivämäärä tänään: ${currentDate}.
    Toimi maailmanluokan personal trainerina Arnold Schwarzeneggerin hengessä.
    Käyttäjä: ${profile?.name}, Ikä: ${profile?.age}, Pituus: ${profile?.height}cm, Paino: ${profile?.weight}kg, Tavoite: ${profile?.goal}, Tavoitetreenit: ${profile?.targetWorkoutsPerWeek} krt/vko.
    
    ${ARNOLD_GUIDELINES}
    
    LUO OPTIMAALINEN OHJELMA ARNOLDIN FILOSOFIAA KUNNIOITTAEN:
    - Jos tavoite on lihas tai voima, käytä Arnoldin metodeja (esim. suosi perusliikkeitä, mahdollisesti Golden Six -pohjalta tai Arnoldin split-metodeilla).
    - Suosi pyramiditoistoja (esim. 12, 10, 8, 6).
    - Lisää motivaatiota nostattavia Arnold-henkisiä muistiinpanoja (notes).
    
    Vastaa AINOASTAAN JSON-muodossa seuraavalla rakenteella:
    {
      "id": "random-id",
      "name": "Ohjelman nimi",
      "goal": "${profile?.goal || ''}",
      "weeklySchedule": ["ma", "ke", "pe"], 
      "workouts": [
        {
          "dayOfWeek": "ma",
          "name": "Treenin nimi (esim. Arnold's Chest & Back)",
          "exercises": [
            { "name": "Liikkeen nimi", "type": "strength", "targetSets": 4, "targetReps": "12, 10, 8, 6", "notes": "Arnoldin vinkki: Visualisoi lihas vuorena" }
          ]
        }
      ],
      "createdAt": "${new Date().toISOString()}",
      "isAIGenerated": true
    }
    Varmista että viikko-ohjelmassa on täsmälleen ${profile?.targetWorkoutsPerWeek || 3} treenipäivää.
    Kieli: Suomi.`;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json'
        } as any
    });

    const text = result.text || "{}";
    const program = JSON.parse(text);
    program.id = Date.now().toString();
    program.createdAt = new Date().toISOString();
    
    return res.status(200).json(program);
  } catch (error: any) {
    console.error("AI Program error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
