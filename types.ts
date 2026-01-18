
export enum GoalType {
  MuscleBuild = 'Lihasmassan kasvatus',
  Strength = 'Voimaharjoittelu',
  WeightLoss = 'Painonpudotus',
  Maintenance = 'Ylläpito',
  Fitness = 'Kuntoilu'
}

export interface AIFeedback {
  analysis: string;
  technicalAnalysis?: string;
  workoutTip: string;
  nutritionTip: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: GoalType;
  targetWorkoutsPerWeek: number;
  isSetup: boolean;
  aiTrainerNote?: string;
  aiStructuredFeedback?: AIFeedback;
  weightHistory?: WeightEntry[];
  fitnessStats?: {
    benchPressMax?: number;
    squatMax?: number;
    deadliftMax?: number;
    running5kmTime?: string;
  };
}

export type ExerciseType = 'strength' | 'cardio' | 'other';

export type WeekDay = 'ma' | 'ti' | 'ke' | 'to' | 'pe' | 'la' | 'su';

export interface ProgramExercise {
  name: string;
  type: ExerciseType;
  targetSets?: number;
  targetReps?: string;
  notes?: string;
}

export interface ProgramWorkout {
  dayOfWeek: WeekDay;
  name: string;
  exercises: ProgramExercise[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  goal: GoalType;
  weeklySchedule: WeekDay[];
  workouts: ProgramWorkout[];
  createdAt: string;
  isAIGenerated: boolean;
}

export interface NutritionEntry {
  date: string;
  calories: number;
  protein: number;
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  weight?: number;
  reps?: number;
  sets?: number;
  duration?: number; // minutes
  distance?: number; // km
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  calories?: number;
  protein?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatThread {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export type View = 'dashboard' | 'history' | 'add' | 'profile' | 'chat' | 'program' | 'calendar';
