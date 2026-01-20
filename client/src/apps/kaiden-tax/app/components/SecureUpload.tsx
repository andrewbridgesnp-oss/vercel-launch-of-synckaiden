import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { 
  Upload as UploadIcon, 
  Shield, 
  Clock, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Mic
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface UploadPageProps {
  token: string;
}

interface ExtractedData {
  field: string;
  value: string | number;
  confidence: number;
}

export function SecureUpload({ token }: UploadPageProps) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [verificationStep, setVerificationStep] = useState(0);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    checkExpiration();
  }, [token]);

  const checkExpiration = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/upload/check/${token}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (data.expired) {
        setExpired(true);
      } else {
        setExpiresAt(new Date(data.expiresAt));
      }
    } catch (error) {
      console.error('Failed to check expiration:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/upload/authenticate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ token, password }),
        }
      );

      if (response.ok) {
        setAuthenticated(true);
        toast.success('Access granted!');
      } else {
        toast.error('Incorrect password');
      }
    } catch (error) {
      toast.error('Authentication failed');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
    toast.success(`${selectedFiles.length} file(s) selected`);
  };

  const scanDocument = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/upload/scan`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExtractedData(data.extracted);
        setVerificationStep(1);
        toast.success('Document scanned successfully!');
      } else {
        toast.error('Failed to scan document');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Network error during scan');
    } finally {
      setUploading(false);
    }
  };

  const verifyData = async () => {
    setVerificationStep(2);
    
    // Initiate voice readback
    toast.success('Starting verification...', {
      description: 'KAIDEN will read back the extracted data',
    });
    
    // Simulate voice readback
    for (const item of extractedData) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, play voice synthesis here
      toast.info(`${item.field}: ${item.value}`, {
        description: 'Press checkmark to confirm or X to reject',
      });
    }
    
    setVerificationStep(3);
  };

  const submitData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/upload/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ token, data: extractedData }),
        }
      );

      if (response.ok) {
        toast.success('Upload complete!', {
          description: 'Your CPA has been notified. This link will now expire.',
        });
        setVerificationStep(4);
      } else {
        toast.error('Failed to submit data');
      }
    } catch (error) {
      toast.error('Network error during submission');
    }
  };

  if (expired) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-xl border text-center"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Link Expired</h2>
          <p className="text-slate-400 mb-6">
            This secure upload link has expired (12 hour limit). Please contact your CPA for a new link.
          </p>
          <p className="text-xs text-slate-500">
            All data is automatically deleted after expiration for your security.
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-xl border"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Secure Upload</h2>
            <p className="text-slate-400">Enter the password provided by your CPA</p>
          </div>

          {expiresAt && (
            <div className="p-3 rounded-lg mb-6 flex items-center gap-2 text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <Clock className="w-4 h-4 text-red-400" />
              <span className="text-slate-300">
                Expires in {Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))} hours
              </span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-2">Access Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-slate-800/50 border-slate-700 text-slate-100"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6"
              disabled={!password}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                color: '#ffffff'
              }}
            >
              Access Upload Portal
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg"
            style={{
              background: 'rgba(168, 182, 216, 0.05)',
              border: '1px solid rgba(168, 182, 216, 0.1)',
            }}
          >
            <p className="text-xs text-slate-400 text-center">
              🔒 This link is encrypted and auto-deletes after 12 hours
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStep === 4) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-xl border text-center"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Upload Complete!</h2>
          <p className="text-slate-400 mb-6">
            Your tax documents have been securely submitted to your CPA.
          </p>
          <div className="space-y-2 text-sm text-slate-500 text-left">
            <p>✅ Documents encrypted and transmitted</p>
            <p>✅ CPA has been notified</p>
            <p>✅ This link is now expired</p>
            <p>✅ All data will auto-delete in 12 hours</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Upload Tax Documents</h1>
          <p className="text-slate-400">
            Upload your W-2s, 1099s, and other tax forms. KAIDEN will scan and extract the information.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: 'Upload', active: verificationStep === 0 },
            { num: 2, label: 'Review', active: verificationStep === 1 },
            { num: 3, label: 'Verify', active: verificationStep === 2 },
            { num: 4, label: 'Submit', active: verificationStep === 3 },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step.active 
                  ? 'bg-emerald-500 text-white' 
                  : verificationStep > idx 
                  ? 'bg-emerald-500/30 text-emerald-300' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {step.num}
              </div>
              <div className={`flex-1 h-0.5 ${
                verificationStep > idx ? 'bg-emerald-500' : 'bg-slate-700'
              }`} />
            </div>
          ))}
        </div>

        {/* Upload Section */}
        {verificationStep === 0 && (
          <div className="p-8 rounded-xl border"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
              <UploadIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-slate-400 mb-6">
                Supported: PDF, JPG, PNG
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 182, 216, 0.9), rgba(147, 158, 187, 0.9))',
                    color: '#0f172a'
                  }}
                >
                  Select Files
                </Button>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-300">{file.name}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => scanDocument(file)}
                      disabled={uploading}
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                        color: '#ffffff'
                      }}
                    >
                      {uploading ? 'Scanning...' : 'Scan Document'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Review Extracted Data */}
        {verificationStep === 1 && (
          <div className="p-8 rounded-xl border space-y-6"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <h3 className="text-xl font-semibold text-slate-100">Review Extracted Data</h3>
            
            <div className="space-y-3">
              {extractedData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                  <div>
                    <Label className="text-slate-400 text-sm">{item.field}</Label>
                    <p className="text-slate-100 font-semibold">{item.value}</p>
                  </div>
                  <div className="text-sm text-slate-400">
                    {Math.round(item.confidence * 100)}% confident
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={verifyData}
              className="w-full py-6"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                color: '#ffffff'
              }}
            >
              <Eye className="w-5 h-5 mr-2" />
              Verify with Voice Readback
            </Button>
          </div>
        )}

        {/* Voice Verification */}
        {verificationStep === 2 && (
          <div className="p-8 rounded-xl border text-center"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <Mic className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              KAIDEN is reading back your data
            </h3>
            <p className="text-slate-400">
              Listen carefully and confirm each value is correct
            </p>
          </div>
        )}

        {/* Final Submit */}
        {verificationStep === 3 && (
          <div className="p-8 rounded-xl border space-y-6"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Ready to Submit
              </h3>
              <p className="text-slate-400">
                You've verified all information. Submit to your CPA?
              </p>
            </div>

            <Button
              onClick={submitData}
              className="w-full py-6"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                color: '#ffffff'
              }}
            >
              Submit to CPA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
