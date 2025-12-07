import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { SecurityWarning } from './components/SecurityWarning';
import { ModelSelector } from './components/ModelSelector';
import { extractTextFromImage } from './services/geminiService';
import { AppState, ModelType, BatchItem, Language } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-2.5-flash');
  const [batchQueue, setBatchQueue] = useState<BatchItem[]>([]);
  const [lang, setLang] = useState<Language>('zh-TW');

  // Current translation object
  const t = translations[lang];
  
  // Calculate if any processing is active
  const isProcessing = batchQueue.some(item => item.status === 'processing' || item.status === 'pending');

  // Logic to process the queue automatically
  useEffect(() => {
    const processQueue = async () => {
      // Find the next pending item
      const nextItemIndex = batchQueue.findIndex(item => item.status === 'pending');
      
      // If no pending items, update global state
      if (nextItemIndex === -1) {
        if (batchQueue.length > 0 && appState === AppState.PROCESSING) {
           setAppState(AppState.SUCCESS);
        }
        return;
      }

      // Update item to processing state
      setBatchQueue(prev => {
        const newQueue = [...prev];
        newQueue[nextItemIndex] = { ...newQueue[nextItemIndex], status: 'processing' };
        return newQueue;
      });

      const currentItem = batchQueue[nextItemIndex];

      try {
        const text = await extractTextFromImage(currentItem.base64, currentItem.mimeType, selectedModel);
        
        // Update to success
        setBatchQueue(prev => {
          const newQueue = [...prev];
          newQueue[nextItemIndex] = { 
            ...newQueue[nextItemIndex], 
            status: 'success', 
            result: text 
          };
          return newQueue;
        });

      } catch (error: any) {
        // Update to error
        setBatchQueue(prev => {
          const newQueue = [...prev];
          newQueue[nextItemIndex] = { 
            ...newQueue[nextItemIndex], 
            status: 'error', 
            error: error.message || 'Unknown error' 
          };
          return newQueue;
        });
      }
    };

    if (appState === AppState.PROCESSING && !batchQueue.some(i => i.status === 'processing')) {
      processQueue();
    }
  }, [batchQueue, appState, selectedModel]);

  const handleImagesSelected = async (files: File[]) => {
    setAppState(AppState.PROCESSING);
    
    // Create new batch items
    const newItems: BatchItem[] = await Promise.all(files.map(async (file) => {
      return new Promise<BatchItem>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Extract base64 content and mime type
          // Note: For HEIC, browser might treat mime as empty or image/heic. Gemini accepts image/heic.
          let mimeType = result.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || file.type;
          
          // Fallback for HEIC if mime detection fails or browser sets generic application/octet-stream
          const ext = file.name.split('.').pop()?.toLowerCase();
          if ((ext === 'heic' || ext === 'heif') && (!mimeType || mimeType === 'application/octet-stream')) {
             mimeType = 'image/heic';
          }
          if (!mimeType) mimeType = 'image/jpeg'; // Ultimate fallback

          const base64Data = result.split(',')[1];
          
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            previewUrl: result, // For HEIC this might not render in img tag, handled in UI
            base64: base64Data,
            mimeType: mimeType,
            status: 'pending'
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    setBatchQueue(newItems);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setBatchQueue([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-200 pb-20 selection:bg-violet-500/30">
      <Header lang={lang} setLang={setLang} texts={t.header} />

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Maya Lens
            </span> 
            <span className="ml-3 text-slate-200">{t.app.titleSuffix}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t.app.description}
          </p>
        </div>

        <SecurityWarning texts={t.security} />

        {appState === AppState.IDLE && (
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <ModelSelector 
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
              disabled={false}
              texts={t.model}
            />

            <ImageUploader 
              onImagesSelected={handleImagesSelected} 
              isLoading={false} 
              texts={t.uploader}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <FeatureCard 
                icon="📚" 
                title={t.app.batchTitle}
                desc={t.app.batchDesc} 
              />
              <FeatureCard 
                icon="🍏" 
                title={t.app.formatTitle} 
                desc={t.app.formatDesc} 
              />
              <FeatureCard 
                icon="🚀" 
                title={t.app.sizeTitle} 
                desc={t.app.sizeDesc} 
              />
            </div>
          </div>
        )}

        {appState !== AppState.IDLE && (
          <div className="space-y-6">
            {/* Progress Bar if processing */}
            {isProcessing && (
              <div className="max-w-xl mx-auto mb-8">
                 <div className="flex justify-between text-xs text-slate-400 mb-2">
                   <span>{t.app.progress}</span>
                   <span>
                     {batchQueue.filter(i => i.status === 'success' || i.status === 'error').length} / {batchQueue.length}
                   </span>
                 </div>
                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 ease-out"
                     style={{ width: `${(batchQueue.filter(i => i.status === 'success' || i.status === 'error').length / batchQueue.length) * 100}%` }}
                   ></div>
                 </div>
              </div>
            )}

            <ResultDisplay 
              items={batchQueue} 
              onReset={handleReset} 
              texts={t.result}
            />
          </div>
        )}
      </main>
    </div>
  );
};

const FeatureCard: React.FC<{icon: string, title: string, desc: string}> = ({icon, title, desc}) => (
  <div className="group bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-violet-500/30 transition-all duration-300">
    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default App;