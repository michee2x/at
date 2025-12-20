"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Check,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AccountDetailsForm = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "dave@gmail.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    //dont use "any" type
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to change password";
      }

      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setSuccess(true);

    // Reset password fields after successful update
    if (formData.newPassword) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-orange-500" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6a00f3] via-[#6a00f3] to-purple-600 p-8 md:p-12 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                Account Settings
              </h1>
            </div>
            <p className="text-blue-100 text-[14px] lg:text-lg max-w-2xl">
              Manage your account details and security settings. Your
              information is displayed in the account section and reviews.
            </p>
          </div>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              Your account details have been updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Information Card */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <CardTitle>Account Information</CardTitle>
                </div>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="displayName"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="Enter your display name"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleChange("displayName", e.target.value)
                    }
                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This name will appear in reviews and your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`h-11 transition-all focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-sm text-red-600 flex items-center gap-1 mt-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Preview Card */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <CardTitle>Security Status</CardTitle>
                </div>
                <CardDescription>
                  Your account security overview
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm font-medium">Email Verified</span>
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-semibold">Verified</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm font-medium">Password Status</span>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-semibold">Protected</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      2 days ago
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Security Tip:</strong> Use a strong password with at
                    least 8 characters, including uppercase, lowercase, numbers,
                    and special characters.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Password Change Section */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <CardTitle>Password Change</CardTitle>
              </div>
              <CardDescription>
                Leave blank to keep your current password
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5 md:col-span-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-semibold"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          handleChange("currentPassword", e.target.value)
                        }
                        className={`h-11 pr-10 transition-all focus:ring-2 focus:ring-blue-500 ${
                          errors.currentPassword
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        aria-invalid={!!errors.currentPassword}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPasswords.current
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-semibold"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                      className={`h-11 pr-10 transition-all focus:ring-2 focus:ring-blue-500 ${
                        errors.newPassword
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      aria-invalid={!!errors.newPassword}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPasswords.new ? "Hide password" : "Show password"
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.newPassword && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              i <= passwordStrength.strength
                                ? passwordStrength.color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          passwordStrength.strength >= 3
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.newPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      className={`h-11 pr-10 transition-all focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPasswords.confirm
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.newPassword === formData.confirmPassword && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Passwords match
                      </p>
                    )}
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-8"
              onClick={() => {
                setFormData({
                  displayName: "",
                  email: "dave@gmail.com",
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setErrors({});
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountDetailsForm;
