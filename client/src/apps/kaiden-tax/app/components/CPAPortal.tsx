import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { 
  Users, 
  Link as LinkIcon, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Copy,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface SecureUpload {
  token: string;
  clientEmail: string;
  expiresAt: Date;
  status: 'pending' | 'completed' | 'expired';
  password: string;
}

export function CPAPortal() {
  const [uploads, setUploads] = useState<SecureUpload[]>([]);
  const [clientEmail, setClientEmail] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/cpa/uploads`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUploads(data.uploads || []);
      }
    } catch (error) {
      console.error('Failed to load uploads:', error);
    }
  };

  const generateSecureLink = async () => {
    if (!clientEmail || !clientEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/cpa/generate-link`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ clientEmail }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        const newUpload: SecureUpload = {
          token: data.token,
          clientEmail,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
          status: 'pending',
          password: data.password,
        };
        
        setUploads([newUpload, ...uploads]);
        setClientEmail('');
        
        toast.success('Secure link generated!', {
          description: 'Link expires in 12 hours',
        });
      } else {
        toast.error('Failed to generate link');
      }
    } catch (error) {
      console.error('Error generating link:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/upload/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
  };

  const sendEmail = async (upload: SecureUpload) => {
    const link = `${window.location.origin}/upload/${upload.token}`;
    const subject = encodeURIComponent('Secure Tax Document Upload - KAIDEN');
    const body = encodeURIComponent(`Hello,

Your CPA has invited you to securely upload your tax documents.

Upload Link: ${link}
Password: ${upload.password}

IMPORTANT SECURITY INFORMATION:
• This link expires in 12 hours (at ${upload.expiresAt.toLocaleString()})
• All uploaded documents are encrypted
• Documents are automatically deleted after 12 hours
• Only your CPA can access the documents

Instructions:
1. Click the link above
2. Enter the password provided
3. Upload your W-2s, 1099s, and other tax documents
4. Verify the information KAIDEN extracts
5. Submit when ready

Your CPA will be notified when upload is complete.

Questions? Contact your CPA directly.

Best regards,
KAIDEN Tax Intelligence Platform`);
    
    window.location.href = `mailto:${upload.clientEmail}?subject=${subject}&body=${body}`;
    toast.success('Email template opened');
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-slate-100">CPA Portal</h1>
          </div>
          <p className="text-slate-400">
            Generate secure, temporary upload links for your clients
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-6 rounded-xl border mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
            borderColor: 'rgba(16, 185, 129, 0.3)',
          }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-100 mb-2">Auto-Delete Security</h3>
              <p className="text-sm text-slate-300 mb-2">
                All client uploads are automatically deleted after 12 hours. Nothing is retained on our servers.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li>Encrypted with unique password per client</li>
                <li>12-hour expiration from time of creation</li>
                <li>Zero data retention after expiration</li>
                <li>You must download data before expiration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Generate Link Section */}
        <div className="p-6 rounded-xl border mb-8"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            Generate Secure Upload Link
          </h2>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-slate-300 mb-2">Client Email Address</Label>
              <Input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@example.com"
                className="bg-slate-800/50 border-slate-700 text-slate-100"
                onKeyDown={(e) => e.key === 'Enter' && generateSecureLink()}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateSecureLink}
                disabled={generating || !clientEmail}
                className="px-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                  color: '#ffffff'
                }}
              >
                {generating ? 'Generating...' : 'Generate Link'}
              </Button>
            </div>
          </div>
        </div>

        {/* Active Uploads */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Active Upload Links</h2>
          
          {uploads.length === 0 ? (
            <div className="p-12 rounded-xl border text-center"
              style={{
                background: 'rgba(15, 23, 42, 0.4)',
                borderColor: 'rgba(168, 182, 216, 0.2)',
              }}
            >
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No active upload links</p>
              <p className="text-sm text-slate-500 mt-2">
                Generate a link above to get started
              </p>
            </div>
          ) : (
            uploads.map((upload) => {
              const isExpired = new Date() > upload.expiresAt;
              const statusColor = upload.status === 'completed' 
                ? 'text-emerald-400' 
                : isExpired 
                ? 'text-red-400' 
                : 'text-blue-400';

              return (
                <div
                  key={upload.token}
                  className="p-6 rounded-xl border"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderColor: 'rgba(168, 182, 216, 0.2)',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-100">
                          {upload.clientEmail}
                        </h3>
                        <span className={`text-sm ${statusColor} flex items-center gap-1`}>
                          {upload.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                          {isExpired && <AlertTriangle className="w-4 h-4" />}
                          {!isExpired && upload.status === 'pending' && <Clock className="w-4 h-4" />}
                          {upload.status === 'completed' ? 'Completed' : isExpired ? 'Expired' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {getTimeRemaining(upload.expiresAt)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Upload Link */}
                    <div>
                      <Label className="text-slate-400 text-xs mb-1">Upload Link</Label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={`${window.location.origin}/upload/${upload.token}`}
                          className="bg-slate-800/50 border-slate-700 text-slate-300 text-sm font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(upload.token)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <Label className="text-slate-400 text-xs mb-1">Password (share with client)</Label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          type="text"
                          value={upload.password}
                          className="bg-slate-800/50 border-slate-700 text-slate-300 text-sm font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyPassword(upload.password)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendEmail(upload)}
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Client
                      </Button>
                      
                      {upload.status === 'completed' && (
                        <Button
                          size="sm"
                          className="flex items-center gap-2"
                          style={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                            color: '#ffffff'
                          }}
                        >
                          <LinkIcon className="w-4 h-4" />
                          View Submission
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
