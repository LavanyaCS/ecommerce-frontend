import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 px-10">
    
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="text-center text-sm flex justify-start">
        <p>© {new Date().getFullYear()} Liyara. All rights reserved.</p>
      </div>
            <ul className="space-x-2 text-sm flex justify-end">
            <li><a href="/" className="hover:text-white inline-block">Home</a></li>
            <li><a href="/product" className="inline-block hover:text-white">Product</a></li>
            <li><a href="/about" className="inline-block hover:text-white">About Us</a></li>
            <li><a href="/contact" className="inline-block hover:text-white">Contact</a></li>
          </ul>
    </div>   
      
    
      {/* Bottom Bar */}
      
    </footer>
  );
}

export default Footer;
