import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { Visit } from '../../App';
import { EvidenceChip } from '../ui/EvidenceChip';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { useState } from 'react';

interface CodingMDMProps {
  visit: Visit;
  onNext: () => void;
  onBack: () => void;
}

interface DiagnosisCode {
  id: string;
  code: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  status: 'accepted' | 'declined' | 'pending';
  isPrimary?: boolean;
}

export function CodingMDM({ visit, onNext, onBack }: CodingMDMProps) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisCode[]>([
    {
      id: '1',
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      confidence: 'high',
      status: 'accepted',
      isPrimary: true,
    },
    {
      id: '2',
      code: 'I10',
      description: 'Essential (primary) hypertension',
      confidence: 'high',
      status: 'accepted',
    },
    {
      id: '3',
      code: 'R42',
      description: 'Dizziness and giddiness',
      confidence: 'high',
      status: 'pending',
    },
    {
      id: '4',
      code: 'I95.1',
      description: 'Orthostatic hypotension',
      confidence: 'medium',
      status: 'pending',
    },
  ]);

  const [emLevel, setEmLevel] = useState<'99213' | '99214' | '99215'>('99214');

  const handleDiagnosisAction = (id: string, action: 'accepted' | 'declined') => {
    setDiagnoses(diagnoses.map(d => 
      d.id === id ? { ...d, status: action } : d
    ));
  };

  const acceptedDiagnoses = diagnoses.filter(d => d.status === 'accepted');

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Note</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Coding & Medical Decision Making</h1>
            <p className="text-sm text-gray-600 mt-1">
              Review suggested codes • Evidence-backed • Billing optimization
            </p>
          </div>

          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Orders
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ICD-10 Diagnoses */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">ICD-10 Diagnosis Codes</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {acceptedDiagnoses.length} accepted • {diagnoses.filter(d => d.status === 'pending').length} pending review
                  </p>
                </div>
                <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  + Add Diagnosis
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className={`p-4 ${
                  diagnosis.status === 'accepted' ? 'bg-green-50/30' :
                  diagnosis.status === 'declined' ? 'bg-gray-50 opacity-60' :
                  ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-sm font-mono font-semibold text-blue-900">
                          {diagnosis.code}
                        </span>
                        <ConfidenceBadge level={diagnosis.confidence} />
                        {diagnosis.isPrimary && (
                          <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-full text-xs font-medium text-purple-900">
                            Primary
                          </span>
                        )}
                        {diagnosis.status === 'accepted' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {diagnosis.status === 'declined' && (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2">{diagnosis.description}</h3>

                      <EvidenceChip 
                        evidence={[
                          {
                            type: 'transcript',
                            source: 'Patient statement',
                            timestamp: '00:01:05',
                            snippet: 'Patient reports symptoms consistent with this diagnosis...',
                          },
                          {
                            type: 'chart',
                            source: 'Active problem list',
                            snippet: 'Previously diagnosed and documented in chart',
                          },
                        ]}
                      />
                    </div>

                    {diagnosis.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDiagnosisAction(diagnosis.id, 'declined')}
                          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleDiagnosisAction(diagnosis.id, 'accepted')}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E/M Level Calculator */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Evaluation & Management (E/M) Level</h2>
              <p className="text-sm text-gray-600 mt-1">
                Based on MDM complexity and time spent
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['99213', '99214', '99215'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEmLevel(level as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      emLevel === level
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${
                        emLevel === level ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {level}
                      </div>
                      <div className="text-xs text-gray-600">
                        {level === '99213' && 'Low Complexity'}
                        {level === '99214' && 'Moderate Complexity'}
                        {level === '99215' && 'High Complexity'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {level === '99213' && '20-29 min'}
                        {level === '99214' && '30-39 min'}
                        {level === '99215' && '40-54 min'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  MDM Requirements for {emLevel}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Number and Complexity of Problems
                      </div>
                      <div className="text-sm text-gray-700 mt-0.5">
                        Multiple chronic illnesses (3 problems: E11.9, I10, R42) ✓
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Amount and Complexity of Data
                      </div>
                      <div className="text-sm text-gray-700 mt-0.5">
                        Reviewed independent historian, external records, and test results ✓
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Risk of Complications
                      </div>
                      <div className="text-sm text-gray-700 mt-0.5">
                        Prescription drug management, moderate risk ✓
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Time Documentation
                      </div>
                      <div className="text-sm text-gray-700 mt-0.5">
                        Consider documenting total time spent if using time-based coding
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1">
                        Add time statement to note
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Tip:</span> This visit qualifies for 99214 based on moderate MDM complexity. 
                    All three MDM elements are satisfied. Time-based coding option available if 30+ minutes documented.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CPT Codes */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CPT Procedure Codes</h3>
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">Licensed code set required.</span> Full CPT code library requires 
                  AMA licensing. Integrate with your billing system or EHR for complete CPT code selection.
                </p>
                <div className="bg-white border border-yellow-300 rounded-lg p-4">
                  <div className="text-sm text-gray-900 font-mono">
                    Suggested CPT: 99214 (Office/outpatient visit, est patient, 30-39 min)
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Placeholder - Connect to licensed CPT database for full code selection
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Primary Diagnosis</div>
                  <div className="text-sm text-gray-600">E11.9 - Type 2 diabetes mellitus</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Additional Diagnoses</div>
                  <div className="text-sm text-gray-600">
                    I10, {acceptedDiagnoses.filter(d => !d.isPrimary && d.status === 'accepted').map(d => d.code).join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <div className="font-medium text-gray-900">E/M Level</div>
                  <div className="text-sm text-gray-600">{emLevel} - Moderate Complexity</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Est. Reimbursement</div>
                  <div className="text-lg font-bold text-blue-900">$110-$135</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
