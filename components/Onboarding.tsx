
import React, { useState } from 'react';
import { UserProfile, GoalType } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<Omit<UserProfile, 'isSetup' | 'aiTrainerNote'>>({
    name: '',
    age: 25,
    height: 175,
    weight: 75,
    goal: GoalType.MuscleBuild,
    targetWorkoutsPerWeek: 3,
    fitnessStats: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('Kerro nimesi!');
    onComplete({ ...formData, isSetup: true, aiTrainerNote: 'Valmentajasi odottaa ensimmäistä treeniäsi!' });
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-white">
      <div className="max-w-sm w-full space-y-8 animate-in slide-in-from-bottom-10 duration-700">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Tervetuloa!</h1>
          <p className="text-indigo-100 opacity-90">Olen AI-valmentajasi. Asetetaan profiilisi kuntoon.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Nimi</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Matti Meikäläinen"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Ikä</label>
              <input
                type="number"
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Pituus (cm)</label>
              <input
                type="number"
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.height}
                onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Paino (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Tavoite</label>
            <select
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.goal}
              onChange={e => setFormData({ ...formData, goal: e.target.value as GoalType })}
            >
              {Object.values(GoalType).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Treenit per viikko</label>
            <input
              type="range"
              min="1"
              max="7"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={formData.targetWorkoutsPerWeek}
              onChange={e => setFormData({ ...formData, targetWorkoutsPerWeek: parseInt(e.target.value) })}
            />
            <div className="text-center font-bold text-indigo-600 mt-1">{formData.targetWorkoutsPerWeek} krt</div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Kuntotaso (Valinnainen)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Penkki (kg)</label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 font-bold text-sm outline-none"
                  value={formData.fitnessStats?.benchPressMax || ''}
                  onChange={e => setFormData({
                    ...formData,
                    fitnessStats: { ...(formData.fitnessStats || {}), benchPressMax: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Kyykky (kg)</label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 font-bold text-sm outline-none"
                  value={formData.fitnessStats?.squatMax || ''}
                  onChange={e => setFormData({
                    ...formData,
                    fitnessStats: { ...(formData.fitnessStats || {}), squatMax: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Mave (kg)</label>
                <input
                  type="number"
                  className="w-full bg-transparent border-0 font-bold text-sm outline-none"
                  value={formData.fitnessStats?.deadliftMax || ''}
                  onChange={e => setFormData({
                    ...formData,
                    fitnessStats: { ...(formData.fitnessStats || {}), deadliftMax: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">5km aika</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 font-bold text-sm outline-none"
                  value={formData.fitnessStats?.running5kmTime || ''}
                  onChange={e => setFormData({
                    ...formData,
                    fitnessStats: { ...(formData.fitnessStats || {}), running5kmTime: e.target.value }
                  })}
                  placeholder="25:00"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Aloitetaan valmennus!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
