import Image from "next/image";
import { FaYoutube, FaLinkedin, FaInstagram, FaTiktok, FaFacebook, FaApple, FaGooglePlay } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full mt-[10rem] hidden lg:flex items-center justify-center  bg-white border-t border-gray-200 py-12">
      <div className="w-fit h-auto mx-auto px-6 flex flex-col items-center gap-12">
        {/* Top Section */}
        <div className="w-full flex flex-wrap justify-between gap-12 text-sm text-gray-700">
          {/* Column 1 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Company</h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a href="#" className="hover:text-gray-900">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Resources</h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Android Reviews
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  iOS Reviews
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Testimonials.to
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Legal</h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  KYC/AML Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Support Center</h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Socials</h4>
            <ul className="flex-col gap-5 space-x-5 grid grid-cols-2">
              <li className="flex items-center gap-2">
                <FaYoutube /> YouTube
              </li>
              <li className="flex items-center gap-2">
                <FaXTwitter /> (Formerly Twitter)
              </li>
              <li className="flex items-center gap-2">
                <FaLinkedin /> LinkedIn
              </li>
              <li className="flex items-center gap-2">
                <FaInstagram /> Instagram
              </li>
              <li className="flex items-center gap-2">
                <FaTiktok /> Tiktok
              </li>
              <li className="flex items-center gap-2">
                <FaFacebook /> Facebook
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full max-w-lg flex items-center justify-center gap-3">
          <input
            type="email"
            placeholder="Enter your email to subscribe to our newsletter!"
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-[#97D25B] flex items-center gap-1.5 text-[#141414] font-semibold text-[14px] rounded-full px-6 py-2 hover:bg-green-600 transition">
            Subscribe
            <span className="size-[14px] text-white text-xl items-center justify-center bg-[#141414] flex rounded-full">
              <FaArrowRight className="w-[5.83px] h-[9.33px] text-[#97D25B]" />
            </span>
          </button>
        </div>

        {/* App Store Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Google Play Button */}
          <button className="flex rounded-full w-[158px] h-[56px] px-3 bg-black gap-3 items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.01217 19.9881L14.7735 12L4.01217 4.01185V19.9881Z" fill="#00E2FF"/>
              <path d="M14.7735 12L19.5097 15.6983L14.7735 12ZM14.7735 12L4.01217 4.01186L16.2995 2.22729L14.7735 12Z" fill="#32A071"/>
              <path d="M14.7735 12L4.01217 19.9881L16.2995 21.7725L14.7735 12Z" fill="#F4204D"/>
              <path d="M14.7735 12L19.5097 8.30151L21.7825 10.0861C22.6136 10.7383 22.6136 11.2616 21.7825 11.9137L19.5097 13.6982L14.7735 12Z" fill="#FFC932"/>
              <path d="M19.5097 15.6983L14.7735 12L16.2995 21.7727L19.5097 15.6983Z" fill="#FA2C56"/>
              <path d="M14.7735 12L19.5097 8.30153L16.2995 2.22731L14.7735 12Z" fill="#2DA56B"/>
              <path d="M4.01217 19.9881L14.7735 12L16.2995 21.7727L4.01217 19.9881Z" fill="#CC143E"/>
              <path d="M4.01217 4.01186L14.7735 12L16.2995 2.22731L4.01217 4.01186Z" fill="#258E5E"/>
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" fill="url(#paint0_linear)"/>
            <path d="M13.792 12l1.388 4.75L4.629 22.5a.989.989 0 0 1-1.02-.314L13.792 12z" fill="url(#paint1_linear)"/>
            <path d="M13.792 12L15.18 7.25l5.023 2.868a1.001 1.001 0 0 1 0 1.764l-5.023 2.868L13.792 12z" fill="url(#paint2_linear)"/>
            <path d="M3.609 1.814A.989.989 0 0 1 4.629 1.5L15.18 7.25 13.792 12 3.609 1.814z" fill="url(#paint3_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="14.208" y1="12" x2="3.197" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#32A071"/>
                    <stop offset="0.0685" stopColor="#2DA771"/>
                    <stop offset="0.4762" stopColor="#15CF74"/>
                    <stop offset="0.8009" stopColor="#06E775"/>
                    <stop offset="1" stopColor="#00F355"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="20.841" y1="17.546" x2="3.818" y2="-9.083" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FA2D48"/>
                    <stop offset="1" stopColor="#C8123C"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="2.259" y1="3.237" x2="16.591" y2="25.437" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC800"/>
                    <stop offset="1" stopColor="#F0B500"/>
                    <stop offset="1" stopColor="#E9AC00"/>
                </linearGradient>
                <linearGradient id="paint3_linear" x1="-3.454" y1="-0.982" x2="9.674" y2="19.349" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0C9D58"/>
                    <stop offset="1" stopColor="#017A43"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex h-fit flex-col items-start">
              <span className="text-[10px] text-nowrap font-normal text-white leading-none mb-0.5">
                GET IT ON
              </span>
              <span className="text-[16px] font-semibold text-white leading-none">
                Google Play
              </span>
            </div>
          </button>

          {/* App Store Button */}
          <button className="flex rounded-full w-[158px] h-[56px] px-3 bg-black gap-3 items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.07 19.88c-.9 1.3-1.85 2.59-3.3 2.59-1.42 0-1.84-.86-3.46-.86-1.63 0-2.11.83-3.45.86-1.39.03-2.45-1.42-3.36-2.73-1.85-2.67-3.27-7.59-1.35-10.9 0.95-1.63 2.65-2.67 4.49-2.67 1.39 0 2.65.91 3.51.91 0.83 0 2.39-1.15 4.04-.97 0.69.03 2.62.28 3.86 2.08-0.1 0.06-2.3 1.33-2.28 4.09 0.03 3.26 2.84 4.34 2.87 4.35-0.03 0.08-0.45 1.55-1.47 3.05M14 .35c0.77-0.93 1.28-2.24 1.14-3.53-1.11 0.05-2.46 0.74-3.26 1.67-0.72 0.82-1.35 2.14-1.18 3.39 1.24 0.1 2.5-0.63 3.3-1.53" />
            </svg>
            <div className="flex h-fit flex-col items-start">
              <span className="text-[10px] text-nowrap font-normal text-white leading-none mb-0.5">
                Download on the
              </span>
              <span className="text-[16px] font-semibold text-white leading-none">
                App Store
              </span>
            </div>
          </button>
        </div>

        {/* Copyright */}
        <div className="w-full border-t mt-14 border-gray-200 pt-6 text-center text-sm text-gray-500">
          © 2020 - {new Date().getFullYear()} ATLASE, Inc.
        </div>
      </div>
    </footer>
  );
}
