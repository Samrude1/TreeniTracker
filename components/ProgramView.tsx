import React, { useState } from 'react';
import { UserProfile, TrainingProgram, WeekDay, ProgramWorkout } from '../types';
import { generateTrainingProgram } from '../services/aiService';
import { Calendar, Sparkles, Dumbbell, ChevronRight, Clock, Info, MessageSquare } from 'lucide-react';

interface Props {
    program: TrainingProgram | null;
    onProgramGenerated: (program: TrainingProgram) => void;
    onNavigate: (view: 'chat' | 'add') => void;
}

const ProgramView: React.FC<Props> = ({ profile, program, onProgramGenerated, onNavigate }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const newProgram = await generateTrainingProgram(profile);
            onProgramGenerated(newProgram);
        } catch (error) {
            alert('Ohjelman generointi epäonnistui. Yritä uudelleen.');
        } finally {
            setIsGenerating(false);
        }
    };

    const dayLabels: Record<WeekDay, string> = {
        ma: 'Maanantai',
        ti: 'Tiistai',
        ke: 'Keskiviikko',
        to: 'Torstai',
        pe: 'Perjantai',
        la: 'Lauantai',
        su: 'Sunnuntai'
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                        <Calendar size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Treeniohjelma</h2>
                </div>
            </div>

            {!program ? (
                <div className="text-center py-12 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] px-6">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Ei aktiivista ohjelmaa</h3>
                    <p className="text-slate-400 text-sm font-bold mb-8 leading-relaxed">
                        Anna AI-valmentajan luoda sinulle optimaalinen treeniohjelma tavoitteesi mukaan.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                GENEROIDAAN...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                LUO AI-OHJELMA
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-indigo-200" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Nykyinen ohjelma</p>
                        </div>
                        <h3 className="text-2xl font-black mb-1">{program.name}</h3>
                        <p className="text-sm font-bold opacity-80 italic">{profile.goal}</p>

                        <div className="flex justify-between items-center gap-4">
                            <button
                                onClick={handleGenerate}
                                className="flex-1 mt-6 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2"
                                title="Generoi kokonaan uusi ohjelma AI:n avulla"
                            >
                                <Sparkles size={14} />
                                Generoi uusi
                            </button>
                            <button
                                onClick={() => onNavigate('chat')}
                                className="flex-1 mt-6 text-[10px] font-black uppercase tracking-widest bg-indigo-500 hover:bg-indigo-400 px-4 py-3 rounded-xl transition-all border border-indigo-400 flex items-center justify-center gap-2"
                            >
                                <MessageSquare size={14} />
                                Keskustele AI:lle
                            </button>
                        </div>
                        <p className="text-[9px] opacity-60 mt-3 italic text-center text-indigo-100">
                            Haluatko muuttaa ohjelmaa? Keskustele AI-valmentajan kanssa muutostoiveistasi.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Viikkoaikaulu</h4>
                        {program.workouts.map((workout, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm group">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                            {dayLabels[workout.dayOfWeek]}
                                        </span>
                                        <h5 className="text-lg font-black text-slate-800 mt-2">{workout.name}</h5>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('add')}
                                        className="w-12 h-12 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 transition-all active:scale-95 group/btn"
                                        title="Aloita tämä treeni"
                                    >
                                        <Dumbbell size={24} className="group-hover/btn:rotate-12 transition-transform" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mb-4 flex items-center gap-1.5">
                                    <Clock size={10} /> Napauta käsipainoa kirjataksesi treenin
                                </p>

                                <div className="space-y-3">
                                    {workout.exercises.map((ex, exIdx) => (
                                        <div key={exIdx} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl group/ex border border-transparent hover:border-indigo-100 transition-all">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-slate-700">{ex.name}</span>
                                                <div className="flex gap-2">
                                                    {ex.targetSets && (
                                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                                            {ex.targetSets}s
                                                        </span>
                                                    )}
                                                    {ex.targetReps && (
                                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                            {ex.targetReps} toistoa
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {ex.notes && (
                                                <div className="flex items-start gap-1.5 mt-1 border-t border-slate-200 pt-2 opacity-60">
                                                    <Info size={10} className="mt-0.5" />
                                                    <p className="text-[10px] font-bold leading-tight italic">{ex.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramView;
