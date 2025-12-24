"use client";

import { useState } from "react";
import { Search, HelpCircle, MessageCircle, Mail, Phone, Package, Truck, RotateCcw, User, CreditCard, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'Orders' section. You'll find real-time tracking information for all your purchases. Alternatively, check your email for the tracking link sent when your order shipped."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused and in original packaging. To initiate a return, go to your account dashboard, select the order, and click 'Request Return'. Refunds are processed within 5-7 business days after we receive your return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within Nigeria. Express shipping is available for 1-2 day delivery. International orders typically arrive within 7-14 business days. You'll receive a tracking number once your order ships."
    },
    {
      question: "Can I change or cancel my order?",
      answer: "Orders can be modified or cancelled within 2 hours of placement. After that, the order enters our fulfillment process. Contact our support team immediately if you need to make changes, and we'll do our best to help."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, Verve), bank transfers, and mobile money payments. All transactions are secured with industry-standard encryption to protect your information."
    },
    {
      question: "How do I become a wholesale customer?",
      answer: "Visit your account dashboard and click on 'Become a Wholesale Customer'. Fill out the application form with your business details. Our team will review your application within 2-3 business days and contact you with next steps."
    }
  ];

  const helpCategories = [
    { title: "Orders & Tracking", icon: Package, desc: "Track orders, view history" },
    { title: "Shipping & Delivery", icon: Truck, desc: "Delivery times, shipping costs" },
    { title: "Returns & Refunds", icon: RotateCcw, desc: "Return policy, refund status" },
    { title: "Account Settings", icon: User, desc: "Profile, password, preferences" },
    { title: "Payments & Billing", icon: CreditCard, desc: "Payment methods, invoices" },
    { title: "Products & Stock", icon: HelpCircle, desc: "Availability, specifications" }
  ];

  const contactOptions = [
    { title: "Live Chat", icon: MessageCircle, desc: "Chat with our team", action: "Start chat" },
    { title: "Email Us", icon: Mail, desc: "support@atlaze.com", action: "Send email" },
    { title: "Call Us", icon: Phone, desc: "+234 800 123 4567", action: "Call now" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[{ label: "Help Center" }]} />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-gray-600 mb-6">
              Search our knowledge base or get in touch with our support team
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Options */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactOptions.map(({ title, icon: Icon, desc, action }) => (
              <button
                key={title}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#6a00f3] transition text-left"
              >
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#6a00f3]/10 rounded-lg flex items-center justify-center mb-3 transition">
                  <Icon className="w-6 h-6 text-gray-700 group-hover:text-[#6a00f3] transition" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">{desc}</p>
                <span className="text-sm font-medium text-[#6a00f3] flex items-center gap-1">
                  {action} <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </div>



        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline hover:text-[#6a00f3]">
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Simple CTA */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to assist you
            </p>
            <button className="px-6 py-3 bg-[#6a00f3] text-white font-semibold rounded-lg hover:bg-[#5a00d3] transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

