
import React from 'react';
import { View } from '../types';
import { Home, History as HistoryIcon, PlusCircle, MessageSquare, User, ClipboardList } from 'lucide-react';

interface Props {
  currentView: View;
  setView: (view: View) => void;
}

const Navigation: React.FC<Props> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard' as View, label: 'Koti', icon: Home },
    { id: 'history' as View, label: 'Historia', icon: HistoryIcon },
    { id: 'add' as View, label: 'Lisää', icon: PlusCircle },
    { id: 'program' as View, label: 'Ohjelma', icon: ClipboardList },
    { id: 'chat' as View, label: 'Chat', icon: MessageSquare },
    { id: 'profile' as View, label: 'Profiili', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center h-20 px-4 z-50">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          className={`flex flex-col items-center justify-center w-full h-full relative group transition-all ${currentView === id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentView === id ? 'bg-indigo-50' : 'group-hover:bg-slate-50'
            }`}>
            <Icon size={24} strokeWidth={currentView === id ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-bold mt-1 transition-all ${currentView === id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
            }`}>
            {label}
          </span>
          {currentView === id && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-600 rounded-b-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
