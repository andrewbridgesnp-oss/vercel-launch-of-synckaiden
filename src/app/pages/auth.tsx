import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

type AuthMode = "signin" | "signup" | "forgot" | "invite";

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (mode !== "forgot" && !formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") {
        alert("Password reset link sent to " + formData.email);
        setMode("signin");
      } else {
        onNavigate("onboarding");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Avery
          </h1>
          <p className="text-muted-foreground">Your 24/7 AI Receptionist</p>
        </div>

        <GlassmorphismCard className="p-8">
          <div className="space-y-6">
            {/* Mode Titles */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                {mode === "signin" && "Welcome Back"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Reset Password"}
                {mode === "invite" && "Accept Invitation"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "signin" && "Sign in to your account"}
                {mode === "signup" && "Start your 14-day free trial"}
                {mode === "forgot" && "We'll send you a reset link"}
                {mode === "invite" && "Join your team on Avery"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name (Signup only) */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Acme Inc."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Signup only) */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Send Reset Link"}
                {mode === "invite" && "Accept & Continue"}
              </Button>
            </form>

            {/* Mode Switchers */}
            <div className="space-y-2 text-center text-sm">
              {mode === "signin" && (
                <>
                  <button
                    onClick={() => setMode("forgot")}
                    className="text-accent hover:underline block w-full"
                  >
                    Forgot password?
                  </button>
                  <div>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-accent hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {mode === "signup" && (
                <div>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("signin")}
                    className="text-accent hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {(mode === "forgot" || mode === "invite") && (
                <button
                  onClick={() => setMode("signin")}
                  className="text-accent hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </GlassmorphismCard>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to Avery's{" "}
          <button onClick={() => onNavigate("legal")} className="text-accent hover:underline">
            Terms of Service
          </button>{" "}
          and{" "}
          <button onClick={() => onNavigate("legal")} className="text-accent hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}
