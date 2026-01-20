import { ArrowLeft, AlertTriangle, CheckCircle, Pill, FlaskConical, Scan, UserPlus, Edit3 } from 'lucide-react';
import { Visit } from '../../App';
import { useState } from 'react';

interface OrdersStagingProps {
  visit: Visit;
  onSignAndClose: () => void;
  onBack: () => void;
}

interface Order {
  id: string;
  type: 'medication' | 'lab' | 'imaging' | 'referral';
  title: string;
  details: string;
  status: 'pending' | 'signed' | 'edited';
  warnings?: string[];
  requiresPriorAuth?: boolean;
}

export function OrdersStaging({ visit, onSignAndClose, onBack }: OrdersStagingProps) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      type: 'medication',
      title: 'Metformin 1000mg',
      details: 'Take 1 tablet by mouth twice daily with meals\nQuantity: 180 tablets\nRefills: 3\nPharmacy: CVS Pharmacy #1234',
      status: 'pending',
      warnings: [],
    },
    {
      id: '2',
      type: 'medication',
      title: 'Lisinopril 10mg',
      details: 'Take 1 tablet by mouth once daily\nQuantity: 90 tablets\nRefills: 3\nPharmacy: CVS Pharmacy #1234',
      status: 'pending',
      warnings: ['Monitor for orthostatic hypotension - patient reports dizziness'],
    },
    {
      id: '3',
      type: 'lab',
      title: 'A1C (Hemoglobin A1c)',
      details: 'Indication: Type 2 Diabetes monitoring\nFrequency: In 3 months\nFasting: Not required\nLab: Quest Diagnostics',
      status: 'pending',
      warnings: [],
    },
    {
      id: '4',
      type: 'lab',
      title: 'Basic Metabolic Panel (BMP)',
      details: 'Indication: Medication monitoring (Lisinopril)\nTiming: In 2 weeks\nFasting: Preferred\nLab: Quest Diagnostics',
      status: 'pending',
      warnings: [],
    },
  ]);

  const [showSignDrawer, setShowSignDrawer] = useState(false);

  const handleSignOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'signed' as const } : o
    ));
  };

  const handleSignAll = () => {
    setShowSignDrawer(true);
  };

  const confirmSignAll = () => {
    setOrders(orders.map(o => ({ ...o, status: 'signed' as const })));
    setShowSignDrawer(false);
    setTimeout(() => {
      onSignAndClose();
    }, 500);
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const signedOrders = orders.filter(o => o.status === 'signed');

  const orderIcons = {
    medication: <Pill className="w-5 h-5" />,
    lab: <FlaskConical className="w-5 h-5" />,
    imaging: <Scan className="w-5 h-5" />,
    referral: <UserPlus className="w-5 h-5" />,
  };

  const orderColors = {
    medication: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600' },
    lab: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
    imaging: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
    referral: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Coding</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Orders Staging</h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and sign orders • {pendingOrders.length} pending • {signedOrders.length} signed
            </p>
          </div>

          <button
            onClick={handleSignAll}
            disabled={pendingOrders.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign All & Close Visit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Safety Notice */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-700 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Provider Review Required</h3>
                <p className="text-sm text-gray-700">
                  No orders will be transmitted until you explicitly sign and approve. All interaction warnings 
                  and prior authorization requirements are shown below.
                </p>
              </div>
            </div>
          </div>

          {/* Medications */}
          {orders.filter(o => o.type === 'medication').length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Medications (eRx)</h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {orders.filter(o => o.type === 'medication').map((order) => (
                  <div key={order.id} className={`p-4 ${order.status === 'signed' ? 'bg-green-50/50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{order.title}</h3>
                          {order.status === 'signed' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded-full text-xs font-medium text-green-900">
                              <CheckCircle className="w-3 h-3" />
                              Signed
                            </span>
                          )}
                          {order.requiresPriorAuth && (
                            <span className="px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded-full text-xs font-medium text-yellow-900">
                              Prior Auth Required
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 whitespace-pre-line mb-3">
                          {order.details}
                        </div>

                        {order.warnings && order.warnings.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {order.warnings.map((warning, idx) => (
                              <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-yellow-900">{warning}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleSignOrder(order.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            Sign
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Labs */}
          {orders.filter(o => o.type === 'lab').length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Laboratory Tests</h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {orders.filter(o => o.type === 'lab').map((order) => (
                  <div key={order.id} className={`p-4 ${order.status === 'signed' ? 'bg-green-50/50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{order.title}</h3>
                          {order.status === 'signed' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-300 rounded-full text-xs font-medium text-green-900">
                              <CheckCircle className="w-3 h-3" />
                              Signed
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {order.details}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleSignOrder(order.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Sign
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Order Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add Additional Orders</h3>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm font-medium text-purple-900 hover:bg-purple-100 transition-colors">
                <Pill className="w-4 h-4" />
                + Medication
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-100 transition-colors">
                <FlaskConical className="w-4 h-4" />
                + Lab Test
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-900 hover:bg-green-100 transition-colors">
                <Scan className="w-4 h-4" />
                + Imaging
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm font-medium text-orange-900 hover:bg-orange-100 transition-colors">
                <UserPlus className="w-4 h-4" />
                + Referral
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sign & Close Drawer */}
      {showSignDrawer && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSignDrawer(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 rounded-t-2xl shadow-2xl z-50 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign and Close Visit</h3>
            <p className="text-sm text-gray-600 mb-6">
              By signing, you confirm that all documentation is accurate and all orders are appropriate. 
              This action will finalize the visit and transmit approved orders.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Orders to be transmitted:</span>
                  <span className="font-semibold text-gray-900">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Patient:</span>
                  <span className="font-semibold text-gray-900">{visit.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Visit Date:</span>
                  <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSignDrawer(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignAll}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign & Close Visit
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
