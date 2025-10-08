import { FaYoutube, FaLinkedin, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center  bg-white border-t border-gray-200 py-12">
      <div className="w-fit h-auto mx-auto px-6 flex flex-col items-center gap-12">
        {/* Top Section */}
        <div className="w-full flex flex-wrap justify-between gap-12 text-sm text-gray-700">
          {/* Column 1 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Company</h4>
            <ul className="flex flex-col gap-5">
              <li><a href="#" className="hover:text-gray-900">How it Works</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Resources</h4>
            <ul className="flex flex-col gap-5">
              <li><a href="#" className="hover:text-gray-900">Android Reviews</a></li>
              <li><a href="#" className="hover:text-gray-900">iOS Reviews</a></li>
              <li><a href="#" className="hover:text-gray-900">Testimonials.to</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Legal</h4>
            <ul className="flex flex-col gap-5">
              <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-900">KYC/AML Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Support Center</h4>
            <ul className="flex flex-col gap-5">
              <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-900">Socials</h4>
            <ul className="flex-col gap-5 space-x-5 grid grid-cols-2">
              <li className="flex items-center gap-2"><FaYoutube /> YouTube</li>
              <li className="flex items-center gap-2"><FaXTwitter /> (Formerly Twitter)</li>
              <li className="flex items-center gap-2"><FaLinkedin /> LinkedIn</li>
              <li className="flex items-center gap-2"><FaInstagram /> Instagram</li>
              <li className="flex items-center gap-2"><FaTiktok /> Tiktok</li>
              <li className="flex items-center gap-2"><FaFacebook /> Facebook</li>
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
          <button className="bg-green-500 text-white rounded-full px-6 py-2 hover:bg-green-600 transition">
            Subscribe
          </button>
        </div>

        {/* App Store Buttons */}
        <div className="flex items-center justify-center gap-4">
          <img src="/playstore-badge.png" alt="Download on Playstore" className="h-10" />
          <img src="/appstore-badge.png" alt="Download on Appstore" className="h-10" />
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © 2020 - 2024 ATLASE, Inc.
        </div>
      </div>
    </footer>
  );
}
