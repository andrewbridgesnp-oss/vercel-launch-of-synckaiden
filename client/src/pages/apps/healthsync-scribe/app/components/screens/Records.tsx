import { TrendingUp, FileText, Image, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function Records() {
  const [activeTab, setActiveTab] = useState<'labs' | 'imaging' | 'external'>('labs');

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Records</h1>
        <p className="text-sm text-gray-600 mt-1">
          Lab results, imaging reports, and external records
        </p>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'labs'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Lab Results
          </button>
          <button
            onClick={() => setActiveTab('imaging')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'imaging'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Imaging Reports
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'external'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            External Records
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'labs' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Lab Trends */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Hemoglobin A1C Trend</h2>
                <span className="text-sm text-gray-600">Last 12 months</span>
              </div>

              <div className="relative h-48 flex items-end gap-4">
                {[7.8, 7.5, 7.2, 6.8].map((value, idx) => {
                  const height = (value / 10) * 100;
                  const isLatest = idx === 3;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="text-sm font-semibold mb-2">{value}%</div>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          isLatest ? 'bg-green-500' : 'bg-blue-400'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-gray-600 mt-2">
                        {['9mo', '6mo', '3mo', 'Now'][idx]}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                  <span className="text-sm font-medium text-green-900">
                    Excellent improvement! A1C decreased 1.0% over 9 months
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Labs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Lab Results</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {[
                  { test: 'A1C', value: '6.8%', reference: '<7.0%', status: 'normal', date: '05/15/2024' },
                  { test: 'Glucose (Fasting)', value: '110 mg/dL', reference: '70-100 mg/dL', status: 'high', date: '05/15/2024' },
                  { test: 'Total Cholesterol', value: '185 mg/dL', reference: '<200 mg/dL', status: 'normal', date: '05/15/2024' },
                  { test: 'LDL', value: '105 mg/dL', reference: '<100 mg/dL', status: 'high', date: '05/15/2024' },
                  { test: 'HDL', value: '58 mg/dL', reference: '>40 mg/dL', status: 'normal', date: '05/15/2024' },
                  { test: 'TSH', value: '2.1 mIU/L', reference: '0.4-4.0 mIU/L', status: 'normal', date: '05/15/2024' },
                ].map((lab, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-gray-900">{lab.test}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            lab.status === 'normal' ? 'bg-green-100 text-green-900' :
                            lab.status === 'high' ? 'bg-orange-100 text-orange-900' :
                            'bg-red-100 text-red-900'
                          }`}>
                            {lab.status === 'normal' ? 'Normal' :
                             lab.status === 'high' ? 'High' : 'Critical'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Reference: {lab.reference}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{lab.value}</div>
                        <div className="text-xs text-gray-500">{lab.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'imaging' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Imaging Reports</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {[
                  { type: 'Chest X-Ray', date: '03/20/2024', status: 'Final', findings: 'No acute cardiopulmonary process' },
                  { type: 'CT Abdomen/Pelvis', date: '01/15/2024', status: 'Final', findings: 'Normal study' },
                ].map((imaging, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Image className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">{imaging.type}</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-900 rounded text-xs font-medium">
                            {imaging.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{imaging.findings}</p>
                        <div className="text-xs text-gray-500">{imaging.date}</div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          View Report
                        </button>
                        <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span className="text-blue-900">
                    <span className="font-semibold">PACS/DICOMweb Integration:</span> Connect to view images directly
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'external' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Health Information Exchange</h2>
              <p className="text-sm text-gray-700 mb-4">
                Access external records via TEFCA, Carequality, and CommonWell networks
              </p>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Query External Records
                </button>
                <button className="px-4 py-2 border border-purple-300 rounded-lg text-sm text-purple-900 hover:bg-purple-50 transition-colors">
                  View Access Log
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No external records queried yet</p>
              <p className="text-sm text-gray-500 mt-1">Connect to HIE networks to access external patient records</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
