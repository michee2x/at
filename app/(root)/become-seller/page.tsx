"use client";

import { useState } from "react";
import { TrendingUp, Zap, Shield, Users, DollarSign, BarChart3, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function BecomeSellerPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    category: ""
  });

  const benefits = [
    { icon: Users, title: "Reach Millions", description: "Access our growing customer base" },
    { icon: Zap, title: "Easy Setup", description: "Get started in less than 24 hours" },
    { icon: BarChart3, title: "Powerful Tools", description: "Advanced analytics dashboard" },
    { icon: DollarSign, title: "Low Fees", description: "Competitive commission rates" },
    { icon: Shield, title: "Secure Payments", description: "Fast payment processing" },
    { icon: TrendingUp, title: "Grow Sales", description: "Marketing support included" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Application submitted! We'll review it and get back to you within 2-3 business days.");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Split Layout */}
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Left Side - Information */}
        <div className="bg-gray-50 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-xl">
            <Breadcrumbs items={[{ label: "Become a Seller" }]} />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Start Selling on Atlaze
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Join thousands of successful sellers and grow your business with Nigeria&apos;s leading e-commerce platform. Get access to powerful tools, secure payments, and millions of customers.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-[#6a00f3]">50K+</div>
                <div className="text-sm text-gray-600">Active Sellers</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-[#6a00f3]">2M+</div>
                <div className="text-sm text-gray-600">Monthly Customers</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-[#6a00f3]">₦500M+</div>
                <div className="text-sm text-gray-600">Monthly Sales</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-[#6a00f3]">4.8/5</div>
                <div className="text-sm text-gray-600">Seller Rating</div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Why Sell with Us?</h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <benefit.icon className="w-5 h-5 text-[#6a00f3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Application Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Apply Now
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out the form and we&apos;ll get back to you within 2-3 business days
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <Input
                  required
                  placeholder="Your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <Input
                  required
                  placeholder="Your full name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                  <SelectTrigger className="border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Registered Company</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Category *
                </label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="beauty">Beauty & Health</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-base bg-[#6a00f3] hover:bg-[#5a00d3] text-white font-semibold"
              >
                Submit Application
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            {/* Help Link */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <a href="#" className="flex items-center justify-center gap-2 text-sm font-medium text-[#6a00f3] hover:text-[#5a00d3]">
                Have questions? Contact Seller Support
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
