import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Shield } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628] p-4 relative overflow-hidden">
      {/* Hyper-realistic background with depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(100,149,237,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(192,192,192,0.08),transparent_50%)]"></div>
        
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(100,149,237,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,149,237,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
      </div>

      <Card className="w-full max-w-md relative shadow-[0_20px_80px_-15px_rgba(100,149,237,0.5)] border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent"></div>

        <CardHeader className="space-y-1 text-center relative">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative p-4 rounded-2xl" style={{
                background: 'linear-gradient(145deg, #cbd5e1, #94a3b8)',
                boxShadow: '12px 12px 24px #0a1628, -12px -12px 24px #1e293b, inset 2px 2px 4px rgba(255,255,255,0.1)'
              }}>
                <Shield className="w-8 h-8 text-slate-800" style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }} />
              </div>
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold relative" style={{
            background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 20px rgba(100,149,237,0.3)',
            letterSpacing: '0.5px'
          }}>
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400 text-base font-medium">
            Join the Financial Elite
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 relative">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-semibold text-sm tracking-wide">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/50 transition-all duration-300"
                style={{
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(71,85,105,0.1)'
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 font-semibold text-sm tracking-wide">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/50 transition-all duration-300"
                style={{
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(71,85,105,0.1)'
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300 font-semibold text-sm tracking-wide">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/50 transition-all duration-300"
                style={{
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(71,85,105,0.1)'
                }}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-300 border border-red-500/30 p-3 rounded-lg relative overflow-hidden" style={{
                background: 'linear-gradient(145deg, rgba(127,29,29,0.2), rgba(153,27,27,0.2))',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                <span className="relative">{error}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 relative">
            <Button 
              type="submit" 
              className="w-full text-slate-900 font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(145deg, #e2e8f0, #cbd5e1)',
                boxShadow: '0 4px 15px rgba(100,149,237,0.3), inset 1px 1px 2px rgba(255,255,255,0.3), inset -1px -1px 2px rgba(0,0,0,0.2)'
              }}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="flex items-center gap-2 relative">
                  <div className="w-4 h-4 border-2 border-slate-700/30 border-t-slate-700 rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                <span className="relative">Create Account</span>
              )}
            </Button>
            <p className="text-sm text-center text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-300 hover:text-slate-100 font-semibold transition-colors relative">
                <span className="relative z-10">Sign In</span>
                <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-slate-500 to-blue-500 transform scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </p>
          </CardFooter>
        </form>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent"></div>
      </Card>
    </div>
  );
};

export default RegisterPage;