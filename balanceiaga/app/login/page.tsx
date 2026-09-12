"use client";
import { useRouter } from "next/navigation";
import { User, Lock, EyeOff } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Neumorphic colors
  const bg = "#F4F6FA";
  const shadowCard = "10px 10px 30px #dce1eb, -10px -10px 30px #ffffff";
  const shadowBtn = "6px 6px 16px #dce1eb, -6px -6px 16px #ffffff";
  const shadowInput = "inset 4px 4px 8px #dce1eb, inset -4px -4px 8px #ffffff";

  const handleLogin = () => {
    login();
    router.push("/preferences");
  };

  return (
    <div className="screen flex flex-col items-center justify-center px-10" style={{ background: bg, minHeight: "100vh" }}>

      {/* Logo Block */}
      <div
        className="w-[110px] h-[110px] rounded-3xl flex items-center justify-center mb-8"
        style={{ background: bg, boxShadow: shadowCard }}
      >
        <img 
          src="/logo.png" 
          alt="Balanceiaga Logo" 
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>

      {/* Header Text */}
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-extrabold mb-2" style={{ color: "#1E2022", margin: "10px" }}>Welcome Back</h1>
        <p className="text-sm font-medium" style={{ color: "#9CA3AF", margin: "20px" }}>Login to continue to your account</p>
      </div>

      {/* Form Card */}
      <div
        className="w-full max-w-sm rounded-[32px] p-8 flex flex-col"
        style={{ background: bg, boxShadow: shadowCard }}
      >
        {/* Email Input */}
        <div
          className="w-xs mx-auto rounded-[20px] flex items-center mb-6"
          style={{ background: bg, boxShadow: shadowInput, padding: "25px 24px", margin: "10px auto" }}
        >
          <User size={20} color="#A0A5B1" className="mr-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Email or Username"
            className="flex-1 bg-transparent outline-none text-base font-semibold placeholder:text-[#A0A5B1]"
            style={{ color: "#1E2022" }}
          />
        </div>

        {/* Password Input */}
        <div
          className="w-xs mx-auto rounded-[20px] flex items-center mb-4"
          style={{ background: bg, boxShadow: shadowInput, padding: "25px 24px", margin: "10px auto" }}
        >
          <Lock size={20} color="#A0A5B1" className="mr-4 flex-shrink-0" />
          <input
            type="password"
            placeholder="Password"
            className="flex-1 bg-transparent outline-none text-base font-semibold placeholder:text-[#A0A5B1]"
            style={{ color: "#1E2022" }}
          />
          <EyeOff size={20} color="#A0A5B1" className="ml-3 flex-shrink-0 cursor-pointer" />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-8">
          <button className="text-sm font-bold transition-opacity hover:opacity-80" style={{ color: "#7C3AED", margin: "10px" }}>
            Forgot Password?
          </button>
        </div>

        {/* Login Button (Routes to Profile) */}
        <button
          onClick={handleLogin}
          className="w-xs mx-auto py-5 rounded-[22px] font-bold text-lg text-white transition-transform active:scale-95"
          style={{
            background: "linear-gradient(90deg, #7C3AED 0%, #4F46E5 100%)",
            boxShadow: "0 10px 24px rgba(99, 102, 241, 0.4)",
            margin: "auto"
          }}
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
          <span className="text-[12px] font-bold tracking-wider" style={{ color: "#B0B5C1", margin: "10px" }}>
            OR CONTINUE WITH
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
        </div>

        {/* Social Logins */}
        <div className="flex items-center justify-center gap-5">
          {/* Google */}
          <button
            className="w-[54px] h-[54px] rounded-full flex items-center justify-center transition-transform active:scale-95"
            style={{ background: bg, boxShadow: shadowBtn }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>

          {/* Apple */}
          <button
            className="w-[54px] h-[54px] rounded-full flex items-center justify-center transition-transform active:scale-95"
            style={{ background: bg, boxShadow: shadowBtn }}
          >
            <svg width="24" height="24" viewBox="0 0 170 170" fill="#1E2022">
              <path d="M117.84,93.63c-0.21-16.14,13.18-23.86,13.78-24.23c-7.48-10.95-19.14-12.45-23.36-12.63 c-9.92-1.02-19.41,5.82-24.43,5.82c-4.99,0-12.87-5.69-21.2-5.52c-10.87,0.18-20.91,6.33-26.46,15.97 c-11.23,19.47-2.87,48.33,8.08,64.15c5.34,7.74,11.59,16.37,19.82,16.05c7.96-0.34,10.98-5.17,20.61-5.17 c9.6,0,12.39,5.17,20.76,5.01c8.53-0.16,13.9-7.81,19.2-15.58c6.12-8.94,8.64-17.58,8.78-18.02 C133.24,119.04,118.08,113.31,117.84,93.63 M112.55,30.31c4.37-5.28,7.31-12.63,6.51-19.98c-6.33,0.25-14.15,4.21-18.66,9.47 c-3.99,4.68-7.53,12.2-6.58,19.38C100.89,39.73,108.18,35.6,112.55,30.31" />
            </svg>
          </button>

          {/* Facebook */}
          <button
            className="w-[54px] h-[54px] rounded-full flex items-center justify-center transition-transform active:scale-95"
            style={{ background: bg, boxShadow: shadowBtn }}

          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm font-semibold mt-10 mb-2" style={{ color: "#A0A5B1", margin: "10px" }}>
          Don&apos;t have an account? <span style={{ color: "#7C3AED", cursor: "pointer" }}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
