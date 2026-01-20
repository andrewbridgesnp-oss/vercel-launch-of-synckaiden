import { Clock, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export interface Evidence {
  type: 'transcript' | 'chart' | 'guideline';
  source: string;
  timestamp?: string;
  snippet: string;
}

interface EvidenceChipProps {
  evidence: Evidence[];
  label?: string;
}

export function EvidenceChip({ evidence, label = 'Evidence' }: EvidenceChipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-full text-xs font-medium text-blue-900 transition-colors"
      >
        <span>{label}</span>
        <span className="bg-blue-200 rounded-full px-1.5">{evidence.length}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 top-full mt-2 left-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-3 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-900">Evidence Sources</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {evidence.length} reference{evidence.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {evidence.map((item, idx) => (
                <div key={idx} className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2 mb-2">
                    {item.type === 'transcript' && <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />}
                    {item.type === 'chart' && <FileText className="w-4 h-4 text-green-600 mt-0.5" />}
                    {item.type === 'guideline' && <FileText className="w-4 h-4 text-purple-600 mt-0.5" />}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${
                          item.type === 'transcript' ? 'text-blue-700' :
                          item.type === 'chart' ? 'text-green-700' :
                          'text-purple-700'
                        }`}>
                          {item.type === 'transcript' ? 'Transcript' : 
                           item.type === 'chart' ? 'Chart' : 'Guideline'}
                        </span>
                        {item.timestamp && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {item.timestamp}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-1 font-medium">
                        {item.source}
                      </div>
                      <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                        "{item.snippet}"
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
