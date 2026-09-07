"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (isSignUp) {
      router.push("/profile");
    } else {
      router.push("/");
    }
  };

  const isValid = email && password && (!isSignUp || name);

  return (
    <div className="screen px-6 pt-12 pb-8 flex flex-col">
      {/* Hero */}
      <div className="mb-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)" }}
        >
          <span style={{ fontSize: 28 }}>⚖️</span>
        </div>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#1A1A3E" }}>
          Balanceiaga
        </h1>
        <p className="text-sm" style={{ color: "#8B8FB5" }}>
          {isSignUp ? "Create your account to get started." : "Welcome back. Let's balance your week."}
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col" style={{ gap: 14 }}>
        {/* Name — sign up only */}
        {isSignUp && (
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>
              YOUR NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Andrew Mike"
              className="w-full text-sm font-medium outline-none placeholder:text-gray-300"
              style={{ color: "#1A1A3E", background: "transparent" }}
            />
          </div>
        )}

        {/* Email */}
        <div className="card" style={{ marginBottom: 0 }}>
          <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>
            EMAIL
          </label>
          <div className="flex items-center gap-2">
            <Mail size={15} color="#B0B3D6" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="flex-1 text-sm font-medium outline-none placeholder:text-gray-300"
              style={{ color: "#1A1A3E", background: "transparent" }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="card" style={{ marginBottom: 0 }}>
          <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>
            PASSWORD
          </label>
          <div className="flex items-center gap-2">
            <Lock size={15} color="#B0B3D6" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 text-sm font-medium outline-none placeholder:text-gray-300"
              style={{ color: "#1A1A3E", background: "transparent" }}
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword
                ? <EyeOff size={15} color="#B0B3D6" />
                : <Eye size={15} color="#B0B3D6" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base mt-2"
          style={{
            background: isValid ? "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)" : "#E5E7EB",
            color: isValid ? "white" : "#9CA3AF",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          {isSignUp ? "Create Account" : "Sign In"}
          <ArrowRight size={18} />
        </button>

        {/* Toggle */}
        <p className="text-center text-sm" style={{ color: "#8B8FB5" }}>
          {isSignUp ? "Already have an account? " : "New here? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold"
            style={{ color: "#6C63FF" }}
          >
            {isSignUp ? "Sign In" : "Create Account"}
          </button>
        </p>
      </div>

      {/* Skip */}
      <div className="mt-auto pt-6 text-center">
        <button
          onClick={() => router.push("/")}
          className="text-xs"
          style={{ color: "#B0B3D6" }}
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}
