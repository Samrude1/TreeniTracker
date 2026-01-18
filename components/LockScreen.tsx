import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface Props {
    onUnlock: () => void;
}

const LockScreen: React.FC<Props> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = (import.meta as any).env.VITE_APP_PASSWORD;

        // Jos salasanaa ei ole asetettu (kehitysympäristö), päästetään läpi
        if (!correctPassword || password === correctPassword) {
            sessionStorage.setItem('treenitrack_unlocked', 'true');
            onUnlock();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100 border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
                    <Lock className="text-white" size={32} />
                </div>

                <h1 className="text-2xl font-black text-slate-800 mb-2">Pääsy estetty</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Syötä salasana jatkaaksesi</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="••••"
                            autoFocus
                            className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-[0.5em] outline-none transition-all ${error ? 'border-red-500 bg-red-50 animate-shake' : 'border-transparent focus:border-indigo-600 focus:bg-white'
                                }`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 active:scale-95 transition-all shadow-lg"
                    >
                        AVAA SOVELLUS
                        <ArrowRight size={20} />
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4 animate-in fade-in slide-in-from-top-1">
                        Väärä salasana. Yritä uudelleen.
                    </p>
                )}
            </div>
        </div>
    );
};

export default LockScreen;
