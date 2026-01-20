import { AlertTriangle, FileText, Calendar } from 'lucide-react';
import { Patient } from '../../App';

interface PatientBannerProps {
  patient: Patient;
}

export function PatientBanner({ patient }: PatientBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">{patient.name}</h2>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">{patient.age}y</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-500">MRN: {patient.mrn}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span>DOB: {patient.dob}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {patient.allergies.length > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 border border-red-300 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-red-700" />
                  <span className="text-xs font-medium text-red-900">
                    Allergies: {patient.allergies.join(', ')}
                  </span>
                </div>
              )}
              
              {patient.riskFlags.map((risk, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 border border-orange-300 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-orange-700" />
                  <span className="text-xs font-medium text-orange-900">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Chart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
