
import React, { useMemo } from 'react';
import { UserProfile, WorkoutSession } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, YAxis } from 'recharts';
import { Target, Weight, TrendingUp, Calendar, Zap, Clock } from 'lucide-react';
import WeekCalendar from './WeekCalendar';

interface Props {
  profile: UserProfile;
  workouts: WorkoutSession[];
}

const Dashboard: React.FC<Props> = ({ profile, workouts }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= startOfWeek);

    const chartData = [...workouts].reverse().slice(-7).map(w => {
      const volume = w.exercises.reduce((sum, ex) => {
        if (ex.type === 'strength') {
          return sum + ((ex.weight || 0) * (ex.sets || 0) * (ex.reps || 0)) / 100;
        } else {
          return sum + (ex.duration || 0); // Add duration as volume for cardio/other
        }
      }, 0);
      return {
        name: new Date(w.date).toLocaleDateString('fi-FI', { weekday: 'short' }),
        volume: Math.round(volume)
      };
    });

    const weightData = (profile.weightHistory || []).slice(-7).map(entry => ({
      name: new Date(entry.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
      weight: entry.weight
    }));

    // If no history, add current weight as a single point
    if (weightData.length === 0) {
      weightData.push({
        name: 'Nyt',
        weight: profile.weight
      });
    }

    return {
      weeklyCount: weeklyWorkouts.length,
      progress: Math.min(100, (weeklyWorkouts.length / profile.targetWorkoutsPerWeek) * 100),
      chartData,
      weightData
    };
  }, [workouts, profile]);

  return (
    <div className="space-y-6 pb-6">
      {/* AI Trainer Section - Proactive & Visual */}
      <section className="bg-indigo-600 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden text-white border border-indigo-500 shadow-indigo-200">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Valmentaja On-Line</h3>
              </div>
              <h2 className="text-lg font-black tracking-tight">Päivän Analyysi</h2>
            </div>
          </div>

          <p className="text-sm font-semibold leading-relaxed opacity-95">
            {profile.aiStructuredFeedback?.analysis || profile.aiTrainerNote || "Odotan ensimmäistä treeniäsi. Kirjaa se ylös, niin analysoin suorituksesi ja ravintosi välittömästi!"}
          </p>

          {(profile.aiStructuredFeedback) && (
            <div className="flex flex-col gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-indigo-200" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100">Treenivinkki</span>
                </div>
                <p className="text-[13px] font-bold leading-relaxed">{profile.aiStructuredFeedback.workoutTip}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-indigo-200" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100">Ravintovinkki</span>
                </div>
                <p className="text-[13px] font-bold leading-relaxed">{profile.aiStructuredFeedback.nutritionTip}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-indigo-600" size={16} />
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Viikkovolyymi</h2>
            </div>
            <p className="text-4xl font-black text-slate-800 mt-1">{stats.weeklyCount} / <span className="text-indigo-600">{profile.targetWorkoutsPerWeek}</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Treeniä suoritettu</p>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#f8fafc" strokeWidth="10" fill="transparent" />
              <circle
                cx="48" cy="48" r="40"
                stroke="#4f46e5" strokeWidth="10"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - stats.progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-indigo-600">
              {Math.round(stats.progress)}%
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] shadow-sm group hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-indigo-600" size={14} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Tavoite</p>
          </div>
          <p className="text-sm font-black text-slate-800 mt-1">{profile.goal}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] shadow-sm group hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Weight className="text-indigo-600" size={14} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Paino</p>
          </div>
          <p className="text-sm font-black text-slate-800 mt-1">{profile.weight.toLocaleString('fi-FI', { minimumFractionDigits: 1 })} kg</p>
        </div>
      </div>

      <WeekCalendar workouts={workouts} />

      {/* Charts Section */}
      <div className="space-y-4">
        <section className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <TrendingUp className="text-indigo-600" size={18} />
            Kehityksen Volyymi
          </h3>
          <div className="h-48 w-full min-h-[192px]">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="volume" radius={[6, 6, 6, 6]} barSize={24}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === stats.chartData.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center px-8 border-2 border-dashed border-slate-100 rounded-3xl italic">
                Lisää ensimmäinen treenisi nähdäksesi volyymikäyrän.
              </div>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Weight className="text-indigo-600" size={18} />
            Painon seuranta
          </h3>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weightData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
