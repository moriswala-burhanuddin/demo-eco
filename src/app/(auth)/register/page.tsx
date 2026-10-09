"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon as Eye, EyeOffIcon as EyeOff, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // OTP Input Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus last filled input
      const focusIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/users/register/send-otp/", {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
        setError("Please enter the complete 6-digit code.");
        return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/register/verify-otp/", {
        email,
        otp: otpString
      });
      const { access, user } = response.data;
      if (access && user) {
          login(user, access);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Verification failed. Please try again or request a new code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image (Matches Login Page) */}
      <div className="hidden lg:block relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop" 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover scale-[1.02] transform transition-transform duration-[20s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-white font-heading text-5xl tracking-tight leading-tight mb-4">
            Join the<br />movement.
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
                <CheckCircle2 className="w-5 h-5 mb-2 opacity-80" />
                <h4 className="font-bold text-sm">Exclusive Offers</h4>
                <p className="text-xs opacity-70 mt-1">Get access to member-only discounts and early drops.</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
                <CheckCircle2 className="w-5 h-5 mb-2 opacity-80" />
                <h4 className="font-bold text-sm">Fast Checkout</h4>
                <p className="text-xs opacity-70 mt-1">Save your details for a seamless shopping experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center px-8 lg:px-20 py-16 bg-background">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="font-heading text-xl tracking-[0.3em] uppercase mb-12 block cursor-pointer hover:opacity-70 transition-opacity">
            BURHANI
          </Link>
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="font-heading text-4xl tracking-tight mb-2">Create Account</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Enter your details below to create your account and get started.
                </p>

                <form onSubmit={handleSendOTP} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="h-12 rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary bg-secondary/30"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="h-12 rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary bg-secondary/30"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary bg-secondary/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                        <div className="relative">
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary bg-secondary/30 pr-10"
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
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-3">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full h-14 rounded-none font-bold uppercase tracking-widest text-sm cursor-pointer mt-4" 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Continue <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </form>

                <p className="text-sm text-muted-foreground text-center mt-10">
                    Already have an account?{' '}
                    <Link href="/login" className="text-foreground font-bold hover:text-primary transition-colors cursor-pointer border-b border-foreground pb-0.5">
                        Sign In
                    </Link>
                </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6" />
                </div>
                <h1 className="font-heading text-4xl tracking-tight mb-2">Check your email</h1>
                <p className="text-muted-foreground text-sm mb-10">
                    We've sent a 6-digit secure verification code to <span className="font-bold text-foreground">{email}</span>. Please enter it below to complete your registration.
                </p>

                <form onSubmit={handleVerifyOTP} className="space-y-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Code</Label>
                        <div className="flex gap-2 justify-between">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6} // Allow pasting full code
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-xl font-bold rounded-none border-border focus-visible:ring-2 focus-visible:ring-primary bg-secondary/30"
                                />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-3">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button 
                            type="submit" 
                            className="w-full h-14 rounded-none font-bold uppercase tracking-widest text-sm cursor-pointer" 
                            disabled={loading || otp.join("").length !== 6}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </span>
                            ) : "Verify & Login"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline"
                            className="w-full h-14 rounded-none font-bold uppercase tracking-widest text-sm cursor-pointer border-border" 
                            onClick={() => setStep(1)} 
                            disabled={loading}
                        >
                            Back to Registration
                        </Button>
                    </div>
                </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
