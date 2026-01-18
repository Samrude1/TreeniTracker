import React from 'react';
import { WorkoutSession, WeekDay } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
    workouts: WorkoutSession[];
}

const WEEK_DAYS: { key: WeekDay; label: string }[] = [
    { key: 'ma', label: 'Ma' },
    { key: 'ti', label: 'Ti' },
    { key: 'ke', label: 'Ke' },
    { key: 'to', label: 'To' },
    { key: 'pe', label: 'Pe' },
    { key: 'la', label: 'La' },
    { key: 'su', label: 'Su' }
];

const WeekCalendar: React.FC<Props> = ({ workouts }) => {
    const now = new Date();

    // Get start of current week (Monday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const getWorkoutsForDay = (dayIndex: number) => {
        const targetDate = new Date(startOfWeek);
        targetDate.setDate(startOfWeek.getDate() + dayIndex);

        return workouts.filter(w => {
            const workoutDate = new Date(w.date);
            return workoutDate.getFullYear() === targetDate.getFullYear() &&
                workoutDate.getMonth() === targetDate.getMonth() &&
                workoutDate.getDate() === targetDate.getDate();
        });
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Viikon aktiivisuus</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    Vko {Math.ceil((now.getDate() + 6 - (now.getDay() || 7)) / 7) + 1}
                </span>
            </div>

            <div className="flex justify-between items-center gap-1">
                {WEEK_DAYS.map((day, index) => {
                    const dayWorkouts = getWorkoutsForDay(index);
                    const hasWorkout = dayWorkouts.length > 0;
                    const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1);

                    return (
                        <div key={day.key} className="flex flex-col items-center gap-2 flex-1">
                            <span className={`text-[10px] font-black uppercase ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                                {day.label}
                            </span>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 scale-100 ${hasWorkout
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 rotate-0'
                                : isToday
                                    ? 'bg-indigo-50 text-indigo-300 border-2 border-dashed border-indigo-200'
                                    : 'bg-slate-50 text-slate-200 border border-slate-100'
                                }`}>
                                {hasWorkout ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <Circle size={16} strokeWidth={3} className="opacity-20" />
                                )}
                            </div>
                            {hasWorkout && (
                                <div className="flex gap-0.5">
                                    {dayWorkouts.map((_, i) => (
                                        <div key={i} className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekCalendar;
