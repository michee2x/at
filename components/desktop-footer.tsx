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
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.54 2.53L13.8 12l-9.26 9.47A1.5 1.5 0 0 1 4 20.08V3.92c0-0.53 0.19-1.02 0.54-1.39z" fill="#2196F3" />
              <path d="M4.54 2.53L13.8 12l4.18-4.22L5.8 1.25A1.5 1.5 0 0 0 4.54 2.53z" fill="#F44336" />
              <path d="M13.8 12l-9.26 9.47L4.54 21.47a1.5 1.5 0 0 0 1.25 0.28l12.18-6.93l-4.17-2.82z" fill="#4CAF50" />
              <path d="M18.8 8.08l2.9 1.63c0.83 0.47 0.83 1.22 0 1.69l-2.9 1.63L13.8 12l5-3.92z" fill="#FFC107" />
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
