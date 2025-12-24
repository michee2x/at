"use client";

import { useState } from "react";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function StoresPage() {
  const [searchLocation, setSearchLocation] = useState("");

  const stores = [
    {
      name: "Atlaze Lagos Flagship",
      address: "123 Victoria Island, Lagos",
      phone: "+234 800 123 4567",
      hours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
      distance: "2.3 km",
      isOpen: true
    },
    {
      name: "Atlaze Ikeja Mall",
      address: "45 Allen Avenue, Ikeja, Lagos",
      phone: "+234 800 123 4568",
      hours: "Mon-Sun: 10AM-9PM",
      distance: "5.1 km",
      isOpen: true
    },
    {
      name: "Atlaze Abuja Central",
      address: "78 Wuse 2, Abuja",
      phone: "+234 800 123 4569",
      hours: "Mon-Sat: 9AM-7PM, Sun: Closed",
      distance: "450 km",
      isOpen: false
    },
    {
      name: "Atlaze Port Harcourt",
      address: "12 GRA Phase 2, Port Harcourt",
      phone: "+234 800 123 4570",
      hours: "Mon-Sat: 9AM-8PM, Sun: 11AM-5PM",
      distance: "520 km",
      isOpen: true
    },
    {
      name: "Atlaze Ibadan Store",
      address: "34 Bodija Market, Ibadan",
      phone: "+234 800 123 4571",
      hours: "Mon-Sat: 8:30AM-7:30PM, Sun: Closed",
      distance: "130 km",
      isOpen: false
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Compact Header with Integrated Search */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-5xl mx-auto">
            <Breadcrumbs items={[{ label: "Store Locator" }]} />
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Find a Store
                </h1>
                <p className="text-gray-600">
                  Visit us for hands-on product experience
                </p>
              </div>
              
              {/* Inline Search */}
              <div className="relative lg:w-96">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter city or location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border-gray-300 focus:border-[#6a00f3] focus:ring-[#6a00f3]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Store List - Compact Design */}
          <div className="space-y-3">
            {stores.map((store, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#6a00f3] hover:shadow-sm transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{store.address}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">{store.distance}</span>
                        </div>
                      </div>
                      {store.isOpen && (
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Open Now
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{store.hours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-col lg:w-40">
                    <button className="flex-1 lg:w-full px-4 py-2.5 bg-[#6a00f3] text-white text-sm font-semibold rounded-lg hover:bg-[#5a00d3] transition flex items-center justify-center gap-2">
                      <Navigation className="w-4 h-4" />
                      Directions
                    </button>
                    <button className="flex-1 lg:w-full px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Can&apos;t visit a store?
                </h3>
                <p className="text-sm text-gray-600">
                  Shop online with free delivery on orders over ₦50,000
                </p>
              </div>
              <button className="px-6 py-2.5 bg-[#6a00f3] text-white font-semibold rounded-lg hover:bg-[#5a00d3] transition whitespace-nowrap">
                Shop Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
