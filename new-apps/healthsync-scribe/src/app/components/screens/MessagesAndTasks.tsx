import { MessageSquare, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { UserRole } from '../../App';
import { useState } from 'react';

interface MessagesAndTasksProps {
  userRole: UserRole;
}

export function MessagesAndTasks({ userRole }: MessagesAndTasksProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'messages'>('tasks');

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages & Tasks</h1>
        <p className="text-sm text-gray-600 mt-1">
          Inbox, refill requests, prior authorizations, and follow-ups
        </p>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Tasks (12)
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages (8)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'tasks' && (
          <div className="max-w-5xl mx-auto space-y-3">
            {[
              {
                type: 'abnormal-result',
                priority: 'high',
                title: 'Abnormal Lab Result - David Thompson',
                description: 'A1C 8.2% (elevated) - requires follow-up and potential medication adjustment',
                time: '2 hours ago',
              },
              {
                type: 'refill',
                priority: 'medium',
                title: 'Refill Request - Maria Santos',
                description: 'Levothyroxine 100mcg - Patient requesting 90-day refill',
                time: '4 hours ago',
              },
              {
                type: 'prior-auth',
                priority: 'high',
                title: 'Prior Authorization Required - James Mitchell',
                description: 'Insurance requires PA for Testosterone Cypionate',
                time: '5 hours ago',
              },
              {
                type: 'referral',
                priority: 'medium',
                title: 'Referral Follow-up - Emily Rodriguez',
                description: 'Endocrinology appointment scheduled for 06/15/2024',
                time: '1 day ago',
              },
              {
                type: 'abnormal-result',
                priority: 'low',
                title: 'Lab Result Review - Lisa Anderson',
                description: 'Vitamin D slightly low (28 ng/mL) - consider supplementation',
                time: '1 day ago',
              },
            ].map((task, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all ${
                  task.priority === 'high' ? 'border-red-200 bg-red-50/30' :
                  task.priority === 'medium' ? 'border-yellow-200' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {task.priority === 'high' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {task.priority === 'medium' && <Clock className="w-5 h-5 text-yellow-600" />}
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-900' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-900' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority === 'high' ? 'High Priority' :
                         task.priority === 'medium' ? 'Medium' : 'Low'}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 border border-blue-200 rounded text-xs text-blue-900">
                        {task.type === 'abnormal-result' ? 'Abnormal Result' :
                         task.type === 'refill' ? 'Refill Request' :
                         task.type === 'prior-auth' ? 'Prior Auth' :
                         'Referral'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                    <div className="text-xs text-gray-500">{task.time}</div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Review
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="divide-y divide-gray-200">
                {[
                  { from: 'Emily Rodriguez', subject: 'Question about medication side effects', preview: 'Hi Dr. Chen, I wanted to ask about the dizziness I\'ve been experiencing...', unread: true, time: '1 hour ago' },
                  { from: 'Michael Chen', subject: 'Follow-up after urgent care visit', preview: 'Thank you for seeing me today. I wanted to confirm the follow-up plan...', unread: true, time: '3 hours ago' },
                  { from: 'Sarah Johnson', subject: 'Weight loss progress update', preview: 'I\'m excited to share that I\'ve lost 8 pounds since our last visit!', unread: false, time: '1 day ago' },
                ].map((message, idx) => (
                  <div
                    key={idx}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      message.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {message.from.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.from}
                          </span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <div className={`text-sm mb-1 ${message.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-1">{message.preview}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
