import { FileCheck, Download, Send, Languages, TrendingDown } from 'lucide-react';
import { Visit } from '../../App';
import { useState } from 'react';

interface PatientAVSProps {
  visit: Visit;
  onComplete: () => void;
}

export function PatientAVS({ visit, onComplete }: PatientAVSProps) {
  const [readingLevel, setReadingLevel] = useState<5 | 8 | 12>(8);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">After Visit Summary (AVS)</h1>
            <p className="text-sm text-gray-600 mt-1">
              Patient education and visit summary for {visit.patientName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send to Patient Portal
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Reading Level:</span>
                <div className="flex gap-2">
                  {[5, 8, 12].map((level) => (
                    <button
                      key={level}
                      onClick={() => setReadingLevel(level as any)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        readingLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Grade {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 border-l pl-6">
                <Languages className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Language:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'es'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Español
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AVS Content */}
          <div className="bg-white rounded-lg border-2 border-gray-300 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">VitalSync</div>
                  <div className="text-xs text-gray-500">HealthSync Scribe</div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">After Visit Summary</h2>
              <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              {/* Patient Info */}
              <div className="pb-6 border-b border-gray-200">
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-gray-900">Patient:</span>
                      <span className="ml-2 text-gray-700">{visit.patientName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Visit Type:</span>
                      <span className="ml-2 text-gray-700">{visit.visitType}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Provider:</span>
                      <span className="ml-2 text-gray-700">Dr. Sarah Chen, MD</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Date:</span>
                      <span className="ml-2 text-gray-700">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What We Discussed */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  What We Discussed Today
                </h3>
                <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <p>We reviewed your progress managing your diabetes and blood pressure. Your blood sugar control has improved significantly - great job!</p>
                  <p>We also talked about the dizziness you've been feeling when you stand up. This might be related to your blood pressure medication.</p>
                </div>
              </div>

              {/* Your Conditions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Your Health Conditions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-gray-900 min-w-[200px]">Type 2 Diabetes:</span>
                    <span className="text-gray-700">Well controlled with current treatment</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-gray-900 min-w-[200px]">High Blood Pressure:</span>
                    <span className="text-gray-700">Controlled with medication</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-gray-900 min-w-[200px]">Dizziness:</span>
                    <span className="text-gray-700">New symptom we're monitoring</span>
                  </li>
                </ul>
              </div>

              {/* Your Medications */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Your Medications</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-semibold text-gray-900 mb-1">Metformin 1000mg</div>
                    <div className="text-sm text-gray-700">Take 1 tablet by mouth twice daily with meals</div>
                    <div className="text-xs text-gray-600 mt-1">Purpose: Controls blood sugar levels</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-semibold text-gray-900 mb-1">Lisinopril 10mg</div>
                    <div className="text-sm text-gray-700">Take 1 tablet by mouth once daily</div>
                    <div className="text-xs text-gray-600 mt-1">Purpose: Controls blood pressure</div>
                  </div>
                </div>
              </div>

              {/* What You Need to Do */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">What You Need to Do</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Continue taking your medications as prescribed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Check your blood pressure at home or pharmacy, especially when you feel dizzy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Stand up slowly from sitting or lying down to prevent dizziness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Drink plenty of water throughout the day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Get your A1C checked again in 3 months</span>
                  </li>
                </ul>
              </div>

              {/* When to Call */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Call Us Right Away If:</h3>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>You fall or feel like you might fall</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Your dizziness gets worse or happens more often</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>You have chest pain, severe headache, or trouble breathing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Your blood sugar is very high (over 300) or very low (under 70)</span>
                  </li>
                </ul>
              </div>

              {/* Follow-up */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Follow-up Appointments</h3>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-semibold text-gray-900">Check-in Visit in 2 weeks</div>
                  <div className="text-sm text-gray-700 mt-1">We'll review how you're feeling and check your blood pressure</div>
                </div>
              </div>

              {/* Lifestyle Tips */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Healthy Living Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Keep up your healthy eating habits - they're working!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Try to walk for 20-30 minutes most days of the week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Aim for 7-8 hours of sleep each night</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Limit salt in your diet to help with blood pressure</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              Questions? Call us at (555) 123-4567 or message us through your patient portal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
