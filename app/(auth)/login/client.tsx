"use client";

export const dynamic = "force-dynamic"; // <- this prevents prerendering

import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import GoogleLoginButton from "@/components/buttons/GoogleButton";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(3, "Password must be at least 3 characters."),
});

export default function  ClientPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
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
      setError("Please fix the errors below.");
      return;
    }

    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl,
    });

    setLoading(false);
  }

  return (
    <div className="w-screen mx-auto p-4 lg:p-0 font-poppins lg:pr-10 h-screen lg:gap-10 flex items-center justify-center bg-gray-100 text-gray-900">
      {/* LEFT IMAGE (large screens only) */}
      <div className="hidden lg:flex flex-1 relative h-full w-full bg-blue-600">
        <Image
          src="/banner/stunning-young-woman-with-voluminous-curly-hairstyle-elegant-costume-posing.jpg"
          className="object-cover object-center"
          fill
          alt="african woman"
        />
      </div>

      {/* LOGIN FORM */}
      <form
        className="w-full max-w-md flex flex-col items-center bg-white p-8 rounded-lg border border-gray-300 shadow-sm"
        onSubmit={handleSubmit}
      >
        {/* Logo */}
        <div className="w-fit flex items-center gap-1">
          <div className="size-8 lg:size-10 relative">
            <Image
              className="object-cover"
              fill
              alt="atlaze-logo"
              src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
            />
          </div>
          <h1 className="font-display text-2xl lg:text-3xl italic tracking-tight text-[#2B2B2B]">
            atlaze
          </h1>
        </div>

        <h1 className="text-xl lg:text-2xl font-semibold mt-4 mb-6 text-center">
          Log into your account
        </h1>

        {/* Google Button */}
        <div className="my-6 w-full">
          <GoogleLoginButton />
        </div>

        {/* USERNAME FIELD */}
        <div className="w-full mb-4">
          <input
            className={`w-full p-2 bg-gray-100 border rounded text-sm lg:text-base ${
              fieldErrors.username ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            name="username"
            placeholder="Email or Username"
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
          )}
        </div>

        {/* PASSWORD FIELD */}
        <div className="w-full relative mb-4">
          <input
            className={`w-full p-2 bg-gray-100 border rounded pr-12 text-sm lg:text-base ${
              fieldErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
          />

          {/* EYE ICON */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                       text-gray-500 hover:text-gray-800 transition p-2"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>

          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* FORGOT PASSWORD */}
        <div className="w-full text-right mb-4">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 font-semibold rounded hover:bg-blue-500 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Loading…
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* SIGN UP NAV */}
        <p className="text-sm mt-10 text-muted text-center">
          Don&apos;t have an account?{" "}
          <Link className="text-primary hover:underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
