import React from 'react';
import { ModelType } from '../types';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelect: (model: ModelType) => void;
  disabled: boolean;
  texts: any;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect, disabled, texts }) => {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-400">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        {texts.title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flash Option */}
        <div 
          onClick={() => !disabled && onSelect('gemini-2.5-flash')}
          className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 
            ${selectedModel === 'gemini-2.5-flash' 
              ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-900/20' 
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">
                {texts.flash.name}
                <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase">{texts.flash.tag}</span>
              </h4>
              <p className="text-slate-400 text-xs mt-1">{texts.flash.desc}</p>
            </div>
            {selectedModel === 'gemini-2.5-flash' && (
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1"><span className="text-indigo-400">⚡</span> {texts.flash.speed}</span>
            <span className="flex items-center gap-1"><span className="text-green-400">$</span> {texts.flash.cost}</span>
          </div>
        </div>

        {/* Pro Option */}
        <div 
          onClick={() => !disabled && onSelect('gemini-3-pro-preview')}
          className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 
            ${selectedModel === 'gemini-3-pro-preview' 
              ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-900/20' 
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">
                {texts.pro.name}
                <span className="bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full uppercase">{texts.pro.tag}</span>
              </h4>
              <p className="text-slate-400 text-xs mt-1">{texts.pro.desc}</p>
            </div>
            {selectedModel === 'gemini-3-pro-preview' && (
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1"><span className="text-yellow-400">🧠</span> {texts.pro.iq}</span>
            <span className="flex items-center gap-1"><span className="text-red-400">$$$</span> {texts.pro.cost}</span>
          </div>
        </div>
      </div>

      {/* Pricing Comparison Table */}
      <div className="mt-4 bg-slate-900/50 rounded-lg p-3 border border-slate-800">
        <div className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-wider">{texts.pricing.title}</div>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-1">{texts.pricing.headers[0]}</th>
              <th className="py-1 text-indigo-400">{texts.pricing.headers[1]}</th>
              <th className="py-1 text-purple-400">{texts.pricing.headers[2]}</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            <tr className="border-b border-slate-800/50">
              <td className="py-1.5 font-medium text-slate-500">{texts.pricing.input}</td>
              <td className="py-1.5">~USD $0.075 <span className="text-slate-500">{texts.pricing.free}</span></td>
              <td className="py-1.5">~USD $1.25+</td>
            </tr>
            <tr>
              <td className="py-1.5 font-medium text-slate-500">{texts.pricing.output}</td>
              <td className="py-1.5">~USD $0.30</td>
              <td className="py-1.5">~USD $5.00+</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 text-[10px] text-slate-600 text-right">
          {texts.pricing.disclaimer}
        </div>
      </div>
    </div>
  );
};