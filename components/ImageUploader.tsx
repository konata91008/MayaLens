import React, { useCallback, useState } from 'react';
import { LIMITS } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  isLoading: boolean;
  texts: any;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected, isLoading, texts }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  }, [isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndProcessFiles = (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    let totalSize = 0;
    const errors: string[] = [];

    Array.from(fileList).forEach(file => {
      // Check individual file size (30MB)
      if (file.size > LIMITS.MAX_FILE_SIZE) {
        errors.push(`${file.name} ${texts.errorSize}`);
        return;
      }

      // Check mime types (Images + HEIC)
      if (!file.type.startsWith('image/') && file.type !== '') { 
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'heic' && ext !== 'heif') {
           errors.push(`${file.name} ${texts.errorType}`);
           return;
        }
      }

      totalSize += file.size;
      validFiles.push(file);
    });

    // Check total size (500MB)
    if (totalSize > LIMITS.MAX_TOTAL_SIZE) {
      alert(`${texts.errorTotal} ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      return;
    }

    if (errors.length > 0) {
      alert(`${texts.errorPartial}\n${errors.join('\n')}`);
    }

    if (validFiles.length > 0) {
      onImagesSelected(validFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  }, [isLoading, texts]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
    e.target.value = '';
  }, [isLoading, texts]);

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out cursor-pointer
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
          : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-800/50'
        }
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp, image/heic, image/heif" 
        multiple
        onChange={handleFileInput} 
      />
      
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isDragging ? 'bg-indigo-600' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{texts.title}</h3>
          <p className="text-slate-400 mt-1 text-sm">{texts.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">JPG/PNG/WebP</span>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">HEIC/HEIF</span>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{texts.limit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};