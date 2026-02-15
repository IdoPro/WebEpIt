
import React, { useState } from 'react';
import { GenerationResult, GeneratedFile, Language } from '../types';
import { UI_STRINGS } from '../constants';

interface CodeViewerProps {
  result?: GenerationResult | null;
  lang: Language;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ result, lang }) => {
  const t = UI_STRINGS[lang];

  if (!result || !result.files || result.files.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center h-[420px] border border-gray-200 p-8 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
        <div className="max-w-md">
          <h4 className="text-lg font-bold mb-2">{lang === 'he' ? 'אין תוצר עדיין' : 'No build result yet'}</h4>
          <p className="text-sm text-slate-500 mb-4">{lang === 'he' ? 'לא נמצא קובץ להציג. אנא חזור לשלב הקודם והפעל יצירה כדי לייצר את הקבצים.' : 'No files to display. Please go back and run the generation to produce files.'}</p>
        </div>
      </div>
    );
  }

  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(result.files[0]);

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[700px] border border-gray-200 ${lang === 'he' ? 'md:flex-row-reverse' : ''}`}>
      {/* Sidebar - File List */}
      <div className={`w-full md:w-64 bg-gray-50 border-gray-200 overflow-y-auto ${lang === 'he' ? 'border-l' : 'border-r'}`}>
        <div className={`p-4 border-b border-gray-200 font-semibold text-gray-700 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
          {t.projectFiles}
        </div>
        <div className="p-2">
          {result.files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm mb-1 transition-colors flex flex-col ${
                selectedFile.path === file.path 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200'
              } ${lang === 'he' ? 'text-right items-end' : 'text-left items-start'}`}
            >
              <span className="font-mono">{file.path.split('/').pop()}</span>
              <div className="text-[10px] opacity-60 truncate font-mono w-full">{file.path}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area - Code Editor (Always LTR) */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] dir-ltr overflow-hidden">
        <div className="px-6 py-3 bg-[#252526] text-gray-300 text-xs font-mono border-b border-[#333] flex justify-between items-center direction-ltr">
          <span className="font-mono">{selectedFile.path}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(selectedFile.content);
              alert(t.copied);
            }}
            className="hover:text-white bg-[#333] px-2 py-1 rounded transition-colors"
          >
            {t.copy}
          </button>
        </div>
        <pre className="p-6 overflow-auto text-sm font-mono text-indigo-300 leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 h-full text-left ltr">
          <code style={{ direction: 'ltr', display: 'block' }}>{selectedFile.content}</code>
        </pre>
      </div>

      {/* Deployment Instructions Panel */}
      <div className={`w-full md:w-80 bg-white border-gray-200 overflow-y-auto hidden lg:block ${lang === 'he' ? 'border-r' : 'border-l'}`}>
        <div className={`p-4 border-b border-gray-200 font-semibold text-gray-700 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
          {t.deployGuide}
        </div>
        <div className={`p-6 prose prose-sm ${lang === 'he' ? 'text-right' : 'text-left'}`}>
          <div className="whitespace-pre-wrap text-gray-600 text-sm mb-6">
            {result.instructions}
          </div>
          <div className="mt-8 pt-8 border-t">
            <h4 className="font-bold text-gray-900 mb-2">{t.nextSteps}</h4>
            <ul className="text-xs space-y-2 text-gray-500 list-none p-0">
              {t.nextStepsList.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
