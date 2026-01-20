import { ArrowLeft, Video, Mic, MicOff, VideoOff, PhoneOff, Play, Pause, Shield, Bookmark } from 'lucide-react';
import { Visit } from '../../App';
import { CDSCard } from '../ui/CDSCard';
import { EvidenceChip } from '../ui/EvidenceChip';
import { useState, useEffect } from 'react';

interface ActiveVisitProps {
  visit: Visit;
  onComplete: () => void;
  onBack: () => void;
}

interface TranscriptEntry {
  id: string;
  speaker: 'Provider' | 'Patient';
  text: string;
  timestamp: string;
  bookmarks?: string[];
}

const mockTranscript: TranscriptEntry[] = [
  { id: '1', speaker: 'Provider', text: 'Good morning Emily! How are you feeling today?', timestamp: '00:00:05' },
  { id: '2', speaker: 'Patient', text: 'Hi Dr. Chen, I\'m doing okay. I wanted to talk about my blood pressure medications and get those refills we discussed.', timestamp: '00:00:12', bookmarks: ['Medications'] },
  { id: '3', speaker: 'Provider', text: 'Absolutely, let\'s review those. I see you\'re on Lisinopril 10mg daily and Metformin 1000mg twice daily. How have you been tolerating them?', timestamp: '00:00:20', bookmarks: ['Medications'] },
  { id: '4', speaker: 'Patient', text: 'They\'ve been fine, no side effects. My blood sugar has been better too.', timestamp: '00:00:30' },
  { id: '5', speaker: 'Provider', text: 'That\'s great to hear. I have your recent lab results here. Your A1C came back at 6.8%, which is excellent - down from 7.2% three months ago.', timestamp: '00:00:38', bookmarks: ['Assessment'] },
  { id: '6', speaker: 'Patient', text: 'Oh that\'s wonderful! I\'ve been really trying to watch my diet.', timestamp: '00:00:48' },
  { id: '7', speaker: 'Provider', text: 'Your efforts are definitely paying off. Your lipid panel also looks good. One thing I do want to mention - you mentioned feeling a bit dizzy when you stand up quickly. Has that been happening often?', timestamp: '00:00:52', bookmarks: ['Symptoms', 'Assessment'] },
  { id: '8', speaker: 'Patient', text: 'Yes, maybe 2-3 times a week. It\'s not severe, just a little lightheaded for a few seconds.', timestamp: '00:01:05', bookmarks: ['Symptoms'] },
];

export function ActiveVisit({ visit, onComplete, onBack }: ActiveVisitProps) {
  const [isRecording, setIsRecording] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(mockTranscript);
  const [selectedBookmark, setSelectedBookmark] = useState<string | null>(null);

  const bookmarkCategories = ['Symptoms', 'PMH', 'Medications', 'Allergies', 'Assessment', 'Plan'];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isRecording ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-lg">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-red-900">Recording</span>
                  <button
                    onClick={() => setIsRecording(false)}
                    className="ml-2 p-1 hover:bg-red-200 rounded transition-colors"
                  >
                    <Pause className="w-4 h-4 text-red-900" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsRecording(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">Resume Recording</span>
                </button>
              )}

              <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors">
                <Shield className="w-4 h-4 text-purple-700" />
                <span className="text-sm font-medium text-purple-900">Sensitive Segment</span>
              </button>
            </div>

            <button
              onClick={onComplete}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Complete Visit
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video + Transcript */}
        <div className="flex-1 flex flex-col">
          {/* Video Panel */}
          <div className="bg-gray-900 relative" style={{ height: '280px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {visit.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-white font-medium">{visit.patientName}</div>
                <div className="text-gray-400 text-sm mt-1">Connected</div>
              </div>
            </div>

            {/* Provider small video */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  SC
                </div>
              </div>
            </div>

            {/* Call controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
              </button>
              <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                <PhoneOff className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Timeline Bookmarks */}
          <div className="bg-white border-b border-gray-200 p-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="text-xs font-medium text-gray-500 whitespace-nowrap">BOOKMARKS:</div>
              {bookmarkCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedBookmark(category === selectedBookmark ? null : category)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedBookmark === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Live Transcript */}
          <div className="flex-1 bg-white overflow-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Live Transcript</h3>
                <div className="text-xs text-gray-500">Duration: 01:15</div>
              </div>

              {transcript
                .filter(entry => !selectedBookmark || entry.bookmarks?.includes(selectedBookmark))
                .map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-16 text-xs text-gray-500 pt-1">
                      {entry.timestamp}
                    </div>
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-2 rounded-lg max-w-3xl ${
                        entry.speaker === 'Provider'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-100 border border-gray-200'
                      }`}>
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          {entry.speaker}
                        </div>
                        <div className="text-sm text-gray-900">{entry.text}</div>
                        {entry.bookmarks && entry.bookmarks.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {entry.bookmarks.map((bookmark, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-700"
                              >
                                <Bookmark className="w-3 h-3" />
                                {bookmark}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: CDS Cards */}
        <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-auto p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Clinical Decision Support</h3>
          <div className="space-y-4">
            <CDSCard
              type="safety"
              title="Drug Interaction Alert"
              description="Patient reports dizziness with position changes. Monitor for orthostatic hypotension with current Lisinopril dose."
              priority="high"
              evidence={[
                {
                  type: 'transcript',
                  source: 'Patient statement',
                  timestamp: '00:01:05',
                  snippet: 'Yes, maybe 2-3 times a week. It\'s not severe, just a little lightheaded for a few seconds.',
                },
                {
                  type: 'chart',
                  source: 'Current medications',
                  snippet: 'Lisinopril 10mg daily - ACE inhibitor can cause orthostatic hypotension',
                },
              ]}
              actions={[
                { label: 'Check Orthostatic BP', onClick: () => {}, variant: 'primary' },
                { label: 'Dismiss', onClick: () => {} },
              ]}
            />

            <CDSCard
              type="documentation"
              title="MDM Completeness"
              description="Consider documenting number of diagnoses, data reviewed, and risk level to support E/M coding."
              evidence={[
                {
                  type: 'guideline',
                  source: 'E/M Documentation Guidelines 2023',
                  snippet: 'MDM includes: number/complexity of problems, amount/complexity of data, risk of complications',
                },
              ]}
              actions={[
                { label: 'Add to Note', onClick: () => {} },
              ]}
              dismissible
            />

            <CDSCard
              type="coding"
              title="Consider ICD-10: R42"
              description="Patient reports dizziness/lightheadedness - consider coding as R42 (Dizziness and giddiness)"
              evidence={[
                {
                  type: 'transcript',
                  source: 'Symptom description',
                  timestamp: '00:01:05',
                  snippet: 'Yes, maybe 2-3 times a week. It\'s not severe, just a little lightheaded for a few seconds.',
                },
              ]}
              actions={[
                { label: 'Add Diagnosis', onClick: () => {}, variant: 'primary' },
                { label: 'Not Applicable', onClick: () => {} },
              ]}
              dismissible
            />

            <CDSCard
              type="care-gap"
              title="Annual Wellness Exam Due"
              description="Patient is due for comprehensive wellness exam including cognitive assessment and advance care planning."
              actions={[
                { label: 'Add to Plan', onClick: () => {} },
                { label: 'Schedule', onClick: () => {} },
              ]}
              dismissible
            />
          </div>
        </div>
      </div>
    </div>
  );
}
