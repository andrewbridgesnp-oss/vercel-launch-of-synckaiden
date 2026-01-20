import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Visit, Patient } from '../../App';
import { PatientBanner } from '../ui/PatientBanner';

interface PreVisitBriefProps {
  visit: Visit;
  onStartVisit: () => void;
  onBack: () => void;
}

const mockPatientData: Record<string, Patient> = {
  'PT001': {
    id: 'PT001',
    name: 'Emily Rodriguez',
    age: 42,
    mrn: 'MRN-2024-001',
    dob: '04/15/1982',
    allergies: ['Penicillin', 'Sulfa drugs'],
    activeProblems: ['Hypertension', 'Type 2 Diabetes', 'Hypothyroidism'],
    currentMeds: ['Metformin 1000mg BID', 'Lisinopril 10mg daily', 'Levothyroxine 75mcg daily'],
    riskFlags: ['Fall risk', 'Polypharmacy'],
  },
  'PT002': {
    id: 'PT002',
    name: 'Michael Chen',
    age: 28,
    mrn: 'MRN-2024-002',
    dob: '08/22/1996',
    allergies: [],
    activeProblems: [],
    currentMeds: [],
    riskFlags: [],
  },
};

export function PreVisitBrief({ visit, onStartVisit, onBack }: PreVisitBriefProps) {
  const patient = mockPatientData[visit.patientId] || {
    id: visit.patientId,
    name: visit.patientName,
    age: 35,
    mrn: `MRN-2024-${visit.patientId.slice(-3)}`,
    dob: '01/01/1989',
    allergies: [],
    activeProblems: [],
    currentMeds: [],
    riskFlags: [],
  };

  const specialtyContext = {
    'Primary': {
      nextBestQuestions: [
        'Have you had any changes in your medications since your last visit?',
        'Any new symptoms or concerns since we last spoke?',
        'Are you due for any preventive screenings?',
      ],
      focusAreas: ['Chronic disease management', 'Preventive care', 'Medication reconciliation'],
    },
    'Urgent': {
      nextBestQuestions: [
        'When did the symptoms start and how have they progressed?',
        'Have you taken any medications for these symptoms?',
        'Any associated symptoms like chest pain, shortness of breath?',
      ],
      focusAreas: ['Symptom severity assessment', 'Red flag symptoms', 'Disposition planning'],
    },
    'Weight Loss': {
      nextBestQuestions: [
        'What is your current weight and recent weight trend?',
        'Describe your current diet and exercise routine',
        'Any barriers to weight loss you\'re experiencing?',
      ],
      focusAreas: ['Weight trends', 'Lifestyle modifications', 'Medication options'],
    },
    'HRT': {
      nextBestQuestions: [
        'How are you tolerating your current hormone regimen?',
        'Any side effects or concerns?',
        'Recent lab results review needed?',
      ],
      focusAreas: ['Hormone levels', 'Side effect monitoring', 'Dose adjustments'],
    },
    'Holistic': {
      nextBestQuestions: [
        'What are your wellness goals for today?',
        'Any complementary therapies you\'re currently using?',
        'How would you rate your overall well-being?',
      ],
      focusAreas: ['Mind-body connection', 'Integrative approaches', 'Lifestyle optimization'],
    },
  };

  const context = specialtyContext[visit.specialtyPack];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Queue</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pre-Visit Brief</h1>
            <p className="text-sm text-gray-600 mt-1">{visit.reasonForVisit}</p>
          </div>

          <button
            onClick={onStartVisit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Visit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <PatientBanner patient={patient} />

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Last Visit Summary</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Date</div>
                  <div className="text-sm text-gray-900">3 months ago (02/15/2024)</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Visit Type</div>
                  <div className="text-sm text-gray-900">Primary Care Follow-up</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Key Points</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Blood pressure well controlled on current regimen</li>
                    <li>• A1C improved to 6.8% (goal &lt;7%)</li>
                    <li>• Patient adherent to medications</li>
                    <li>• Ordered lipid panel and TSH (due today)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Problems</h2>
              <div className="space-y-2">
                {patient.activeProblems.length > 0 ? (
                  patient.activeProblems.map((problem, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-900">{problem}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">No active problems documented</div>
                )}
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3">Current Medications</h3>
              <div className="space-y-2">
                {patient.currentMeds.length > 0 ? (
                  patient.currentMeds.map((med, idx) => (
                    <div key={idx} className="text-sm text-gray-700 pl-3 border-l-2 border-green-300">
                      {med}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">No active medications</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {visit.specialtyPack} Specialty Pack
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Optimized workflow and documentation for {visit.specialtyPack.toLowerCase()} visits
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Focus Areas</h3>
                <ul className="space-y-1">
                  {context.focusAreas.map((area, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Next Best Questions</h3>
                <ul className="space-y-1">
                  {context.nextBestQuestions.map((question, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Missing</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-700 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm mb-1">Lab Results Pending</div>
                  <div className="text-sm text-gray-700">
                    Lipid panel and TSH ordered 2 weeks ago - results available but not reviewed
                  </div>
                </div>
                <button className="px-3 py-1 bg-white border border-yellow-300 rounded-md text-xs font-medium text-yellow-900 hover:bg-yellow-50 transition-colors">
                  Review Now
                </button>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-700 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm mb-1">Preventive Care Up to Date</div>
                  <div className="text-sm text-gray-700">
                    Mammogram, colonoscopy, and immunizations all current
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-700 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm mb-1">Medication Refills Due</div>
                  <div className="text-sm text-gray-700">
                    3 medications due for refill within next 14 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
