"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token found.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
          // Optional: Redirect to login after a delay
          // setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may have expired.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred. Please try again later.");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center space-y-6">
        {/* ICON */}
        <div className="flex justify-center">
          {status === "loading" && (
            <FaSpinner className="w-16 h-16 text-indigo-500 animate-spin" />
          )}
          {status === "success" && (
            <FaCheckCircle className="w-16 h-16 text-green-500" />
          )}
          {status === "error" && (
            <FaTimesCircle className="w-16 h-16 text-red-500" />
          )}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-900">
          {status === "loading" && "Verifying Email"}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 text-lg">{message}</p>

        {/* BUTTONS */}
        <div className="pt-4">
          {status === "loading" && (
            <p className="text-sm text-gray-400">Please wait while we confirm your email.</p>
          )}

          {status === "success" && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              Go to Login
            </Link>
          )}

          {status === "error" && (
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
            >
              Contact Support
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
