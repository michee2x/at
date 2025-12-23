"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";
import GoogleLoginButton from "@/components/buttons/GoogleButton";

type FieldErrors = {
  email: string;
  password: string;
};

type SignupStep = "options" | "email";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function RegisterContent() {
  const [step, setStep] = useState<SignupStep>("options");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: "",
    password: "",
  });

  const handleBack = () => {
    setStep("options");
    setFieldErrors({ email: "", password: "" });
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({ email: "", password: "" });

    const fd = new FormData(e.currentTarget);
    const body = {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    };

    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      const newErrors: FieldErrors = { email: "", password: "" };
      validated.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field in newErrors) {
          newErrors[field as keyof FieldErrors] = issue.message;
        }
      });
      setFieldErrors(newErrors);
      toast.error("Please fix the errors below.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.message || "Registration failed. Please try again.");
      } else {
        setSuccess(true);
        window.location.href = "/login?registered=1";
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex flex-col-reverse lg:flex-row-reverse overflow-hidden bg-white">
      {/* RIGHT SIDE - SIGNUP FORM */}
      {/* RIGHT SIDE - SIGNUP FORM */}
      <main className="w-full lg:w-[480px] xl:w-[520px] flex-1 lg:h-screen flex flex-col justify-start pt-8 lg:justify-center px-6 sm:px-10 lg:px-12 pb-8 bg-white relative rounded-t-[30px] -mt-10 lg:mt-0 z-10 lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
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
              Create an account
            </h1>
          </div>

          {/* STEP: OPTIONS */}
          {step === "options" && (
            <div className="space-y-4">
              {/* Google Sign Up */}
              <GoogleLoginButton type="signup" />

              {/* Continue with Email */}
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <HiOutlineMail className="w-5 h-5" />
                Continue with email
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-500 pt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline underline-offset-2"
                >
                  Log in
                </Link>
              </p>
            </div>
          )}

          {/* STEP: EMAIL FORM */}
          {step === "email" && (
            <form onSubmit={handleSubmit} aria-label="Sign up form" className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`w-full h-11 px-4 bg-white border rounded-lg text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 ${
                    fieldErrors.email
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1.5" role="alert">
                    {fieldErrors.email}
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
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder=""
                    autoComplete="new-password"
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
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="text-red-500 text-xs mt-1.5" role="alert">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Error + Success */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm">Account created! Redirecting…</p>
              )}

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
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </button>

              {/* Terms */}
              <p className="text-center text-xs text-gray-400 pt-2">
                By clicking &quot;Sign up&quot;, you agree to Atlaze&apos;s{" "}
                <Link href="/terms" className="text-indigo-600 hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-500 pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline underline-offset-2"
                >
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>

      {/* LEFT SIDE - ILLUSTRATION */}
      <div className="relative w-full h-[35vh] lg:h-auto lg:flex-1 shrink-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
        <Image
          src="/auth/african_wildlife.png"
          className="object-cover"
          fill
          alt="African wildlife illustration"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
