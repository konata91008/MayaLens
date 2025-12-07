import React from 'react';

interface SecurityWarningProps {
  texts: any;
}

export const SecurityWarning: React.FC<SecurityWarningProps> = ({ texts }) => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      <div>
        <h4 className="text-sm font-bold text-amber-500">{texts.title}</h4>
        <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
          {texts.content}
        </p>
      </div>
    </div>
  );
};