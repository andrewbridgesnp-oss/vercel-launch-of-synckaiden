import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth-service';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: 'okta' | 'azure' | 'google') => {
    setError('');
    setIsLoading(true);

    try {
      await authService.loginWithSSO(provider);
      // User will be redirected to SSO provider
    } catch (err: any) {
      setError(err.message || 'SSO login failed');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@healthsync.com');
    setPassword('demo123');
    
    setTimeout(async () => {
      try {
        await authService.login('demo@healthsync.com', 'demo123');
        onLogin();
      } catch (err: any) {
        setError(err.message || 'Demo login failed');
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center mx-auto mb-4 luxury-shadow-lg">
            <span className="text-navy-900 font-bold text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Kaiden Scribe</h1>
          <p className="text-silver-300">AI Clinical Documentation Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl luxury-shadow-lg p-8">
          <div className="mb-6">
            <div className="flex gap-2 p-1 bg-silver-100 rounded-lg">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-navy-900 shadow'
                    : 'text-silver-600 hover:text-navy-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-navy-900 shadow'
                    : 'text-silver-600 hover:text-navy-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-navy-900 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-silver-300 text-navy-600" />
                  <span className="text-silver-600">Remember me</span>
                </label>
                <button type="button" className="text-navy-600 hover:text-navy-700 font-semibold">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-navy-700 to-navy-600 hover:from-navy-600 hover:to-navy-500 text-white font-semibold rounded-lg luxury-shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-silver-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-silver-600">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSSOLogin('google')}
                disabled={isLoading}
                className="px-4 py-2 border border-silver-300 rounded-lg hover:bg-silver-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Google"
              >
                <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                onClick={() => handleSSOLogin('azure')}
                disabled={isLoading}
                className="px-4 py-2 border border-silver-300 rounded-lg hover:bg-silver-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Microsoft"
              >
                <svg className="w-5 h-5 mx-auto" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M0 0h11v11H0z"/>
                  <path fill="#81bc06" d="M12 0h11v11H12z"/>
                  <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                  <path fill="#ffba08" d="M12 12h11v11H12z"/>
                </svg>
              </button>
              <button
                onClick={() => handleSSOLogin('okta')}
                disabled={isLoading}
                className="px-4 py-2 border border-silver-300 rounded-lg hover:bg-silver-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Okta"
              >
                <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24">
                  <path fill="#007DC1" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-silver-200">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 text-navy-600 hover:text-navy-700 font-semibold transition-colors"
            >
              Try Demo Account →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-silver-300">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-gold hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gold hover:underline">Privacy Policy</a>
          </p>
          <p className="mt-4">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              HIPAA Compliant • SOC 2 Type II • Enterprise Security
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}