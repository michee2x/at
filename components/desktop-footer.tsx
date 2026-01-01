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
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z"
                fill="#32BBFF"
              />
              <path
                d="M3.609 1.814A.989.989 0 0 1 4.629 1.5L15.18 7.25 13.792 12 3.609 1.814z"
                fill="#32BBFF"
              />
              <path
                d="M13.792 12l1.388 4.75L4.629 22.5a.989.989 0 0 1-1.02-.314L13.792 12z"
                fill="#32BBFF"
              />
              <path
                d="M13.792 12L15.18 7.25l5.023 2.868a1.001 1.001 0 0 1 0 1.764l-5.023 2.868L13.792 12z"
                fill="#32BBFF"
              />
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
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
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
