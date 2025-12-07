import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  texts: any;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, texts }) => {
  const isApiKeyReady = !!process.env.API_KEY;

  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Maya</span>
                <span>Lens</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5">v1.0</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{texts.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Selector */}
          <div className="relative group">
             <select 
               value={lang}
               onChange={(e) => setLang(e.target.value as Language)}
               className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer hover:bg-slate-700 transition-colors"
             >
               <option value="zh-TW">繁體中文</option>
               <option value="en">English</option>
               <option value="ja">日本語</option>
               <option value="ko">한국어</option>
             </select>
             <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500">
                 <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
               </svg>
             </div>
          </div>

          {/* Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
            isApiKeyReady 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="relative flex h-2 w-2">
              {isApiKeyReady && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isApiKeyReady ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <span className="text-xs font-mono font-medium hidden sm:inline-block">
              {isApiKeyReady ? texts.statusReady : texts.statusError}
            </span>
             <span className="text-xs font-mono font-medium sm:hidden">
              {isApiKeyReady ? texts.statusReadyShort : texts.statusErrorShort}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};