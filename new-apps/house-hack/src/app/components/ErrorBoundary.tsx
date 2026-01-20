import React, { Component, ReactNode } from 'react';
import { Button } from './ui/button';

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a1128] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1a2238] border border-[#c0c5ce]/20 rounded-lg p-8 text-center">
            <div className="text-[#ee6c4d] text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#e8ecf4] mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-[#c0c5ce] mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="bg-[#0a1128] border border-[#ee6c4d]/30 rounded p-4 mb-6 text-left">
                <p className="text-xs text-[#ee6c4d] font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button 
              onClick={() => window.location.reload()}
              className="bg-[#c0c5ce] text-[#0a1128] hover:bg-[#e8ecf4]"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
