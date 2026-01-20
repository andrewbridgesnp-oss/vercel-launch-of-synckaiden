import { Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { Visit, UserRole } from '../../App';
import { StatusBadge } from '../ui/StatusBadge';

interface TodayQueueProps {
  onSelectVisit: (visit: Visit) => void;
  onStartVisit: (visit: Visit) => void;
  userRole: UserRole;
}

const mockVisits: Visit[] = [
  {
    id: '1',
    patientId: 'PT001',
    patientName: 'Emily Rodriguez',
    time: '9:00 AM',
    reasonForVisit: 'Annual wellness visit + medication refill',
    visitType: 'Primary Care',
    status: { consent: true, intake: true, vitals: true, payment: true, ready: true },
    specialtyPack: 'Primary',
  },
  {
    id: '2',
    patientId: 'PT002',
    patientName: 'Michael Chen',
    time: '9:30 AM',
    reasonForVisit: 'Acute cough and fever (3 days)',
    visitType: 'Urgent Care',
    status: { consent: true, intake: true, vitals: true, payment: true, ready: true },
    urgent: true,
    specialtyPack: 'Urgent',
  },
  {
    id: '3',
    patientId: 'PT003',
    patientName: 'Sarah Johnson',
    time: '10:00 AM',
    reasonForVisit: 'Follow-up weight loss consultation',
    visitType: 'Weight Loss',
    status: { consent: true, intake: true, vitals: false, payment: true, ready: false },
    specialtyPack: 'Weight Loss',
  },
  {
    id: '4',
    patientId: 'PT004',
    patientName: 'James Mitchell',
    time: '10:30 AM',
    reasonForVisit: 'HRT follow-up and lab review',
    visitType: 'HRT',
    status: { consent: true, intake: true, vitals: true, payment: true, ready: true },
    specialtyPack: 'HRT',
  },
  {
    id: '5',
    patientId: 'PT005',
    patientName: 'Maria Santos',
    time: '11:00 AM',
    reasonForVisit: 'Holistic wellness assessment',
    visitType: 'Holistic Care',
    status: { consent: true, intake: false, vitals: false, payment: true, ready: false },
    specialtyPack: 'Holistic',
  },
  {
    id: '6',
    patientId: 'PT006',
    patientName: 'David Thompson',
    time: '11:30 AM',
    reasonForVisit: 'Diabetes management and A1C review',
    visitType: 'Primary Care',
    status: { consent: true, intake: true, vitals: true, payment: false, ready: false },
    specialtyPack: 'Primary',
  },
  {
    id: '7',
    patientId: 'PT007',
    patientName: 'Lisa Anderson',
    time: '1:00 PM',
    reasonForVisit: 'Joint pain and inflammation',
    visitType: 'Primary Care',
    status: { consent: false, intake: false, vitals: false, payment: false, ready: false },
    specialtyPack: 'Primary',
  },
  {
    id: '8',
    patientId: 'PT008',
    patientName: 'Robert Kim',
    time: '1:30 PM',
    reasonForVisit: 'Headache evaluation',
    visitType: 'Urgent Care',
    status: { consent: true, intake: true, vitals: true, payment: true, ready: true },
    urgent: true,
    specialtyPack: 'Urgent',
  },
];

export function TodayQueue({ onSelectVisit, onStartVisit, userRole }: TodayQueueProps) {
  const readyCount = mockVisits.filter(v => v.status.ready).length;
  const urgentCount = mockVisits.filter(v => v.urgent).length;

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today's Schedule</h1>
            <p className="text-sm text-gray-600 mt-1">
              {mockVisits.length} appointments • {readyCount} ready • {urgentCount} urgent
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Filter</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium">
            All ({mockVisits.length})
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
            Ready ({readyCount})
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
            Urgent ({urgentCount})
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
            Pending
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {mockVisits.map((visit) => (
            <div
              key={visit.id}
              className={`bg-white rounded-lg border-2 transition-all hover:shadow-md ${
                visit.urgent 
                  ? 'border-red-300 bg-red-50/30' 
                  : visit.status.ready 
                  ? 'border-green-300' 
                  : 'border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold">
                      {visit.patientName.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{visit.patientName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{visit.time}</span>
                        </div>
                        {visit.urgent && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 border border-red-300 rounded-md">
                            <AlertCircle className="w-3 h-3 text-red-700" />
                            <span className="text-xs font-semibold text-red-900">URGENT</span>
                          </div>
                        )}
                        <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-md text-xs font-medium text-purple-900">
                          {visit.specialtyPack}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{visit.reasonForVisit}</p>

                      <div className="flex flex-wrap gap-2">
                        <StatusBadge 
                          status={visit.status.consent ? 'complete' : 'incomplete'} 
                          label="Consent" 
                        />
                        <StatusBadge 
                          status={visit.status.intake ? 'complete' : 'incomplete'} 
                          label="Intake" 
                        />
                        <StatusBadge 
                          status={visit.status.vitals ? 'complete' : 'incomplete'} 
                          label="Vitals" 
                        />
                        <StatusBadge 
                          status={visit.status.payment ? 'complete' : 'incomplete'} 
                          label="Payment" 
                        />
                        {visit.status.ready && (
                          <StatusBadge 
                            status="complete" 
                            label="Ready" 
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onSelectVisit(visit)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Pre-Visit Brief
                    </button>
                    {visit.status.ready && (
                      <button
                        onClick={() => onStartVisit(visit)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Visit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
