
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, WorkoutSession, ChatThread, ChatMessage, TrainingProgram } from '../types';
import { generateChatResponse } from '../services/aiService';
import { MessageSquare, History as HistoryIcon, Plus, Send, Zap, User, Trash2 } from 'lucide-react';

interface Props {
  profile: UserProfile;
  workouts: WorkoutSession[];
  threads: ChatThread[];
  setThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  program: TrainingProgram | null;
  onProgramUpdate: (program: TrainingProgram) => void;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Simple markdown-lite formatter
  const lines = text.split('\n');
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-base font-black text-indigo-600 mt-4 mb-1 uppercase tracking-wider">{line.replace('### ', '')}</h3>;
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return <div key={i} className="flex gap-2 ml-1">
            <span className="text-indigo-400 font-bold">•</span>
            <span className="flex-1">{formatLine(line.trim().substring(2))}</span>
          </div>;
        }
        return <p key={i} className="leading-relaxed">{formatLine(line)}</p>;
      })}
    </div>
  );
};

const formatLine = (line: string) => {
  const parts = line.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-indigo-600 font-extrabold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const AIChat: React.FC<Props> = ({ profile, workouts, threads, setThreads, program, onProgramUpdate }) => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    threads.length > 0 ? threads[0].id : null
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages, isTyping]);

  const startNewThread = () => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: `Keskustelu ${new Date().toLocaleDateString('fi-FI')}`,
      date: new Date().toISOString(),
      messages: []
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newThread.id);
    setShowHistory(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isTyping) return;

    let targetThreadId = activeThreadId;
    if (!targetThreadId) {
      const newThread: ChatThread = {
        id: Date.now().toString(),
        title: currentInput.substring(0, 25) + '...',
        date: new Date().toISOString(),
        messages: []
      };
      setThreads([newThread, ...threads]);
      targetThreadId = newThread.id;
      setActiveThreadId(newThread.id);
    }

    const userMsg: ChatMessage = { role: 'user', text: currentInput };

    setThreads(prev => prev.map(t =>
      t.id === targetThreadId ? { ...t, messages: [...t.messages, userMsg] } : t
    ));

    setInput('');
    setIsTyping(true);

    try {
      let responseText = await generateChatResponse(
        profile,
        workouts,
        activeThread?.messages || [],
        currentInput,
        program
      );

      // Check for program update
      const updateMatch = responseText.match(/\[PROGRAM_UPDATE\]([\s\S]*?)\[\/PROGRAM_UPDATE\]/);
      if (updateMatch) {
        try {
          let jsonStr = updateMatch[1].trim();
          // Remove potential markdown code blocks that AI might accidentally include
          jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();

          const newProgram = JSON.parse(jsonStr);
          // Ensure mandatory fields exist or use fallback
          newProgram.id = newProgram.id || Date.now().toString();
          newProgram.createdAt = newProgram.createdAt || new Date().toISOString();
          onProgramUpdate(newProgram);

          // Remove the JSON block from text shown to user
          responseText = responseText.replace(/\[PROGRAM_UPDATE\][\s\S]*?\[\/PROGRAM_UPDATE\]/, '').trim();
          responseText += "\n\n✨ **Treeniohjelmasi on päivitetty!** Voit tarkistaa sen 'Ohjelma'-välilehdeltä.";
        } catch (e) {
          console.error("Failed to parse program update JSON", e);
          responseText += "\n\n⚠️ **Huom:** Valmentaja yritti päivittää ohjelmaasi, mutta tiedonsiirrossa tapahtui virhe. Kokeile pyytää päivitystä uudelleen ytimekkäämmin.";
        }
      }

      const aiMsg: ChatMessage = { role: 'model', text: responseText };

      setThreads(prev => prev.map(t =>
        t.id === targetThreadId ? { ...t, messages: [...t.messages, aiMsg] } : t
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-4 relative overflow-hidden border border-white/40 shadow-xl shadow-indigo-100/20">
      <div className="flex justify-between items-center mb-6 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none">AI Valmentaja</h2>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Aktiivinen</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-2xl transition-all duration-300 ${showHistory ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <HistoryIcon size={20} />
          </button>
          <button
            onClick={startNewThread}
            className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {showHistory ? (
        <div className="flex-grow overflow-y-auto space-y-3 px-2 animate-in slide-in-from-top-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Historia</h3>
          {threads.map(t => (
            <div key={t.id} className="relative group/item">
              <button
                onClick={() => { setActiveThreadId(t.id); setShowHistory(false); }}
                className={`w-full text-left p-4 rounded-[1.5rem] border-2 transition-all duration-300 pr-12 ${activeThreadId === t.id
                  ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50'
                  : 'bg-white/60 border-transparent hover:border-slate-200'
                  }`}
              >
                <p className="font-black text-slate-800 text-sm truncate">{t.title}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(t.date).toLocaleDateString('fi-FI')}</p>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Haluatko varmasti poistaa tämän keskustelun?')) {
                    const newThreads = threads.filter(thread => thread.id !== t.id);
                    setThreads(newThreads);
                    if (activeThreadId === t.id) {
                      setActiveThreadId(newThreads.length > 0 ? newThreads[0].id : null);
                    }
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover/item:opacity-100"
                title="Poista keskustelu"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {threads.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <MessageSquare size={48} className="mx-auto mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Ei historiaa</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto space-y-6 px-2 pr-4 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-indigo-200 transition-colors">
            {!activeThread?.messages.length && (
              <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200 rotate-12">
                  <Zap size={40} className="text-white fill-current" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-xl">Kuinka voin auttaa?</h3>
                <p className="text-sm font-medium text-slate-400 max-w-[240px] mx-auto mt-3 leading-relaxed">
                  Kysy vinkkejä treeniin, ravintoon tai pyydä päivän ohjelmaa.
                </p>
              </div>
            )}
            {activeThread?.messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}>
                <div className={`flex flex-col gap-1 max-w-[90%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 mb-1 opacity-40`}>
                    {msg.role === 'user' ? <User size={10} /> : <Zap size={10} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">{msg.role === 'user' ? 'Minä' : 'Valmentaja'}</span>
                  </div>
                  <div className={`px-5 py-4 rounded-[2rem] shadow-sm text-[15px] font-medium leading-relaxed ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-slate-100'
                    }`}>
                    {msg.role === 'user' ? msg.text : <FormattedText text={msg.text} />}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-6 py-4 rounded-[2rem] rounded-tl-none flex gap-1.5 items-center shadow-sm">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-6 pt-4 shrink-0 border-t border-slate-100 px-2">
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                placeholder="Kysy mitä vain..."
                className="w-full bg-slate-100 border-2 border-transparent rounded-[2rem] pl-6 pr-14 py-5 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400 shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`absolute right-2.5 top-2.5 bottom-2.5 w-12 flex items-center justify-center rounded-[1.5rem] transition-all ${input.trim() && !isTyping
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-0'
                  : 'bg-slate-200 text-slate-400 translate-x-2 opacity-0'
                  }`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChat;
