import { ArrowLeft, Edit3, Mic, CheckCircle, AlertTriangle } from 'lucide-react';
import { Visit } from '../../App';
import { EvidenceChip } from '../ui/EvidenceChip';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { useState } from 'react';

interface DraftNoteProps {
  visit: Visit;
  onNext: () => void;
  onBack: () => void;
}

interface NoteSection {
  id: string;
  title: string;
  content: string;
  confidence: 'high' | 'medium' | 'low';
  hasEvidence: boolean;
  lowConfidenceSegments?: Array<{ text: string; start: number; end: number }>;
}

export function DraftNote({ visit, onNext, onBack }: DraftNoteProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sections, setSections] = useState<NoteSection[]>([
    {
      id: 'hpi',
      title: 'History of Present Illness',
      confidence: 'high',
      hasEvidence: true,
      content: `Patient presents for routine follow-up of chronic conditions and medication refills. She reports overall stability with her current regimen of Metformin 1000mg BID and Lisinopril 10mg daily. Blood glucose control has improved with reported dietary adherence. Patient denies chest pain, shortness of breath, or palpitations.\n\nOf note, patient reports experiencing dizziness upon standing, occurring 2-3 times weekly. Episodes are brief, lasting only a few seconds, and resolve spontaneously. No associated falls or loss of consciousness. Symptoms have been present for approximately 2 weeks.`,
    },
    {
      id: 'ros',
      title: 'Review of Systems',
      confidence: 'high',
      hasEvidence: true,
      content: `Constitutional: Denies fever, chills, weight loss\nCardiovascular: Reports positional dizziness as above, denies chest pain, palpitations, or edema\nRespiratory: Denies cough, shortness of breath, or wheezing\nGI: Denies nausea, vomiting, diarrhea, or abdominal pain\nEndocrine: Reports improved glucose control\nNeurologic: Denies headache, weakness, or numbness\nAll other systems reviewed and negative`,
    },
    {
      id: 'pe',
      title: 'Physical Exam (Telehealth)',
      confidence: 'medium',
      hasEvidence: false,
      content: `General: Alert and oriented, appears well, in no acute distress\nVital Signs: Per patient home monitoring - BP 128/76, HR 72\nCardiovascular: Regular rate and rhythm appreciated via audio, no audible murmurs\nRespiratory: Respirations even and unlabored, clear to auscultation bilaterally\nSkin: No visible rashes or lesions noted\n\nNote: Physical examination limited by telehealth modality. Orthostatic vital signs unable to be assessed virtually.`,
      lowConfidenceSegments: [
        { text: 'Orthostatic vital signs unable to be assessed virtually', start: 312, end: 368 },
      ],
    },
    {
      id: 'mdm',
      title: 'Medical Decision Making',
      confidence: 'high',
      hasEvidence: true,
      content: `Number and Complexity of Problems:\n- Type 2 Diabetes Mellitus - stable, controlled (chronic, stable)\n- Essential Hypertension - stable, controlled (chronic, stable)\n- Orthostatic hypotension, probable (new problem, additional workup needed)\n\nAmount and Complexity of Data:\n- Reviewed recent lab results: A1C 6.8% (improved from 7.2%), lipid panel within normal limits, TSH 2.1 (normal)\n- Reviewed home BP log showing consistent control\n\nRisk of Complications:\n- Prescription drug management (moderate risk)\n- Potential for falls secondary to dizziness (moderate risk)\n\nTotal MDM Level: Moderate Complexity`,
    },
    {
      id: 'assessment',
      title: 'Assessment & Plan',
      confidence: 'high',
      hasEvidence: true,
      content: `1. Type 2 Diabetes Mellitus (E11.9) - Stable\n   - Continue Metformin 1000mg BID\n   - A1C improved to 6.8%, excellent progress\n   - Patient adherent to diet modifications\n   - Refill provided for 90 days\n   - Next A1C in 3 months\n\n2. Essential Hypertension (I10) - Stable\n   - Continue Lisinopril 10mg daily\n   - Home BP readings within goal range\n   - Refill provided for 90 days\n\n3. Dizziness and Giddiness (R42) - New\n   - Likely orthostatic hypotension, possibly related to Lisinopril\n   - Discussed adequate hydration and slow position changes\n   - Patient to check orthostatic BP at home or pharmacy\n   - If symptoms persist or worsen, consider dose adjustment\n   - Follow-up in 2 weeks or sooner if needed\n\n4. Health Maintenance\n   - Labs reviewed and discussed: all within normal limits\n   - Preventive care up to date\n   - Annual wellness visit due in 3 months\n\nPatient verbalized understanding of plan and agreed to follow-up as scheduled.`,
    },
  ]);

  const handleEditSection = (sectionId: string, newContent: string) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, content: newContent } : s
    ));
  };

  const allHighConfidence = sections.every(s => s.confidence === 'high');

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
              <span className="text-sm">Back to Visit</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Draft Clinical Note</h1>
            <p className="text-sm text-gray-600 mt-1">
              Review AI-generated documentation • Evidence-backed • Editable
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <div className="text-sm text-gray-600">Overall Confidence</div>
              <div className="flex items-center gap-2 mt-1">
                {allHighConfidence ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="font-semibold text-gray-900">
                  {allHighConfidence ? 'High' : 'Review Needed'}
                </span>
              </div>
            </div>
            
            <button
              onClick={onNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue to Coding
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6">
          {/* Voice Edit Input */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-purple-600" />
              <input
                type="text"
                placeholder="Type or speak to edit the note (e.g., 'Add patient reports stress at work to HPI')"
                className="flex-1 bg-white border border-purple-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Apply Edit
              </button>
            </div>
          </div>

          {/* Note Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <ConfidenceBadge level={section.confidence} />
                    {section.hasEvidence && (
                      <EvidenceChip 
                        evidence={[
                          {
                            type: 'transcript',
                            source: 'Visit conversation',
                            timestamp: '00:00:30',
                            snippet: 'Example evidence from transcript...',
                          },
                        ]}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {editingSection === section.id ? 'Done' : 'Edit'}
                    </span>
                  </button>
                </div>

                <div className="p-4">
                  {editingSection === section.id ? (
                    <textarea
                      value={section.content}
                      onChange={(e) => handleEditSection(section.id, e.target.value)}
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {section.lowConfidenceSegments ? (
                        <div className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed">
                          {section.content.split('').map((char, idx) => {
                            const isLowConfidence = section.lowConfidenceSegments?.some(
                              seg => idx >= seg.start && idx < seg.end
                            );
                            return (
                              <span
                                key={idx}
                                className={isLowConfidence ? 'bg-yellow-100 border-b-2 border-yellow-400' : ''}
                              >
                                {char}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed">
                          {section.content}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {section.confidence !== 'high' && (
                  <div className="px-4 pb-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5" />
                        <div className="text-xs text-yellow-900">
                          <span className="font-semibold">Review recommended:</span> Some content has medium/low confidence. 
                          Highlighted sections should be verified against source.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Insert</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                + Social History
              </button>
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                + Family History
              </button>
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                + Medications Reviewed
              </button>
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                + Patient Education
              </button>
              <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                + Time Spent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
