import { useState, useEffect } from 'react';
import { Camera, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerSimulationProps {
  onScanComplete: (name: string, category: string, expiryDays: number) => void;
  onClose: () => void;
}

const MOCK_SCAN_RESULTS = [
  { name: 'Organic Milk', category: 'Dairy', expiryDays: 7 },
  { name: 'Whole Wheat Bread', category: 'Bakery', expiryDays: 5 },
  { name: 'Fresh Strawberries', category: 'Produce', expiryDays: 4 },
  { name: 'Greek Yogurt', category: 'Dairy', expiryDays: 14 },
  { name: 'Orange Juice', category: 'Beverages', expiryDays: 10 },
];

export function ScannerSimulation({ onScanComplete, onClose }: ScannerSimulationProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<typeof MOCK_SCAN_RESULTS[0] | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleScan = () => {
    setScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const randomItem = MOCK_SCAN_RESULTS[Math.floor(Math.random() * MOCK_SCAN_RESULTS.length)];
      setScanResult(randomItem);
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleConfirm = () => {
    if (scanResult) {
      onScanComplete(scanResult.name, scanResult.category, scanResult.expiryDays);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-title"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="scanner-title" className="text-xl font-semibold text-slate-100">Barcode Scanner</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-black rounded-lg overflow-hidden mb-6 border-2 border-slate-700">
          {/* Camera feed simulation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-16 h-16 text-slate-600" />
            </div>
          </div>

          {/* Scanning overlay */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Scan frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1/2 border-2 border-blue-500/50 rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
            </div>
          </div>

          {/* Success overlay */}
          <AnimatePresence>
            {scanned && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-20 h-20 text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 mb-4"
          >
            <h3 className="font-semibold text-slate-100 mb-2">Scanned Item</h3>
            <div className="space-y-1 text-sm">
              <p className="text-slate-300"><span className="text-slate-500">Name:</span> {scanResult.name}</p>
              <p className="text-slate-300"><span className="text-slate-500">Category:</span> {scanResult.category}</p>
              <p className="text-slate-300"><span className="text-slate-500">Expires in:</span> {scanResult.expiryDays} days</p>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {!scanning && !scanned && (
          <p className="text-slate-400 text-sm text-center mb-6">
            Position the barcode within the frame and click scan
          </p>
        )}

        {scanning && (
          <p className="text-blue-400 text-sm text-center mb-6 animate-pulse">
            Scanning barcode...
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!scanned ? (
            <button
              onClick={handleScan}
              disabled={scanning}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? 'Scanning...' : 'Start Scan'}
            </button>
          ) : (
            <>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors shadow-lg font-medium"
              >
                Add to Pantry
              </button>
              <button
                onClick={() => {
                  setScanned(false);
                  setScanResult(null);
                }}
                className="px-4 py-3 border border-slate-600 bg-slate-700/30 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Scan Again
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
