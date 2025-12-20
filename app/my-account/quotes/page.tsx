"use client";

import { useState, useEffect } from "react";
import { FileText, Package, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";

interface QuoteRequest {
  id: string;
  productName: string;
  quantity: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status: string) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status as keyof typeof styles] || styles.pending
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function QuotesPage() {
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    message: "",
  });

  // Load quotes from localStorage (temporary until backend is ready)
  useEffect(() => {
    const saved = localStorage.getItem("atlaze_quotes");
    if (saved) {
      try {
        setQuotes(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  function handleChange(
    field: "productName" | "quantity" | "message",
    value: string
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("Please log in to request a quote");
      return;
    }

    if (!form.productName.trim() || !form.quantity.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newQuote: QuoteRequest = {
        id: `quote_${Date.now()}`,
        productName: form.productName.trim(),
        quantity: parseInt(form.quantity, 10) || 1,
        message: form.message.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const updated = [newQuote, ...quotes];
      setQuotes(updated);
      localStorage.setItem("atlaze_quotes", JSON.stringify(updated));

      setSuccess("Quote request submitted successfully! We'll review it and get back to you soon.");
      setForm({ productName: "", quantity: "", message: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit quote request. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[50vh]">
      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
          <div className="w-32 h-32">
            <AtlazeLoader />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Request Quotes
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Request custom pricing for bulk orders or wholesale purchases. Our team
          will review your request and provide a personalized quote.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Request Form */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#6a00f3]" />
          <h2 className="text-lg font-semibold text-gray-900">
            New Quote Request
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Product name" required>
            <div className="relative">
              <Package className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 border-gray-400"
                placeholder="Enter product name or SKU"
                value={form.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </Field>

          <Field label="Quantity" required>
            <Input
              type="number"
              min="1"
              className="border-gray-400"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              disabled={isSubmitting}
            />
          </Field>

          <Field label="Additional message (optional)">
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea
                className="pl-10 border-gray-400 min-h-[100px] resize-none"
                placeholder="Tell us about your requirements, delivery timeline, or any special requests..."
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </Field>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6a00f3] hover:bg-[#5a00d0] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>

      {/* Quote Requests Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Quote Requests
          </h2>
        </div>

        {quotes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-base font-medium text-gray-900 mb-2">
              No quote requests yet
            </p>
            <p className="text-sm text-gray-500">
              Submit your first quote request above to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Requested
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.productName}
                      </div>
                      {quote.message && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {quote.message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {quote.quantity}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(quote.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(quote.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
        <p className="mb-1 font-medium text-gray-800">
          How quote requests work
        </p>
        <p>
          After submitting a quote request, our team will review it and contact
          you within 1-2 business days with a personalized quote. You can track
          the status of your requests in the table above.
        </p>
      </div>
    </div>
  );
}
