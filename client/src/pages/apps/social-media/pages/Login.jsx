import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = isLogin 
      ? await login(email, password)
      : await register(email, password);

    setLoading(false);

    if (result.success) {
      toast.success(isLogin ? 'Logged in successfully' : 'Account created successfully');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase text-primary mb-2">SYNDICA FORGE</h1>
          <p className="text-muted-foreground text-sm font-mono">KAYDEN DISTRIBUTION ENGINE</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-mono uppercase tracking-tight">
              {isLogin ? 'LOGIN' : 'REGISTER'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="email-input"
                  className="mt-2 bg-background border-border font-mono"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="password-input"
                  className="mt-2 bg-background border-border font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                data-testid="submit-button"
                className="w-full bg-primary hover:bg-primary/90 font-mono text-xs uppercase tracking-wider"
              >
                {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'REGISTER')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                data-testid="toggle-auth-mode"
              >
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}