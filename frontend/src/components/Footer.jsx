import {
    Mail,
    Phone,
    MapPin,
    ArrowRight,
} from "lucide-react"
import logo from '../assets/logo.png'
import { Link, } from "react-router-dom"
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa"


function Footer() {
    return (
        <footer className="bg-black text-white bottom-0">

            {/* ================= MAIN FOOTER ================= */}
            <div className="max-w-7xl mx-auto px-6 py-14">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">


                    {/* Brand */}
                    <div>

                        <Link to="/" className="flex items-center gap-2">
                          {/* Logo Image */}
                          <img
                            src={logo}
                            alt="Shopora Logo"
                            className="h-11 w-11 text-white object-contain"
                          />
                        
                          {/* Logo Text */}
                          <div className="leading-none">
                            {/* Shopora */}
                            <h1 className="font-serif text-2xl font-semibold tracking-wide text-red-500">
                              SHOPORA
                            </h1>
                        
                            {/* Lines + Tagline */}
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <span className="h-px w-2 bg-red-500"></span>
                        
                              <p className="text-[9px] font-medium uppercase tracking-[2px] text-red-500">
                                FIND YOUR STYLE
                              </p>
                        
                              <span className="h-px w-2 bg-red-500"></span>
                            </div>
                          </div>
                        </Link>

                        <p className="text-slate-400 text-sm leading-6 max-w-xs">
                            Your one-stop destination for quality products,
                            great prices and a simple shopping experience.
                        </p>


                        {/* Social Icons */}
                        <div className="flex gap-3 mt-6">

                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition"
                            >
                                <FaFacebookF size={15} />
                            </a>

                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition"
                            >
                                <FaInstagram size={16} />
                            </a>

                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter"
                                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition"
                            >
                                <FaTwitter size={15} />
                            </a>

                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition"
                            >
                                <FaLinkedinIn size={15} />
                            </a>

                        </div>

                    </div>


                    {/* Quick Links */}
                    <div>

                        <h3 className="font-semibold text-lg mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-sm text-slate-400">

                            <li>
                                <a
                                    href="/"
                                    className="hover:text-red-500 transition"
                                >
                                    Home
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/products"
                                    className="hover:text-red-500 transition"
                                >
                                    Products
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-red-500 transition"
                                >
                                    About Us
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/contact"
                                    className="hover:text-red-500 transition"
                                >
                                    Contact Us
                                </a>
                            </li>

                        </ul>

                    </div>
                    {/* Contact */}
                    <div>

                        <h3 className="font-semibold text-lg mb-5">
                            Contact Us
                        </h3>


                        {/* Email */}
                        <div className="flex gap-3 mb-4">

                            <Mail
                                size={18}
                                className="text-red-500 mt-1 shrink-0"
                            />

                            <p className="text-sm text-slate-400">
                                support@shopora.com
                            </p>

                        </div>


                        {/* Phone */}
                        <div className="flex gap-3 mb-4">

                            <Phone
                                size={18}
                                className="text-red-500 mt-1 shrink-0"
                            />

                            <p className="text-sm text-slate-400">
                                +92 300 1234567
                            </p>

                        </div>


                        {/* Location */}
                        <div className="flex gap-3">

                            <MapPin
                                size={18}
                                className="text-red-500 mt-1 shrink-0"
                            />

                            <p className="text-sm text-slate-400">
                                Lahore, Pakistan
                            </p>

                        </div>

                    </div>
</div>
                </div>
            {/* ================= COPYRIGHT ================= */}
            <div className="border-t border-slate-800">

                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

                    <p className="text-sm text-slate-500">
                        © 2026 Shopora. All rights reserved.
                    </p>

                    <p className="text-sm text-slate-500">
                        Made with ❤️ for better shopping
                    </p>

                </div>

            </div>

        </footer>
    )
}


export default Footer