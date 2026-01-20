import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('KAIDEN Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            
            <div>
              <h1 
                className="text-3xl font-light mb-2 tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #a8b6d8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                System Error
              </h1>
              <p className="text-slate-400 text-sm">
                KAIDEN encountered an unexpected error
              </p>
            </div>

            {this.state.error && (
              <div 
                className="p-4 rounded-xl text-left text-xs text-slate-300 font-mono bg-slate-800/50 border border-slate-700/50 overflow-auto max-h-32"
              >
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Restart System
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>ERROR STATE</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
