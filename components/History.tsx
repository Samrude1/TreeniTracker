
import React from 'react';
import { WorkoutSession } from '../types';
import { History as HistoryIcon, Trash2, Calendar, Dumbbell, ChevronRight, Zap, Utensils } from 'lucide-react';

interface Props {
  workouts: WorkoutSession[];
  onDelete: (id: string) => void;
}

const History: React.FC<Props> = ({ workouts, onDelete }) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
          <HistoryIcon size={20} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Treenihistoria</h2>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
          <Dumbbell className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold">Ei vielä tallennettuja treenejä.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map(workout => (
            <div key={workout.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{workout.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <Calendar size={12} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {new Date(workout.date).toLocaleDateString('fi-FI', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Haluatko varmasti poistaa tämän treenin?')) {
                      onDelete(workout.id);
                    }
                  }}
                  className="bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all active:scale-95"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3 bg-slate-50 rounded-2xl p-4">
                {workout.exercises.map((ex, idx) => (
                  <div key={idx} className="flex justify-between items-center group/ex">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                      <span className="text-xs font-bold text-slate-600">{ex.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {ex.type === 'strength' ? (
                        <>
                          <span className="text-xs font-black text-indigo-600">
                            {ex.sets} × {ex.reps}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {ex.weight}kg
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-black text-indigo-600">
                            {ex.duration} min
                          </span>
                          {ex.distance !== undefined && ex.distance > 0 && (
                            <span className="text-[10px] font-bold text-slate-400">
                              {ex.distance}km
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {(workout.calories || workout.protein) && (
                <div className="flex gap-4 mt-4 px-1">
                  {workout.calories && (
                    <div className="flex items-center gap-1.5">
                      <Zap size={10} className="text-orange-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{workout.calories} kcal</span>
                    </div>
                  )}
                  {workout.protein && (
                    <div className="flex items-center gap-1.5">
                      <Utensils size={10} className="text-emerald-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{workout.protein}g prot</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
