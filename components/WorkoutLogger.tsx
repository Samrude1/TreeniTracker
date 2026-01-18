import React, { useState } from 'react';
import { WorkoutSession, Exercise } from '../types';
import { Plus, Trash2, Save, X, Search } from 'lucide-react';

const COMMON_EXERCISES = [
  { name: 'Penkkipunnerrus', type: 'strength' },
  { name: 'Kyykky', type: 'strength' },
  { name: 'Maastaveto', type: 'strength' },
  { name: 'Juoksu', type: 'cardio' },
  { name: 'Kuntopyörä', type: 'cardio' },
  { name: 'Uinti', type: 'cardio' },
  { name: 'Pystypunnerrus', type: 'strength' },
  { name: 'Kulmasoutu', type: 'strength' },
  { name: 'Leuanveto', type: 'strength' },
  { name: 'Kävely', type: 'cardio' },
  { name: 'Venyttely', type: 'other' },
  { name: 'Jooga', type: 'other' }
];

interface Props {
  onSave: (workout: WorkoutSession) => void;
  onCancel: () => void;
}

const WorkoutLogger: React.FC<Props> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('Uusi treeni');
  const [exercises, setExercises] = useState<Omit<Exercise, 'id'>[]>([
    { name: '', type: 'strength', weight: 0, reps: 0, sets: 0 }
  ]);
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(null);

  const addExercise = () => {
    setExercises([...exercises, { name: '', type: 'strength', weight: 0, reps: 0, sets: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id'>, value: any) => {
    setExercises(prev => {
      const newExs = [...prev];
      if (!newExs[index]) return prev;
      newExs[index] = { ...newExs[index], [field]: value };
      return newExs;
    });
  };

  const handleSave = () => {
    const validExercises = exercises.filter(ex => ex.name.trim() !== '');
    if (validExercises.length === 0) return alert('Lisää vähintään yksi liike!');

    onSave({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name,
      exercises: validExercises.map(ex => ({ ...ex, id: Math.random().toString() })),
      calories: calories || undefined,
      protein: protein || undefined
    } as WorkoutSession);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Uusi treeni</h2>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Treenin kuvaus</label>
          <input
            type="text"
            className="w-full bg-slate-50 border-0 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-bold text-lg outline-none transition-all"
            value={name}
            placeholder="esim. Jalkapäivä"
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {exercises.map((ex, index) => (
            <div key={index} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 relative animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm ml-2">
                    {(['strength', 'cardio', 'other'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => updateExercise(index, 'type', type)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${ex.type === type ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                          }`}
                      >
                        {type === 'strength' ? 'Sali' : type === 'cardio' ? 'Cardio' : 'Muu'}
                      </button>
                    ))}
                  </div>
                </div>
                {exercises.length > 1 && (
                  <button onClick={() => removeExercise(index)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Etsi tai kirjoita aktiviteetti..."
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all font-bold"
                  value={ex.name}
                  onFocus={() => setActiveSuggestionIndex(index)}
                  onBlur={() => setTimeout(() => setActiveSuggestionIndex(null), 200)}
                  onChange={e => updateExercise(index, 'name', e.target.value)}
                />

                {activeSuggestionIndex === index && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 mt-1 grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-200">
                    {COMMON_EXERCISES
                      .filter(s => s.name.toLowerCase().includes(ex.name.toLowerCase()))
                      .slice(0, 6)
                      .map(suggest => (
                        <button
                          key={suggest.name}
                          type="button"
                          className="text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input onBlur from firing immediately
                            updateExercise(index, 'name', suggest.name);
                            updateExercise(index, 'type', suggest.type as any);
                            // Defer closing slightly to ensure state is committed
                            setTimeout(() => setActiveSuggestionIndex(null), 50);
                          }}
                        >
                          {suggest.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {ex.type === 'strength' ? (
                  <>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center">
                      <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Sarjat</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border-0 rounded-lg px-2 py-1.5 text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ex.sets}
                        onChange={e => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center">
                      <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Toistot</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border-0 rounded-lg px-2 py-1.5 text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ex.reps}
                        onChange={e => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center">
                      <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Paino kg</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-slate-50 border-0 rounded-lg px-2 py-1.5 text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ex.weight}
                        onChange={e => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center col-span-1">
                      <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Aika min</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border-0 rounded-lg px-2 py-1.5 text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ex.duration || 0}
                        onChange={e => updateExercise(index, 'duration', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center col-span-2">
                      <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Matka km / Muuta</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-50 border-0 rounded-lg px-2 py-1.5 text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ex.distance || 0}
                        onChange={e => updateExercise(index, 'distance', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addExercise}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
        >
          <div className="bg-slate-100 group-hover:bg-indigo-100 p-1 rounded-lg transition-all">
            <Plus size={18} />
          </div>
          Lisää uusi aktiviteetti
        </button>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Päivän ravinto (Valinnainen)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Kalorit (kcal)</label>
              <input
                type="number"
                className="w-full bg-transparent border-0 font-bold text-lg outline-none"
                value={calories || ''}
                onChange={e => setCalories(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Proteiini (g)</label>
              <input
                type="number"
                className="w-full bg-transparent border-0 font-bold text-lg outline-none"
                value={protein || ''}
                onChange={e => setProtein(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
        >
          <Save size={20} />
          TALLENNA TREENI
        </button>
      </div>
    </div>
  );
};

export default WorkoutLogger;
