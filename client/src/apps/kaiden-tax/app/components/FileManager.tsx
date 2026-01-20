import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, 
  X, FolderOpen, FileText, Table
} from 'lucide-react';
import { 
  exportTaxReturnToCSV, 
  importTaxReturnFromCSV,
  exportCryptoTransactionsToCSV,
  importCryptoTransactionsFromCSV,
  generateTaxReturnTemplate,
  generateCryptoTemplate,
  parseUploadedFile,
  TAX_ORGANIZER
} from '@/lib/fileIntegration';
import { TaxReturn } from '@/lib/taxEngine';
import { CryptoTransaction } from '@/lib/cryptoTaxEngine';
import { toast } from 'sonner';

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTaxReturn?: (data: Partial<TaxReturn>) => void;
  onImportCrypto?: (transactions: CryptoTransaction[]) => void;
  currentTaxReturn?: TaxReturn;
  currentCryptoTransactions?: CryptoTransaction[];
}

export function FileManager({
  isOpen,
  onClose,
  onImportTaxReturn,
  onImportCrypto,
  currentTaxReturn,
  currentCryptoTransactions
}: FileManagerProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'templates' | 'organizer'>('import');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedFile = await parseUploadedFile(file);
      
      // Determine file type and import
      if (file.name.includes('crypto') || file.name.includes('transaction')) {
        const transactions = importCryptoTransactionsFromCSV(uploadedFile.content);
        onImportCrypto?.(transactions);
        toast.success(`Imported ${transactions.length} crypto transactions`, {
          description: 'Transactions loaded successfully'
        });
      } else {
        const taxData = importTaxReturnFromCSV(uploadedFile.content);
        onImportTaxReturn?.(taxData);
        toast.success('Tax return data imported', {
          description: 'Data loaded successfully'
        });
      }
      
      onClose();
    } catch (error) {
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'Invalid file format'
      });
    }
  };

  const handleExport = (type: 'tax' | 'crypto') => {
    try {
      let csv = '';
      let filename = '';

      if (type === 'tax' && currentTaxReturn) {
        csv = exportTaxReturnToCSV(currentTaxReturn);
        filename = `tax-return-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (type === 'crypto' && currentCryptoTransactions) {
        csv = exportCryptoTransactionsToCSV(currentCryptoTransactions);
        filename = `crypto-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      }

      if (csv) {
        downloadCSV(csv, filename);
        toast.success('Export successful', {
          description: `Downloaded ${filename}`
        });
      }
    } catch (error) {
      toast.error('Export failed', {
        description: 'Unable to export data'
      });
    }
  };

  const handleDownloadTemplate = (type: 'tax' | 'crypto') => {
    const csv = type === 'tax' ? generateTaxReturnTemplate() : generateCryptoTemplate();
    const filename = type === 'tax' ? 'tax-return-template.csv' : 'crypto-template.csv';
    downloadCSV(csv, filename);
    toast.success('Template downloaded', {
      description: `Use this template to import your ${type} data`
    });
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] m-4 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(168, 182, 216, 0.2)',
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl text-slate-100 font-medium">File Manager</h2>
              <p className="text-slate-400 text-sm">Import, export, and manage tax data</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 flex gap-2 border-b border-slate-700/30">
            <TabButton
              active={activeTab === 'import'}
              onClick={() => setActiveTab('import')}
              icon={Upload}
              label="Import"
            />
            <TabButton
              active={activeTab === 'export'}
              onClick={() => setActiveTab('export')}
              icon={Download}
              label="Export"
            />
            <TabButton
              active={activeTab === 'templates'}
              onClick={() => setActiveTab('templates')}
              icon={FileSpreadsheet}
              label="Templates"
            />
            <TabButton
              active={activeTab === 'organizer'}
              onClick={() => setActiveTab('organizer')}
              icon={FolderOpen}
              label="Organizer"
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {activeTab === 'import' && (
              <ImportTab 
                onFileSelect={handleFileSelect}
                fileInputRef={fileInputRef}
              />
            )}
            {activeTab === 'export' && (
              <ExportTab onExport={handleExport} />
            )}
            {activeTab === 'templates' && (
              <TemplatesTab onDownload={handleDownloadTemplate} />
            )}
            {activeTab === 'organizer' && (
              <OrganizerTab />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 ${
        active
          ? 'bg-slate-800 text-slate-100 border-b-2 border-blue-500'
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ImportTab({ onFileSelect, fileInputRef }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-slate-100 font-medium mb-4">Import Data</h3>
        <p className="text-slate-400 text-sm mb-6">
          Upload CSV files to quickly populate your tax return or crypto transactions
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={onFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImportCard
          title="Tax Return Data"
          description="Import wages, deductions, and adjustments"
          icon={FileText}
          onClick={() => fileInputRef.current?.click()}
        />
        <ImportCard
          title="Crypto Transactions"
          description="Import buy/sell/trade records"
          icon={Table}
          onClick={() => fileInputRef.current?.click()}
        />
      </div>

      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium text-sm mb-1">Supported Sources</h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• QuickBooks export (CSV)</li>
              <li>• Xero export (CSV)</li>
              <li>• Exchange transaction history (Coinbase, Binance, Kraken)</li>
              <li>• Custom CSV using our templates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportTab({ onExport }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-slate-100 font-medium mb-4">Export Data</h3>
        <p className="text-slate-400 text-sm mb-6">
          Download your tax data for sharing with preparers or backup
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExportCard
          title="Tax Return CSV"
          description="Complete return data for preparer review"
          icon={FileText}
          onClick={() => onExport('tax')}
        />
        <ExportCard
          title="Crypto Transactions CSV"
          description="All transaction records with gains/losses"
          icon={Table}
          onClick={() => onExport('crypto')}
        />
      </div>

      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-emerald-300 font-medium text-sm mb-1">Why Export?</h4>
            <ul className="text-emerald-200/80 text-sm space-y-1">
              <li>• Share with your CPA or tax preparer</li>
              <li>• Import into QuickBooks or Xero</li>
              <li>• Keep backup records</li>
              <li>• Collaborate with team members</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplatesTab({ onDownload }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-slate-100 font-medium mb-4">CSV Templates</h3>
        <p className="text-slate-400 text-sm mb-6">
          Download templates to organize your data before importing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TemplateCard
          title="Tax Return Template"
          description="Pre-formatted CSV for income, deductions, and credits"
          fields={['wages', 'self_employment', 'interest', 'dividends', 'capital_gains']}
          onClick={() => onDownload('tax')}
        />
        <TemplateCard
          title="Crypto Transactions Template"
          description="Format for buy, sell, trade, and staking records"
          fields={['date', 'type', 'asset', 'amount', 'cost_basis', 'fmv']}
          onClick={() => onDownload('crypto')}
        />
      </div>
    </div>
  );
}

function OrganizerTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-slate-100 font-medium mb-4">Tax Organizer</h3>
        <p className="text-slate-400 text-sm mb-6">
          Complete checklist of documents needed for your tax return
        </p>
      </div>

      <div className="space-y-4">
        {TAX_ORGANIZER.map((section) => (
          <div key={section.section} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <h4 className="text-slate-200 font-medium mb-3">{section.section}</h4>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.item} className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700"
                  />
                  <div className="flex-1">
                    <div className="text-slate-300">
                      {item.item}
                      {item.required && <span className="text-red-400 ml-1">*</span>}
                    </div>
                    <div className="text-slate-500 text-xs">{item.description}</div>
                    {item.example && (
                      <div className="text-blue-400 text-xs mt-1">Example: {item.example}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportCard({ title, description, icon: Icon, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-blue-500/30 transition-all text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h4 className="text-slate-200 font-medium mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
      <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium">
        <Upload className="w-4 h-4" />
        Click to upload
      </div>
    </motion.button>
  );
}

function ExportCard({ title, description, icon: Icon, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-emerald-500/30 transition-all text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h4 className="text-slate-200 font-medium mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
      <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
        <Download className="w-4 h-4" />
        Click to download
      </div>
    </motion.button>
  );
}

function TemplateCard({ title, description, fields, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-all text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
        <FileSpreadsheet className="w-6 h-6 text-white" />
      </div>
      <h4 className="text-slate-200 font-medium mb-2">{title}</h4>
      <p className="text-slate-400 text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {fields.slice(0, 4).map((field: string) => (
          <span key={field} className="px-2 py-1 rounded bg-slate-700/50 text-slate-400 text-xs">
            {field}
          </span>
        ))}
        {fields.length > 4 && (
          <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-400 text-xs">
            +{fields.length - 4} more
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
        <Download className="w-4 h-4" />
        Download template
      </div>
    </motion.button>
  );
}
