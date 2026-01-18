
import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutSession, View, GoalType, ChatThread, TrainingProgram } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import History from './components/History';
import WorkoutLogger from './components/WorkoutLogger';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import AIChat from './components/AIChat';
import ProgramView from './components/ProgramView';
import LockScreen from './components/LockScreen';
import { generateTrainerFeedback } from './services/aiService';
import { Activity, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('treenitrack_unlocked') === 'true';
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('treenitrack_profile');
    return saved ? {
      weightHistory: [], // Default to empty array if missing
      ...JSON.parse(saved)
    } : {
      name: '',
      age: 30,
      weight: 80,
      goal: GoalType.MuscleBuild,
      targetWorkoutsPerWeek: 3,
      isSetup: false,
      aiTrainerNote: '',
      weightHistory: []
    };
  });

  const [workouts, setWorkouts] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('treenitrack_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('treenitrack_chat_threads');
    return saved ? JSON.parse(saved) : [];
  });

  const [trainingProgram, setTrainingProgram] = useState<TrainingProgram | null>(() => {
    const saved = localStorage.getItem('treenitrack_program');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem('treenitrack_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('treenitrack_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('treenitrack_chat_threads', JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem('treenitrack_program', JSON.stringify(trainingProgram));
  }, [trainingProgram]);

  const getAITrainerFeedback = async (currentProfile: UserProfile, currentWorkouts: WorkoutSession[], program?: TrainingProgram | null) => {
    setIsAnalyzing(true);
    try {
      const feedback = await generateTrainerFeedback(currentProfile, currentWorkouts, program || trainingProgram);
      setProfile(prev => ({
        ...prev,
        aiTrainerNote: feedback.analysis, // Keep for fallback
        aiStructuredFeedback: feedback
      }));
    } catch (error) {
      console.error("AI Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const updated = { ...newProfile, isSetup: true };
    setProfile(updated);
    getAITrainerFeedback(updated, workouts, trainingProgram);
  };

  const addWorkout = (workout: WorkoutSession) => {
    const newWorkouts = [workout, ...workouts];
    setWorkouts(newWorkouts);
    setCurrentView('dashboard');
    getAITrainerFeedback(profile, newWorkouts, trainingProgram);
  };

  // Added missing deleteWorkout function to fix the reference error in the History component
  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const updateProfile = (newProfile: UserProfile) => {
    const isWeightChanged = newProfile.weight !== profile.weight;
    let finalProfile = newProfile;

    if (isWeightChanged) {
      const weightEntry = {
        date: new Date().toISOString(),
        weight: newProfile.weight
      };
      finalProfile = {
        ...newProfile,
        weightHistory: [...(profile.weightHistory || []), weightEntry]
      };
      getAITrainerFeedback(finalProfile, workouts, trainingProgram);
    }
    setProfile(finalProfile);
  };

  // 1. Check if app is locked (only if VITE_APP_PASSWORD is set)
  const appPassword = (import.meta as any).env.VITE_APP_PASSWORD;
  if (appPassword && !isAuthenticated) {
    return <LockScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  if (!profile.isSetup) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto bg-white shadow-xl relative overflow-x-hidden flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-slate-100 p-4 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-indigo-200 shadow-lg">
            <Activity className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">TreeniTrack <span className="text-indigo-600">Pro</span></h1>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full animate-pulse border border-indigo-100">
            <Sparkles className="text-indigo-500" size={14} />
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Analysoidaan...</span>
          </div>
        )}
      </header>

      <main className="p-4 animate-in fade-in duration-500 flex-grow overflow-y-auto">
        {currentView === 'dashboard' && (
          <Dashboard profile={profile} workouts={workouts} />
        )}
        {currentView === 'history' && (
          <History workouts={workouts} onDelete={deleteWorkout} />
        )}
        {currentView === 'add' && (
          <WorkoutLogger onSave={addWorkout} onCancel={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'profile' && (
          <Profile profile={profile} onUpdate={updateProfile} onRefreshAI={() => getAITrainerFeedback(profile, workouts, trainingProgram)} />
        )}
        {currentView === 'chat' && (
          <AIChat
            profile={profile}
            workouts={workouts}
            threads={chatThreads}
            setThreads={setChatThreads}
            program={trainingProgram}
            onProgramUpdate={setTrainingProgram}
          />
        )}
        {currentView === 'program' && (
          <ProgramView
            profile={profile}
            program={trainingProgram}
            onProgramGenerated={setTrainingProgram}
            onNavigate={(v) => setCurrentView(v)}
          />
        )}
      </main>

      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
