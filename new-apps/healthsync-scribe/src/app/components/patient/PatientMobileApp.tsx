import { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, Video, FileText, Calendar } from 'lucide-react';

interface PatientMobileAppProps {
  onBackToProvider: () => void;
}

type PatientScreen = 'home' | 'schedule' | 'get-ready' | 'consent' | 'waiting' | 'visit' | 'avs';

export function PatientMobileApp({ onBackToProvider }: PatientMobileAppProps) {
  const [currentScreen, setCurrentScreen] = useState<PatientScreen>('home');
  const [readinessChecks, setReadinessChecks] = useState({
    insurance: false,
    medications: false,
    symptoms: false,
    questions: false,
  });
  const [consents, setConsents] = useState({
    telehealth: false,
    recording: false,
    privacy: false,
  });

  const readinessScore = Object.values(readinessChecks).filter(Boolean).length;
  const allConsentsGiven = Object.values(consents).every(Boolean);

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-sm h-[800px] bg-white rounded-[40px] shadow-2xl border-8 border-gray-900 overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-xs">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-white rounded-sm" />
            <div className="w-4 h-3 border border-white rounded-sm opacity-70" />
            <div className="w-4 h-3 border border-white rounded-sm opacity-40" />
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              {currentScreen !== 'home' ? (
                <button
                  onClick={() => {
                    if (currentScreen === 'get-ready') setCurrentScreen('schedule');
                    else if (currentScreen === 'consent') setCurrentScreen('get-ready');
                    else if (currentScreen === 'waiting') setCurrentScreen('consent');
                    else if (currentScreen === 'visit') setCurrentScreen('waiting');
                    else if (currentScreen === 'avs') setCurrentScreen('home');
                    else setCurrentScreen('home');
                  }}
                  className="p-2 -ml-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onBackToProvider}
                  className="text-xs px-2 py-1 bg-white/20 rounded"
                >
                  ← Provider View
                </button>
              )}
              <div className="text-center flex-1">
                <div className="text-sm font-semibold">VitalSync</div>
                <div className="text-xs opacity-90">Patient Portal</div>
              </div>
              <div className="w-8" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-auto">
            {currentScreen === 'home' && (
              <div className="p-4 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, Emily!</h1>
                  <p className="text-sm text-gray-600">Your health, simplified</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm opacity-90 mb-1">Upcoming Visit</div>
                      <div className="text-xl font-bold">Today at 9:00 AM</div>
                    </div>
                    <Calendar className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="text-sm mb-4">
                    Primary Care • Dr. Sarah Chen
                  </div>
                  <button
                    onClick={() => setCurrentScreen('schedule')}
                    className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                  >
                    View Appointment
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-green-50 border border-green-200 rounded-xl text-left hover:bg-green-100 transition-colors">
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Records</div>
                    <div className="text-xs text-gray-600">View results</div>
                  </button>

                  <button className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-left hover:bg-purple-100 transition-colors">
                    <Video className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Messages</div>
                    <div className="text-xs text-gray-600">Contact provider</div>
                  </button>
                </div>
              </div>
            )}

            {currentScreen === 'schedule' && (
              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Your Appointment</h2>
                  <p className="text-sm text-gray-600">Today at 9:00 AM</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      SC
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Dr. Sarah Chen, MD</div>
                      <div className="text-sm text-gray-600">Primary Care Physician</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visit Type:</span>
                      <span className="font-medium text-gray-900">Primary Care</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium text-gray-900">Today, 9:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">30 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="text-sm font-semibold text-yellow-900 mb-2">Before Your Visit</div>
                  <div className="text-sm text-yellow-800">
                    Complete your pre-visit checklist to ensure the best care
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('get-ready')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Ready for Visit
                </button>
              </div>
            )}

            {currentScreen === 'get-ready' && (
              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Pre-Visit Checklist</h2>
                  <p className="text-sm text-gray-600">Help us prepare for your visit</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">Readiness Score</span>
                    <span className="text-2xl font-bold text-blue-600">{readinessScore}/4</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full ${
                          i < readinessScore ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    {readinessScore === 4 ? 'You\'re all set!' : `${4 - readinessScore} items remaining`}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setReadinessChecks({ ...readinessChecks, insurance: !readinessChecks.insurance })}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      readinessChecks.insurance
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Insurance Information</div>
                        <div className="text-sm text-gray-600">Verify your insurance details</div>
                      </div>
                      {readinessChecks.insurance && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setReadinessChecks({ ...readinessChecks, medications: !readinessChecks.medications })}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      readinessChecks.medications
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Current Medications</div>
                        <div className="text-sm text-gray-600">Review your medication list</div>
                      </div>
                      {readinessChecks.medications && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setReadinessChecks({ ...readinessChecks, symptoms: !readinessChecks.symptoms })}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      readinessChecks.symptoms
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Symptoms & Concerns</div>
                        <div className="text-sm text-gray-600">Tell us what's bothering you</div>
                      </div>
                      {readinessChecks.symptoms && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setReadinessChecks({ ...readinessChecks, questions: !readinessChecks.questions })}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      readinessChecks.questions
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Questions for Provider</div>
                        <div className="text-sm text-gray-600">Write down your questions</div>
                      </div>
                      {readinessChecks.questions && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentScreen('consent')}
                  disabled={readinessScore < 4}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Consent
                </button>
              </div>
            )}

            {currentScreen === 'consent' && (
              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Consent Forms</h2>
                  <p className="text-sm text-gray-600">Please review and accept</p>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 border-2 rounded-xl ${
                    consents.telehealth ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={consents.telehealth}
                        onChange={(e) => setConsents({ ...consents, telehealth: e.target.checked })}
                        className="mt-1 w-5 h-5 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Telehealth Consent</div>
                        <div className="text-sm text-gray-600 mb-2">
                          I consent to receive healthcare services via telehealth technology. I understand the benefits and limitations of virtual care.
                        </div>
                        <button className="text-sm text-blue-600 font-medium">Read Full Document</button>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 border-2 rounded-xl ${
                    consents.recording ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={consents.recording}
                        onChange={(e) => setConsents({ ...consents, recording: e.target.checked })}
                        className="mt-1 w-5 h-5 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Recording Consent (Optional)</div>
                        <div className="text-sm text-gray-600 mb-2">
                          I consent to the recording of this visit for documentation purposes. Recording helps ensure accurate medical records.
                        </div>
                        <button className="text-sm text-blue-600 font-medium">Read Full Document</button>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 border-2 rounded-xl ${
                    consents.privacy ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={consents.privacy}
                        onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })}
                        className="mt-1 w-5 h-5 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Privacy Notice (HIPAA)</div>
                        <div className="text-sm text-gray-600 mb-2">
                          I acknowledge receipt of the Notice of Privacy Practices and understand how my health information may be used and disclosed.
                        </div>
                        <button className="text-sm text-blue-600 font-medium">Read Full Document</button>
                      </div>
                    </div>
                  </div>
                </div>

                {!allConsentsGiven && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="text-sm text-yellow-900">
                      Please review and accept all required consents to continue
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setCurrentScreen('waiting')}
                  disabled={!allConsentsGiven}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enter Waiting Room
                </button>
              </div>
            )}

            {currentScreen === 'waiting' && (
              <div className="p-4 space-y-6 flex flex-col items-center justify-center min-h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Clock className="w-10 h-10 text-white" />
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">You're in the Waiting Room</h2>
                  <p className="text-sm text-gray-600">
                    Dr. Chen will join shortly. Please keep this window open.
                  </p>
                </div>

                <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">While You Wait:</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Ensure your camera and microphone are working</li>
                    <li>• Find a quiet, private location</li>
                    <li>• Have your questions ready</li>
                  </ul>
                </div>

                <button
                  onClick={() => setCurrentScreen('visit')}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Simulate: Dr. Chen is Ready
                </button>
              </div>
            )}

            {currentScreen === 'visit' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 bg-gray-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                        SC
                      </div>
                      <div className="text-white font-medium text-lg">Dr. Sarah Chen</div>
                      <div className="text-gray-400 text-sm">Connected</div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        ER
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Recording
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                    <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                      <Video className="w-6 h-6 text-white" />
                    </button>
                    <button className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                      <div className="w-6 h-6 bg-white rounded-sm" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                  <button
                    onClick={() => setCurrentScreen('avs')}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                  >
                    Simulate: Visit Complete
                  </button>
                </div>
              </div>
            )}

            {currentScreen === 'avs' && (
              <div className="p-4 space-y-4">
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Visit Complete!</h2>
                  <p className="text-sm text-gray-600">
                    Your after-visit summary is ready
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">After Visit Summary</div>
                      <div className="text-sm text-gray-700 mb-3">
                        Review your visit summary, medications, and follow-up instructions
                      </div>
                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Summary
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">3 Prescriptions Sent</span>
                      </div>
                      <button className="text-sm text-blue-600 font-medium">View</button>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Follow-up in 2 weeks</span>
                      </div>
                      <button className="text-sm text-blue-600 font-medium">Schedule</button>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">Lab Orders Ready</span>
                      </div>
                      <button className="text-sm text-blue-600 font-medium">View</button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
