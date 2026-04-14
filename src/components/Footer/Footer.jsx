"use client";
import Image from "next/image";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    // ইমেজের মতো ডার্ক ব্যাকগ্রাউন্ড সেট করা হয়েছে
    <footer className="bg-[#1a1f29] text-gray-400 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {/* আপনার শপিং কার্ট আইকন এখানে দিতে পারেন */}
            <h4 className="text-xl font-bold text-white">
              <span className="text-white">Kretar</span>
              <span className="text-white">Feriwala</span>
            </h4>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Your trusted destination for premium baby products and home
            essentials in Bangladesh.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <FaInstagram size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <FaYoutube size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="text-sm space-y-3">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white font-bold mb-6">Customer Service</h4>
          <ul className="text-sm space-y-3">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Track Order
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Return & Refund
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping Info
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="text-sm space-y-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="flex-shrink-0" />
              <span>০১৭৯৫০৭২২০০</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="flex-shrink-0" />
              <span>kretarferiwala@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs">
        <p>
          &copy; 2026{" "}
          <span className="text-orange-500 font-semibold">KretarFeriwala</span>.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
