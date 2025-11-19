"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // show/hide password
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    const fd = new FormData(e.currentTarget);
    const body = {
      email: String(fd.get("email") || ""),
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      username: String(fd.get("username") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
    };

    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      const newErrors: any = {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      };

      validated.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });

      setFieldErrors(newErrors);
      setError("Please fix the errors below.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          username: body.username || undefined,
          password: body.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.message || "Registration failed");
      } else {
        setSuccess(true);
        window.location.href = "/login?registered=1";
        return;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen mx-auto p-4 lg:p-0 font-poppins lg:pr-10 h-screen lg:gap-10 flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="flex-1 lg:flex hidden relative h-full w-full bg-blue-600">
        <Image
          src="/banner/stunning-young-woman-with-voluminous-curly-hairstyle-elegant-costume-posing.jpg"
          className="object-cover object-center"
          fill
          alt="african woman"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col items-center bg-white p-8 rounded-lg border border-gray-300"
      >
        <div className="w-fit mb-4 flex items-center gap-0.5">
          <div className="lg:size-[2rem] size-[1.8rem] relative">
            <Image
              className="object-cover"
              fill
              alt="atlaze-logo"
              src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
            />
          </div>
          <h1 className="font-display text-2xl lg:text-3xl italic text-[#2B2B2B] tracking-tight">
            atlaze
          </h1>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Create your account</h2>

        {/* Email */}
        <div className="w-full mb-3">
          <input
            name="email"
            placeholder="Email"
            className={`w-full p-2 rounded border ${
              fieldErrors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Username */}
        <div className="w-full mb-3">
          <input
            name="username"
            placeholder="Username (optional)"
            className={`w-full p-2 rounded border ${
              fieldErrors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="w-full mb-3 relative">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={`w-full p-2 pr-12 rounded border ${
              fieldErrors.password ? "border-red-500" : "border-gray-300"
            }`}
          />

          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800 transition p-2"
          >
            {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>

          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="w-full mb-3 relative">
          <input
            type={showConfirmPass ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            className={`w-full p-2 pr-12 rounded border ${
              fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />

          <span
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800 transition p-2"
          >
            {showConfirmPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>

          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Error + Success */}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && (
          <p className="text-green-600 mb-2">Account created! Redirecting…</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating…
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-sm mt-10 text-muted">
          Already have an account?{" "}
          <Link className="text-primary hover:underline" href="/login">
            login
          </Link>
        </p>
      </form>
    </div>
  );
}
