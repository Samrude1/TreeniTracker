import React from 'react';
import { UserProfile, GoalType } from '../types';
import { LogOut, RefreshCw, Scale, Target, Calendar, TrendingUp, Ruler } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onRefreshAI: () => void;
}

const Profile: React.FC<Props> = ({ profile, onUpdate, onRefreshAI }) => {
  const handleChange = (field: keyof UserProfile, value: any) => {
    onUpdate({ ...profile, [field]: value });
  };

  const handleReset = () => {
    if (confirm('Haluatko varmasti tyhjentää kaikki tiedot?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col items-center py-6">
        <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200 border-4 border-white transform transition-transform hover:rotate-3 duration-300">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">{profile.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">
            {profile.goal}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400 text-xs font-bold">{profile.age} vuotta</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
              <Scale size={18} />
            </div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paino (kg) & BMI</label>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="number"
              step="0.1"
              className="text-2xl font-black text-slate-800 w-1/3 focus:outline-none bg-transparent"
              value={profile.weight}
              onChange={e => handleChange('weight', parseFloat(e.target.value) || 0)}
            />
            <div className="flex gap-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">BMI</span>
                <span className="text-sm font-black text-indigo-600">
                  {(profile.weight / (profile.height / 100 * profile.height / 100)).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">
                <TrendingUp size={12} className="mr-1" />
                <span className="text-[10px] font-bold">Trendi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
              <Ruler size={18} />
            </div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pituus (cm)</label>
          </div>
          <input
            type="number"
            className="text-2xl font-black text-slate-800 w-1/2 focus:outline-none bg-transparent"
            value={profile.height || 175}
            onChange={e => handleChange('height', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <Target size={18} />
            </div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktiivinen Tavoite</label>
          </div>
          <select
            className="w-full font-black text-slate-800 text-lg bg-slate-50 border-0 rounded-2xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all cursor-pointer"
            value={profile.goal}
            onChange={e => handleChange('goal', e.target.value as GoalType)}
          >
            {Object.values(GoalType).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
              <TrendingUp size={18} />
            </div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kuntotilastot</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Penkki (kg)</label>
              <input
                type="number"
                className="w-full bg-transparent border-0 font-black text-sm outline-none"
                value={profile.fitnessStats?.benchPressMax || ''}
                onChange={e => onUpdate({
                  ...profile,
                  fitnessStats: { ...(profile.fitnessStats || {}), benchPressMax: parseInt(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Kyykky (kg)</label>
              <input
                type="number"
                className="w-full bg-transparent border-0 font-black text-sm outline-none"
                value={profile.fitnessStats?.squatMax || ''}
                onChange={e => onUpdate({
                  ...profile,
                  fitnessStats: { ...(profile.fitnessStats || {}), squatMax: parseInt(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Mave (kg)</label>
              <input
                type="number"
                className="w-full bg-transparent border-0 font-black text-sm outline-none"
                value={profile.fitnessStats?.deadliftMax || ''}
                onChange={e => onUpdate({
                  ...profile,
                  fitnessStats: { ...(profile.fitnessStats || {}), deadliftMax: parseInt(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">5km aika</label>
              <input
                type="text"
                className="w-full bg-transparent border-0 font-black text-sm outline-none"
                value={profile.fitnessStats?.running5kmTime || ''}
                onChange={e => onUpdate({
                  ...profile,
                  fitnessStats: { ...(profile.fitnessStats || {}), running5kmTime: e.target.value }
                })}
                placeholder="esim. 25:00"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500">
              <Calendar size={18} />
            </div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Viikkotavoite</label>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-lg">{profile.targetWorkoutsPerWeek} treeniä</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg italic">Suositus: 3+</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={profile.targetWorkoutsPerWeek}
              onChange={e => handleChange('targetWorkoutsPerWeek', parseInt(e.target.value))}
            />
          </div>
        </div>

        {profile.aiStructuredFeedback?.technicalAnalysis && (
          <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw size={14} className="text-indigo-200" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">AI Kuntoanalyysi</p>
            </div>
            <p className="text-sm font-bold leading-relaxed opacity-90">
              {profile.aiStructuredFeedback.technicalAnalysis}
            </p>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <button
            onClick={onRefreshAI}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <RefreshCw size={20} className="animate-spin-slow" />
            PÄIVITÄ AI-ANALYYSI
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={16} />
            Tyhjennä sovelluksen tiedot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
