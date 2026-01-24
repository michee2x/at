"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";
import GoogleLoginButton from "@/components/buttons/GoogleButton";
import AuthShowcase from "@/components/auth/AuthShowcase";

type SignupStep = "options" | "email";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "seller"]).default("customer"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  shopName: z.string().optional(),
  shopUrl: z.string().optional(),
});

function RegisterContent() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("options"); // options -> email
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleBack = () => {
    setStep("options");
    setFieldErrors({});
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const body = {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      role,
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      phone: String(fd.get("phone") || ""),
      shopName: String(fd.get("shopName") || ""),
      shopUrl: String(fd.get("shopUrl") || ""),
    };

    // Basic validation based on role
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      const newErrors: Record<string, string> = {};
      validated.error.issues.forEach((issue) => {
        newErrors[String(issue.path[0])] = issue.message;
      });
      
      // Custom validation for vendor fields
      if (role === 'seller') {
         if (!body.firstName) newErrors.firstName = "First Name is required";
         if (!body.lastName) newErrors.lastName = "Last Name is required";
         if (!body.shopName) newErrors.shopName = "Shop Name is required";
         if (!body.phone) newErrors.phone = "Phone Number is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        toast.error("Please fix the errors below.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.message || "Registration failed. Please try again.");
      } else {
        setSuccess(true);
        toast.success("Account created! Redirecting to login...");
        // Add success param to login url
        router.push("/login?registered=1");
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      console.error(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col-reverse lg:flex-row-reverse bg-white">
      {/* RIGHT SIDE - SIGNUP FORM */}
      <main className={`w-full lg:w-[480px] xl:w-[520px] flex-1 min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-12 bg-white relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[400px] mx-auto">
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

              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

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
              
              {/* Role Selection */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="customer" 
                    checked={role === "customer"} 
                    onChange={() => setRole("customer")}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">I am a customer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="seller" 
                    checked={role === "seller"} 
                    onChange={() => setRole("seller")}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">I am a vendor</span>
                </label>
              </div>

              {/* Vendor Specific Fields - Top */}
              {role === "seller" && (
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input name="firstName" required className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input name="lastName" required className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  required
                  className={`w-full h-11 px-4 bg-white border rounded-lg text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 ${
                    fieldErrors.email ? "border-red-400 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    className={`w-full h-11 px-4 pr-12 bg-white border rounded-lg text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 ${
                      fieldErrors.password ? "border-red-400 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>}
              </div>

               {/* Vendor Specific Fields - Bottom */}
               {role === "seller" && (
                <div className="space-y-4 pt-2">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                    <input name="shopName" required className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                    {fieldErrors.shopName && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.shopName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input name="phone" required className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop URL (Optional)</label>
                    <div className="flex items-center">
                       <span className="text-gray-500 text-xs mr-2">https://atlaze.com/store/</span>
                       <input name="shopUrl" placeholder="shop-slug" className="flex-1 h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                </div>
              )}

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
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" aria-hidden="true"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  role === 'seller' ? "Register as Vendor" : "Sign up"
                )}
              </button>

              {/* Terms */}
              <p className="text-center text-xs text-gray-400 pt-2">
                By clicking &quot;{role === 'seller' ? "Register as Vendor" : "Sign up"}&quot;, you agree to Atlaze&apos;s{" "}
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

      {/* LEFT SIDE - CREATIVE SHOWCASE */}
      <AuthShowcase step={step} />
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
