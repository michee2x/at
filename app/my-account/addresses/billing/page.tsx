"use client";

import { User, MapPin, Phone, Mail, Building2, Landmark, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getUserDetailsAction, updateUserAction } from "@/lib/actions/UserAction";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";

/* -------------------------------
   Reusable field wrappers (DRY)
-------------------------------- */

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

function IconInput({
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  icon: React.ElementType;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <Input className="pl-10 border-gray-400" {...props} />
    </div>
  );
}

/* -------------------------------
   Page
-------------------------------- */

export default function BillingAddressPage() {
  const NIGERIA_STATES = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const { session, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [billingSummary, setBillingSummary] = useState<{
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    phone?: string;
    email?: string;
  } | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    company: "",
    postcode: "",
    bank_name: "",
    bank_iban: "",
  });
  const [stateSearch, setStateSearch] = useState("");

  const filteredStates = NIGERIA_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Load existing billing data on mount
  useEffect(() => {
    async function loadBilling() {
      if (!session?.user?.id) return;
      try {
        const user = await getUserDetailsAction(Number(session.user.id));
        const billing = user.billing ?? {};

        setForm((prev) => ({
          ...prev,
          first_name: billing.first_name || "",
          last_name: billing.last_name || "",
          address_1: billing.address_1 || "",
          address_2: billing.address_2 || "",
          city: billing.city || "",
          state: billing.state || "",
          phone: billing.phone || "",
          email: billing.email || session.user.email || "",
          company: billing.company || "",
          postcode: billing.postcode || "",
        }));

        setBillingSummary({
          first_name: billing.first_name,
          last_name: billing.last_name,
          company: billing.company,
          address_1: billing.address_1,
          address_2: billing.address_2,
          city: billing.city,
          state: billing.state,
          postcode: billing.postcode,
          country: billing.country,
          phone: billing.phone,
          email: billing.email || session.user.email || "",
        });
      } catch (err) {
        console.error("Failed to load billing address", err);
      }
    }

    loadBilling();
  }, [session]);

  function handleChange(
    field:
      | "first_name"
      | "last_name"
      | "address_1"
      | "address_2"
      | "city"
      | "state"
      | "phone"
      | "email"
      | "company"
      | "postcode"
      | "bank_name"
      | "bank_iban",
    value: string
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserAction(Number(session.user.id), {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        address_1: form.address_1,
        address_2: form.address_2,
        city: form.city,
        state: form.state,
        postcode: form.postcode,
        country: "NG",
      });

      setSuccess("Billing address updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });

      setBillingSummary({
        first_name: form.first_name,
        last_name: form.last_name,
        company: form.company,
        address_1: form.address_1,
        address_2: form.address_2,
        city: form.city,
        state: form.state,
        postcode: form.postcode,
        country: "Nigeria",
        phone: form.phone,
        email: form.email,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update billing address. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl relative">
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
          Billing address
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          This address will be used by default during checkout.
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

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="First name" required>
            <IconInput
              icon={User}
              placeholder="Michael"
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Field>

          <Field label="Last name" required>
            <IconInput
              icon={User}
              placeholder="Israel"
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Field>
        </div>

        {/* Country */}
        <Field label="Country / Region" required>
          <Input value="Nigeria" disabled />
        </Field>

        {/* Street */}
        <div className="space-y-4">
          <Field label="Street address" required>
            <IconInput
              icon={MapPin}
              placeholder="House number and street name"
              value={form.address_1}
              onChange={(e) => handleChange("address_1", e.target.value)}
            />
          </Field>

          <Input
            placeholder="Apartment, suite, unit, etc. (optional)"
            value={form.address_2}
            onChange={(e) => handleChange("address_2", e.target.value)}
            className="border-gray-400"
          />
        </div>

        {/* City */}
        <Field label="Town / City" required>
          <Input
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="border-gray-400"
          />
        </Field>

        {/* State */}
        <Field label="State" required>
          <Select
            value={form.state}
            onValueChange={(value) => handleChange("state", value)}
          >
            <SelectTrigger className="w-full border-gray-400">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent className="border-gray-400">
              <div className="px-2 pb-2">
                <Input
                  placeholder="Search state..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="h-8 border-gray-400"
                />
              </div>
              {filteredStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Phone */}
        <Field label="Phone (optional)">
          <IconInput
            icon={Phone}
            placeholder="08000000000"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Field>

        {/* Email */}
        <Field label="Email address" required>
          <IconInput
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Field>

        {/* Company */}
        <Field label="Company (DEV/ID Number) (optional)">
          <IconInput
            icon={Building2}
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
          />
        </Field>

        {/* VAT */}
        <Field label="VAT / TAX Number (optional)">
          <IconInput
            icon={Landmark}
            value={form.bank_iban}
            onChange={(e) => handleChange("bank_iban", e.target.value)}
          />
        </Field>

        {/* Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Name of Bank (optional)">
            <IconInput
              icon={CreditCard}
              value={form.bank_name}
              onChange={(e) => handleChange("bank_name", e.target.value)}
            />
          </Field>

          <Field label="Bank IBAN (optional)">
            <Input className="border-gray-400" />
          </Field>
        </div>

        {/* Actions */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#6a00f3] hover:bg-[#5a00d0] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save address"}
          </Button>
        </div>
      </form>

      {/* Billing summary */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-medium text-gray-900 mb-3">
          Saved billing address
        </h2>
        {!billingSummary ||
        !(
          billingSummary.first_name ||
          billingSummary.last_name ||
          billingSummary.address_1 ||
          billingSummary.city ||
          billingSummary.state ||
          billingSummary.postcode
        ) ? (
          <p className="text-sm text-gray-500 italic">
            You have not set up this type of address yet.
          </p>
        ) : (
          <div className="text-sm text-gray-700 space-y-1 leading-relaxed">
            {[
              [billingSummary.first_name, billingSummary.last_name]
                .filter(Boolean)
                .join(" "),
              billingSummary.company,
              billingSummary.address_1,
              billingSummary.address_2,
              [billingSummary.city, billingSummary.state, billingSummary.postcode]
                .filter(Boolean)
                .join(", "),
              billingSummary.country,
              billingSummary.phone && `Phone: ${billingSummary.phone}`,
              billingSummary.email && `Email: ${billingSummary.email}`,
            ]
              .filter(Boolean)
              .map((line) => String(line))
              .map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
