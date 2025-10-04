import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 px-10 mt-4">
    
    <div className="flex justify-between gap-4">
      <div className="text-center text-sm">
        <p>© {new Date().getFullYear()} Liyara. All rights reserved.</p>
      </div>
            <ul className="space-x-2 text-sm flex">
            <li><a href="/" className="hover:text-white inline-block">Home</a></li>
            <li><a href="/product" className="inline-block hover:text-white">Product</a></li>
            <li><a href="/about" className="inline-block hover:text-white">About Us</a></li>
            <li><a href="/contact" className="inline-block hover:text-white">Contact</a></li>
            <li><a href="/faq" className="inline-block hover:text-white">FAQ</a></li>
          </ul>
    </div>   
      
    
      {/* Bottom Bar */}
      
    </footer>
  );
}

export default Footer;
