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
    const { profile, workouts, program } = req.body;

    const recentWorkouts = (workouts || []).slice(0, 5);
    const currentDate = new Date().toLocaleDateString('fi-FI');
    
    const bmi = profile.height && profile.weight 
        ? (profile.weight / (profile.height / 100 * profile.height / 100)).toFixed(1)
        : 'Ei tiedossa';

    const prompt = `Päivämäärä tänään: ${currentDate}.
    Toimi maailmanluokan personal trainerina, ravintoexperttinä ja hyvinvointivalmentajana.
    Keskity AINOASTAAN fyysiseen ja henkiseen hyvinvointiin, treenaamiseen ja ravintoon.
    Viimeisimmät treenitiedot: ${JSON.stringify(recentWorkouts)}.
    Aktiivinen treeniohjelma: ${program ? JSON.stringify(program) : 'Ei ohjelmaa asetettu'}.
    Kuntotilastot (max painot/ajat): ${JSON.stringify(profile.fitnessStats || {})}.
    BMI: ${bmi}. (Huom: BMI voi olla korkea lihasmassan vuoksi, huomioi tämä analyysissasi).
    
    ${ARNOLD_GUIDELINES}
    
    KÄYTÄ ARNOLDIN FILOSOFIAA: 
    - Jos tavoitteena on lihas/voima, suosi Arnoldin metodeja.
    - Anna palautetta "Arnold-mindsetilla": ole vaativa mutta inspiroiva.
    
    Analysoi tilanne ja anna asiantunteva palaute sekä kuntotason arvio.
    Vastaa AINOASTAAN JSON-muodossa seuraavalla rakenteella:
    {
      "analysis": "lyhyt analyysi nykytilanteesta (hyvinvointi & treeni)",
      "technicalAnalysis": "kuntoanalyysi perustuen BMI:hin ja kuntotilastoihin",
      "workoutTip": "tarkka treeni- tai hyvinvointivinkki",
      "nutritionTip": "tarkka ravintovinkki"
    }
    Kieli: Suomi.`;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json'
        } as any
    });

    const text = result.text || "{}";
    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
