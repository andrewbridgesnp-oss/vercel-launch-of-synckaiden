import { Shield, Users, Database, FileSearch, Settings } from 'lucide-react';
import { useState } from 'react';

export function AdminAudit() {
  const [activeTab, setActiveTab] = useState<'audit' | 'access' | 'retention' | 'integration'>('audit');

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin & Audit</h1>
        <p className="text-sm text-gray-600 mt-1">
          Security, compliance, and system administration
        </p>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {[
            { id: 'audit' as const, label: 'Audit Log', icon: <FileSearch className="w-4 h-4" /> },
            { id: 'access' as const, label: 'Access Controls', icon: <Users className="w-4 h-4" /> },
            { id: 'retention' as const, label: 'Data Retention', icon: <Database className="w-4 h-4" /> },
            { id: 'integration' as const, label: 'Integrations', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'audit' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Access Audit Log</h2>
                <p className="text-sm text-gray-600 mt-1">HIPAA-compliant audit trail of all system access</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Resource</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { time: '2024-05-15 14:32:15', user: 'Dr. Sarah Chen', action: 'Viewed Chart', patient: 'Emily Rodriguez', resource: 'Clinical Note', ip: '192.168.1.100' },
                      { time: '2024-05-15 14:28:03', user: 'Dr. Sarah Chen', action: 'Signed Note', patient: 'Emily Rodriguez', resource: 'Visit Note #1234', ip: '192.168.1.100' },
                      { time: '2024-05-15 14:15:22', user: 'Dr. Sarah Chen', action: 'Started Visit', patient: 'Emily Rodriguez', resource: 'Telehealth Session', ip: '192.168.1.100' },
                      { time: '2024-05-15 14:10:45', user: 'MA Johnson', action: 'Updated Vitals', patient: 'Emily Rodriguez', resource: 'Vital Signs', ip: '192.168.1.105' },
                      { time: '2024-05-15 13:55:18', user: 'Front Desk Staff', action: 'Verified Insurance', patient: 'Emily Rodriguez', resource: 'Insurance Info', ip: '192.168.1.110' },
                    ].map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{entry.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{entry.user}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-xs font-medium">
                            {entry.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{entry.patient}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{entry.resource}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">{entry.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'access' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Role-Based Access Control (RBAC)</h2>
              
              <div className="space-y-4">
                {[
                  { role: 'Provider', permissions: ['Full chart access', 'Prescribe medications', 'Sign notes', 'View all records'] },
                  { role: 'Medical Assistant', permissions: ['View charts', 'Update vitals', 'Pre-visit prep', 'Limited records'] },
                  { role: 'Front Desk', permissions: ['Demographics', 'Insurance', 'Scheduling', 'Billing only'] },
                  { role: 'Pharmacy', permissions: ['Medication orders', 'Interaction alerts', 'Refill requests'] },
                  { role: 'Lab', permissions: ['Lab orders', 'Results entry', 'Abnormal triage'] },
                ].map((roleConfig, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{roleConfig.role}</span>
                      </div>
                      <button className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                        Edit Permissions
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roleConfig.permissions.map((perm, pidx) => (
                        <span key={pidx} className="px-2 py-1 bg-green-50 border border-green-200 rounded text-xs text-green-900">
                          ✓ {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'retention' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Retention Settings</h2>
              <p className="text-sm text-gray-600 mb-6">Configure retention policies for recordings, transcripts, and clinical notes</p>

              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">Audio Recordings</div>
                      <div className="text-sm text-gray-600">Telehealth visit audio files</div>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>90 days</option>
                      <option>180 days</option>
                      <option>1 year</option>
                      <option>7 years (medical record)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">Transcripts</div>
                      <div className="text-sm text-gray-600">Visit conversation transcripts</div>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>90 days</option>
                      <option>180 days</option>
                      <option>1 year</option>
                      <option>7 years (medical record)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">Clinical Notes</div>
                      <div className="text-sm text-gray-600">Finalized documentation</div>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                      <option>7 years (required)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-700 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <span className="font-semibold">HIPAA Compliance:</span> All retention policies comply with federal requirements. Clinical notes must be retained for minimum 7 years per regulations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">EHR & API Integrations</h2>
              
              <div className="space-y-4">
                <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="font-semibold text-gray-900">SMART on FHIR</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">EHR integration for clinical data exchange</div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-xs font-medium">
                      Connected
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Endpoint: https://fhir.example.com/r4
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="font-semibold text-gray-900">CDS Hooks</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">Clinical decision support callbacks</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Placeholder - Configure CDS Hooks endpoints
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="font-semibold text-gray-900">TEFCA / Carequality</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">Health information exchange networks</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Placeholder - Connect to HIE networks
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="font-semibold text-gray-900">PACS / DICOMweb</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">Medical imaging integration</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Placeholder - Connect to imaging systems
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
