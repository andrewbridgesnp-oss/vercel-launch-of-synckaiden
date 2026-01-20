import { HeartPulse, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { UserRole } from '../../App';

interface CareGapsProps {
  userRole: UserRole;
}

interface CareGap {
  id: string;
  category: 'preventive' | 'chronic' | 'quality';
  title: string;
  description: string;
  status: 'overdue' | 'due-soon' | 'completed';
  dueDate?: string;
  measures?: string[];
}

const mockCareGaps: CareGap[] = [
  {
    id: '1',
    category: 'chronic',
    title: 'Diabetes Eye Exam',
    description: 'Annual dilated eye exam for diabetes management',
    status: 'overdue',
    dueDate: '12/2023',
    measures: ['HEDIS DED', 'MIPS #117'],
  },
  {
    id: '2',
    category: 'preventive',
    title: 'Colorectal Cancer Screening',
    description: 'FIT test or colonoscopy due for age-appropriate screening',
    status: 'due-soon',
    dueDate: '03/2025',
    measures: ['HEDIS COL', 'USPSTF Grade A'],
  },
  {
    id: '3',
    category: 'chronic',
    title: 'Blood Pressure Control',
    description: 'BP <140/90 documented in last visit',
    status: 'completed',
    measures: ['HEDIS CBP', 'MIPS #236'],
  },
];

export function CareGaps({ userRole }: CareGapsProps) {
  const overdueGaps = mockCareGaps.filter(g => g.status === 'overdue');
  const dueSoonGaps = mockCareGaps.filter(g => g.status === 'due-soon');
  const completedGaps = mockCareGaps.filter(g => g.status === 'completed');

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Care Gaps</h1>
        <p className="text-sm text-gray-600 mt-1">
          Quality measures and preventive care tracking • {overdueGaps.length} overdue • {dueSoonGaps.length} due soon
        </p>
      </div>

      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border-2 border-red-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Overdue</span>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-900">{overdueGaps.length}</div>
            </div>

            <div className="bg-white rounded-lg border-2 border-yellow-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Due Soon</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-yellow-900">{dueSoonGaps.length}</div>
            </div>

            <div className="bg-white rounded-lg border-2 border-green-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Completed</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900">{completedGaps.length}</div>
            </div>
          </div>

          {/* Care Gaps List */}
          <div className="space-y-4">
            {mockCareGaps.map((gap) => (
              <div
                key={gap.id}
                className={`bg-white rounded-lg border-2 p-4 ${
                  gap.status === 'overdue' ? 'border-red-200 bg-red-50/30' :
                  gap.status === 'due-soon' ? 'border-yellow-200 bg-yellow-50/30' :
                  'border-green-200 bg-green-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <HeartPulse className={`w-5 h-5 ${
                        gap.status === 'overdue' ? 'text-red-600' :
                        gap.status === 'due-soon' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <h3 className="font-semibold text-gray-900">{gap.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        gap.status === 'overdue' ? 'bg-red-100 text-red-900' :
                        gap.status === 'due-soon' ? 'bg-yellow-100 text-yellow-900' :
                        'bg-green-100 text-green-900'
                      }`}>
                        {gap.status === 'overdue' ? 'Overdue' :
                         gap.status === 'due-soon' ? 'Due Soon' :
                         'Completed'}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 rounded text-xs font-medium text-purple-900">
                        {gap.category === 'preventive' ? 'Preventive' :
                         gap.category === 'chronic' ? 'Chronic Care' :
                         'Quality'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{gap.description}</p>

                    {gap.dueDate && (
                      <div className="text-xs text-gray-600 mb-2">
                        Due: {gap.dueDate}
                      </div>
                    )}

                    {gap.measures && (
                      <div className="flex gap-2 flex-wrap">
                        {gap.measures.map((measure, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                            {measure}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {gap.status !== 'completed' && (
                    <div className="flex gap-2 ml-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Add to Plan
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Patient Education
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
