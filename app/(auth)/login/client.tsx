"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import GoogleLoginButton from "@/components/buttons/GoogleButton";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";

// Zod schema for credentials
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(3, "Password must be at least 3 characters."),
});

type LoginStep = "options" | "email";

export default function ClientPage() {
  const [step, setStep] = useState<LoginStep>("options");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  // Get session data
  const { data: session } = useSession();

  // If there is an active session, redirect to dashboard
  useEffect(() => {
    if (session) {
      window.location.href = "/my-account";
    }
  }, [session]);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/my-account";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({ username: "", password: "" });

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    const validated = loginSchema.safeParse({ username, password });
    if (!validated.success) {
      setLoading(false);

      const newErrors = { username: "", password: "" };
      validated.error.issues.forEach((issue) => {
        if (issue.path[0] === "username") newErrors.username = issue.message;
        if (issue.path[0] === "password") newErrors.password = issue.message;
      });

      setFieldErrors(newErrors);
      toast.error("Please fix the errors below.");
      return;
    }

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      window.location.href = callbackUrl;
    }
  }

  const handleBack = () => {
    setStep("options");
    setFieldErrors({ username: "", password: "" });
  };

  return (
    <div className="h-screen w-full flex flex-row-reverse overflow-hidden">
      {/* LEFT SIDE - LOGIN FORM */}
      <main className="w-full lg:w-[480px] xl:w-[520px] h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8 bg-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
        
        <div className="relative z-10 w-full max-w-[380px] mx-auto">
          {/* Back Button - Only show on email step */}
          {step === "email" && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors group"
            >
              <IoChevronBack className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </button>
          )}

          {/* Logo & Branding */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="size-10 relative">
              <Image
                className="object-contain"
                fill
                alt="Atlaze logo"
                src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
              Log in
            </h1>
          </div>

          {/* STEP: OPTIONS */}
          {step === "options" && (
            <div className="space-y-4">
              {/* Google Login */}
              <GoogleLoginButton />

              {/* Continue with Email */}
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <HiOutlineMail className="w-5 h-5" />
                Continue with email
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-500 pt-6">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline underline-offset-2"
                >
                  Sign up
                </Link>
              </p>
            </div>
          )}

          {/* STEP: EMAIL FORM */}
          {step === "email" && (
            <form onSubmit={handleSubmit} aria-label="Login form" className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="you@example.com"
                  autoComplete="username"
                  autoFocus
                  aria-invalid={!!fieldErrors.username}
                  aria-describedby={fieldErrors.username ? "username-error" : undefined}
                  className={`w-full h-11 px-4 bg-white border rounded-lg text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 ${
                    fieldErrors.username
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {fieldErrors.username && (
                  <p id="username-error" className="text-red-500 text-xs mt-1.5" role="alert">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=""
                    autoComplete="current-password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    className={`w-full h-11 px-4 pr-12 bg-white border rounded-lg text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 ${
                      fieldErrors.password
                        ? "border-red-400 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="text-red-500 text-xs mt-1.5" role="alert">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Stay logged in */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Stay logged in</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" aria-hidden="true"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Log in"
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center pt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline underline-offset-2"
                >
                  I forgot my password
                </Link>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-500 pt-4">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline underline-offset-2"
                >
                  Sign up
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>

      {/* RIGHT SIDE - ILLUSTRATION */}
      <div className="hidden lg:block flex-1 relative bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
        <Image
          src="/auth/african_wildlife.png"
          className="object-cover hidde"
          fill
          alt="African wildlife illustration"
          priority
        />
        {/* Optional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}
