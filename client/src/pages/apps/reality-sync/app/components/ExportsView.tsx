import { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { getVault, getAssetsByVault, getRoomsByVault, saveExport } from '../lib/storage';
import { generateInsuranceClaimPDF, generateCSV } from '../lib/export-pdf';
import { toast } from 'sonner';
import type { Vault, ExportType, ExportPacket } from '../types';

interface ExportsViewProps {
  vaultId: string;
  onBack: () => void;
  onExportGenerated?: (exportPacket: ExportPacket) => void;
}

export default function ExportsView({ vaultId, onBack, onExportGenerated }: ExportsViewProps) {
  const [vault, setVault] = useState<Vault | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const vaultData = getVault(vaultId);
    if (vaultData) {
      setVault(vaultData);
    }
  }, [vaultId]);

  const handleExport = async (type: ExportType) => {
    setIsExporting(true);
    setProgress(0);

    try {
      // Simulate progress
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      const assets = getAssetsByVault(vaultId);
      const rooms = getRoomsByVault(vaultId);
      
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (assets.length === 0) {
        toast.error('No assets to export. Please add some assets first.');
        setIsExporting(false);
        return;
      }

      const dateRange = {
        start: new Date(vault!.createdAt).toISOString(),
        end: new Date().toISOString(),
      };

      setProgress(75);

      if (type === 'insurance_claim') {
        const pdf = generateInsuranceClaimPDF(vault!, assets, rooms, dateRange);
        pdf.save(`${vault!.name}_Insurance_Claim.pdf`);
        
        const exportPacket = {
          id: `export_${Date.now()}`,
          vaultId,
          type,
          dateRange,
          generatedAt: new Date().toISOString(),
          format: 'pdf' as const,
        };
        
        saveExport(exportPacket);
        
        if (onExportGenerated) {
          onExportGenerated(exportPacket);
        }
      } else if (type === 'theft_report') {
        const csv = generateCSV(assets, rooms);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${vault!.name}_Asset_List.csv`;
        a.click();
        URL.revokeObjectURL(url);

        const exportPacket = {
          id: `export_${Date.now()}`,
          vaultId,
          type,
          dateRange,
          generatedAt: new Date().toISOString(),
          format: 'csv' as const,
        };
        
        saveExport(exportPacket);
        
        if (onExportGenerated) {
          onExportGenerated(exportPacket);
        }
      }

      setProgress(100);
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error(error);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  if (!vault) return null;

  return (
    <div className="min-h-screen bg-silver-50 pb-20 md:pb-0">
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-600 sticky top-0 z-30 luxury-shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl text-white font-semibold tracking-tight">Exports</h1>
              <p className="text-sm text-silver-300">Generate reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isExporting && (
          <Card className="bg-white border-silver-200 p-6 mb-6 luxury-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 animate-spin text-accent-blue" />
              <span className="font-medium text-navy-900">Generating export...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>
        )}

        <div>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Export Options</h2>
          <div className="grid gap-4">
            <Card className="bg-white border-silver-200 p-6 hover:border-accent-blue hover:luxury-shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center flex-shrink-0 luxury-shadow">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-2">Insurance Claim Packet</h3>
                  <p className="text-sm text-silver-500 mb-4">
                    Professional PDF report with cover page, room summaries, asset register with photos,
                    and timestamped proof for insurance claims.
                  </p>
                  <ul className="text-sm text-silver-600 mb-4 space-y-1">
                    <li>✓ Time-stamped documentation</li>
                    <li>✓ Photo evidence with metadata</li>
                    <li>✓ Complete asset register</li>
                    <li>✓ Professional formatting</li>
                  </ul>
                  <Button
                    onClick={() => handleExport('insurance_claim')}
                    disabled={isExporting}
                    className="bg-gradient-to-r from-accent-blue to-accent-blue-light hover:from-accent-blue-light hover:to-accent-blue text-white luxury-shadow"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-silver-200 p-6 hover:border-accent-blue hover:luxury-shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center flex-shrink-0 luxury-shadow">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-2">Police Report / Theft Documentation</h3>
                  <p className="text-sm text-silver-500 mb-4">
                    CSV spreadsheet with detailed asset information including serial numbers,
                    descriptions, and value ranges for law enforcement documentation.
                  </p>
                  <ul className="text-sm text-silver-600 mb-4 space-y-1">
                    <li>✓ Serial numbers and identifiers</li>
                    <li>✓ Detailed descriptions</li>
                    <li>✓ Value ranges</li>
                    <li>✓ CSV format for easy sharing</li>
                  </ul>
                  <Button
                    onClick={() => handleExport('theft_report')}
                    disabled={isExporting}
                    variant="outline"
                    className="border-silver-300 text-navy-700 hover:bg-silver-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}