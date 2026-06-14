import { UserProfile, WorkoutSession, ChatMessage, AIFeedback, TrainingProgram } from "../types";

export const generateTrainerFeedback = async (profile: UserProfile, workouts: WorkoutSession[], program?: TrainingProgram | null): Promise<AIFeedback> => {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile, workouts, program })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
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
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile, workouts, history, userInput, program })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data.text || "En saanut muodostettua vastausta.";
    } catch (error: any) {
        console.error("AI Chat error:", error);
        return "Anteeksi, tekninen häiriö valmentajan päässä. Yritätkö uudelleen?";
    }
};

export const generateTrainingProgram = async (profile: UserProfile): Promise<TrainingProgram> => {
    try {
        const response = await fetch('/api/program', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error("AI Program error:", error);
        throw error;
    }
};
