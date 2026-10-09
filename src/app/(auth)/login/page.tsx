"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon as Eye, EyeOffIcon as EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/login/", { email, password });
      const { access, user } = response.data;
      login(user, access);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop" 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-white font-heading text-5xl tracking-tight leading-tight">
            Welcome<br />back.
          </h2>
          <p className="text-white/70 text-sm mt-3 max-w-sm">
            Sign in to access your account, track orders, and enjoy a personalized shopping experience.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center px-8 lg:px-20 py-16 bg-background">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="font-heading text-xl tracking-[0.3em] uppercase mb-12 block cursor-pointer hover:opacity-70 transition-opacity">
            BURHANI
          </Link>
          
          <h1 className="font-heading text-4xl tracking-tight mb-2">Sign In</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Enter your email and password to access your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline cursor-pointer">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-none font-semibold uppercase tracking-widest text-sm cursor-pointer" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-foreground font-semibold hover:text-primary transition-colors cursor-pointer">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
