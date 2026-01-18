import { GoogleGenAI } from "@google/genai";
import { UserProfile, WorkoutSession, ChatMessage, AIFeedback, TrainingProgram } from "../types";

// Standard Vite environment variable
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === "PLACEHOLDER_API_KEY" || API_KEY === "your_actual_key_here") {
    console.warn("VAROITUS: Gemini API-avain puuttuu tai on oletusarvoinen. Tarkista .env tiedosto.");
}

const ai = new GoogleGenAI({
    apiKey: API_KEY,
});

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

export const generateTrainerFeedback = async (profile: UserProfile, workouts: WorkoutSession[], program?: TrainingProgram | null): Promise<AIFeedback> => {
    try {
        const recentWorkouts = workouts.slice(0, 5);

        const prompt = `Toimi maailmanluokan personal trainerina, ravintoexperttinä ja hyvinvointivalmentajana.
    Keskity AINOASTAAN fyysiseen ja henkiseen hyvinvointiin, treenaamiseen ja ravintoon.
    Viimeisimmät treenitiedot: ${JSON.stringify(recentWorkouts)}.
    Aktiivinen treeniohjelma: ${program ? JSON.stringify(program) : 'Ei ohjelmaa asetettu'}.
    Kuntotilastot (max painot/ajat): ${JSON.stringify(profile.fitnessStats || {})}.
    BMI: ${(profile.weight / (profile.height / 100 * profile.height / 100)).toFixed(1)}. (Huom: BMI voi olla korkea lihasmassan vuoksi, huomioi tämä analyysissasi).
    
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
            model: 'gemini-2.0-flash-exp',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json'
            } as any
        });

        const text = result.text || "";
        return JSON.parse(text) as AIFeedback;
    } catch (error) {
        console.error("AI Analysis error:", error);
        return {
            analysis: "En saanut analyysia juuri nyt, mutta jatka hienoa työtä!",
            workoutTip: "Keskity tasaisuuteen ja riittävään lepoon.",
            nutritionTip: "Muista juoda riittävästi vettä päivän aikana."
        };
    }
};

export const generateChatResponse = async (
    profile: UserProfile,
    workouts: WorkoutSession[],
    history: ChatMessage[],
    userInput: string,
    program?: TrainingProgram | null
): Promise<string> => {
    try {
        const recentWorkouts = workouts.slice(0, 5);

        const systemInstruction = `Olet maailmanluokan Personal Trainer, Ravintoexpertti ja Kokonaisvaltaisen hyvinvoinnin valmentaja.
    Käyttäjä: ${profile.name}, Ikä: ${profile.age}, Pituus: ${profile.height}cm, Paino: ${profile.weight}kg, Tavoite: ${profile.goal}.
    Kuntotilastot: ${JSON.stringify(profile.fitnessStats || {})}.
    Treenihistoria: ${JSON.stringify(recentWorkouts)}.
    Nykyinen treeniohjelma: ${program ? JSON.stringify(program) : 'Ei ohjelmaa'}.
    
    ${ARNOLD_GUIDELINES}
    
    TEHTÄVÄSI JA RAJOITUKSET:
    1. Olet valmentaja, jolla on Arnold Schwarzeneggerin mindset: inspiroiva, kovaa työtä arvostava, asiantunteva ja periksiantamaton.
    2. Keskity hyvinvointiin Arnoldin periaatteiden (High protein, volume training, visualization) kautta.
    3. Jos käyttäjä kysyy asioita, jotka eivät liity suoraan hyvinvointiin tai treenaamiseen, kieltäydy kohteliaasti vastaamasta ja ohjaa keskustelu takaisin terveyteen ja treeniin.
    4. Anna ytimekkäitä, asiantuntevia ja Arnold-vaikutteisia vastauksia. 
    4. JOS käyttäjä pyytää muutoksia treeniohjelmaansa, voit päivittää sen. 
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
            ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: userInput }] }
        ];

        const result = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: contents as any,
            config: {
                systemInstruction: systemInstruction
            }
        } as any);

        return result.text || "En saanut muodostettua vastausta.";
    } catch (error) {
        console.error("AI Chat error:", error);
        return "Anteeksi, tekninen häiriö valmentajan päässä. Yritätkö uudelleen?";
    }
};

export const generateTrainingProgram = async (profile: UserProfile): Promise<TrainingProgram> => {
    try {
        const prompt = `Toimi maailmanluokan personal trainerina Arnold Schwarzeneggerin hengessä.
    Käyttäjä: ${profile.name}, Ikä: ${profile.age}, Pituus: ${profile.height}cm, Paino: ${profile.weight}kg, Tavoite: ${profile.goal}, Tavoitetreenit: ${profile.targetWorkoutsPerWeek} krt/vko.
    
    ${ARNOLD_GUIDELINES}
    
    LUO OPTIMAALINEN OHJELMA ARNOLDIN FILOSOFIAA KUNNIOITTAEN:
    - Jos tavoite on lihas tai voima, käytä Arnoldin metodeja (esim. suosi perusliikkeitä, mahdollisesti Golden Six -pohjalta tai Arnoldin split-metodeilla).
    - Suosi pyramiditoistoja (esim. 12, 10, 8, 6).
    - Lisää motivaatiota nostattavia Arnold-henkisiä muistiinpanoja (notes).
    
    Vastaa AINOASTAAN JSON-muodossa seuraavalla rakenteella:
    {
      "id": "random-id",
      "name": "Ohjelman nimi",
      "goal": "${profile.goal}",
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
    Varmista että viikko-ohjelmassa on täsmälleen ${profile.targetWorkoutsPerWeek} treenipäivää.
    Kieli: Suomi.`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json'
            } as any
        });

        const text = result.text || "";
        const program = JSON.parse(text) as TrainingProgram;
        program.id = Date.now().toString();
        program.createdAt = new Date().toISOString();
        return program;
    } catch (error) {
        console.error("AI Program error:", error);
        throw error;
    }
};
