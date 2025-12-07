import React, { useState, useMemo, useEffect } from 'react';
import { BatchItem } from '../types';

interface ResultDisplayProps {
  items: BatchItem[];
  onReset: () => void;
  texts: any;
}

interface ParsedLine {
  id: number;
  type: 'kv' | 'text';
  label?: string;
  value: string;
  original: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ items, onReset, texts }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [globalCopied, setGlobalCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'raw'>('list');

  const selectedItem = items[selectedIndex];

  // Auto-select the first item if nothing is selected or index out of bounds
  useEffect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
  }, [items.length, selectedIndex]);

  // Parse text into structured lines for the "List" view
  const parsedLines: ParsedLine[] = useMemo(() => {
    if (!selectedItem?.result) return [];
    
    return selectedItem.result.split('\n')
      .filter(line => line.trim().length > 0)
      .map((line, index) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0 && colonIndex < line.length - 1) {
          return {
            id: index,
            type: 'kv',
            label: line.substring(0, colonIndex).trim(),
            value: line.substring(colonIndex + 1).trim(),
            original: line
          };
        }
        return { id: index, type: 'text', value: line.trim(), original: line };
      });
  }, [selectedItem?.result]);

  const handleCopyAll = async () => {
    try {
      const allText = items
        .filter(item => item.status === 'success' && item.result)
        .map(item => `--- ${item.file.name} ---\n${item.result}`)
        .join('\n\n');
        
      await navigator.clipboard.writeText(allText);
      setGlobalCopied(true);
      setTimeout(() => setGlobalCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-[700px]">
      
      {/* Sidebar: File List */}
      <div className="lg:col-span-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {texts.fileList} ({items.filter(i => i.status === 'success').length}/{items.length})
          </h3>
          <button onClick={onReset} className="text-xs text-slate-400 hover:text-white px-2 py-1 hover:bg-slate-700 rounded">
            {texts.reupload}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {items.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                selectedIndex === idx 
                  ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-500/30' 
                  : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/60'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-slate-900 flex-shrink-0 overflow-hidden relative border border-slate-700/50">
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover opacity-80" onError={(e) => {
                    // Fallback for HEIC or broken images
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-[10px] text-slate-500">IMG</span>';
                }}/>
                {/* Status Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {item.status === 'processing' && <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>}
                  {item.status === 'success' && <div className="text-green-400">✓</div>}
                  {item.status === 'error' && <div className="text-red-400">!</div>}
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${selectedIndex === idx ? 'text-white' : 'text-slate-300'}`}>
                  {item.file.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                   {item.status === 'pending' && texts.waiting}
                   {item.status === 'processing' && texts.processing}
                   {item.status === 'success' && texts.done}
                   {item.status === 'error' && texts.error}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bulk Action Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
           <button
              onClick={handleCopyAll}
              className={`w-full flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 
                ${globalCopied 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                }`}
            >
              {globalCopied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                     <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {texts.copiedAll}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
                  {texts.copyAll} ({items.filter(i => i.status === 'success').length})
                </>
              )}
            </button>
        </div>
      </div>

      {/* Main Content: Result Detail */}
      <div className="lg:col-span-8 flex flex-col h-full gap-4">
        {selectedItem ? (
          <>
             {/* Header */}
             <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
               <div className="flex items-center gap-2">
                 <span className="text-sm font-semibold text-slate-200 truncate max-w-[200px]">{selectedItem.file.name}</span>
                 {selectedItem.status === 'error' && <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Error</span>}
               </div>
               
               <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
                  <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>{texts.listMode}</button>
                  <button onClick={() => setViewMode('raw')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'raw' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>{texts.rawMode}</button>
                </div>
             </div>

             {/* Content Split */}
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
               {/* Preview Image */}
               <div className="bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden relative flex items-center justify-center p-2">
                 <img 
                    src={selectedItem.previewUrl} 
                    alt="Current" 
                    className="max-w-full max-h-full object-contain" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<div class="text-center"><span class="text-4xl">🖼️</span><p class="text-slate-500 mt-2 text-sm">${texts.previewError}<br/>(HEIC/Format)</p></div>`;
                    }}
                  />
               </div>
               
               {/* Text Result */}
               <div className="bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col relative">
                  {selectedItem.status === 'processing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm text-indigo-300">{texts.processing}</p>
                    </div>
                  )}
                  
                  {selectedItem.status === 'error' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-red-400 text-sm mb-2 font-bold">{texts.error}</p>
                        <p className="text-slate-500 text-xs">{selectedItem.error}</p>
                     </div>
                  )}

                  {selectedItem.status === 'success' && selectedItem.result && (
                    viewMode === 'raw' ? (
                      <textarea
                        readOnly
                        className="w-full h-full bg-transparent p-4 text-sm font-mono text-slate-300 resize-none focus:outline-none leading-relaxed"
                        value={selectedItem.result}
                      />
                    ) : (
                      <div className="flex-1 overflow-y-auto p-3 space-y-2">
                         {parsedLines.length === 0 && <div className="text-center text-slate-500 py-10 text-sm">{texts.noText}</div>}
                         {parsedLines.map((line) => <CopyableRow key={line.id} item={line} />)}
                      </div>
                    )
                  )}
               </div>
             </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            {texts.selectPrompt}
          </div>
        )}
      </div>
    </div>
  );
};

const CopyableRow: React.FC<{ item: ParsedLine }> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-slate-800/40 hover:bg-slate-700/40 border border-slate-700/50 hover:border-indigo-500/30 rounded-lg p-3 transition-all flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0 flex flex-col">
        {item.type === 'kv' && item.label && (
          <span className="text-[10px] uppercase font-bold text-indigo-400 mb-0.5 tracking-wider truncate">
            {item.label}
          </span>
        )}
        <span className={`font-mono text-sm truncate select-all ${item.type === 'kv' ? 'text-white font-medium' : 'text-slate-300'}`}>
          {item.value}
        </span>
      </div>
      
      <button
        onClick={handleCopy}
        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors border ${
          copied 
            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
            : 'bg-slate-700 border-slate-600 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white'
        }`}
      >
        {copied ? (
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>
        )}
      </button>
    </div>
  );
};