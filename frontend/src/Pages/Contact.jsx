import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react"

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa"
import { Link } from "react-router-dom";


import contactImg from "../assets/contact.png"


function Contact() {
  return (
    <div className="w-full bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-[#fff3ef] rounded-2xl px-4 w-auto py-10 md:px-10 md:py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Text */}
          <div className="text-center md:text-left">

            <p className="text-red-500 text-sm font-bold uppercase tracking-wide mb-3">
              Contact Us
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
              We'd Love To
              <br />
              <span className="text-red-500">
                Hear From You
              </span>
            </h1>

            <p className="max-w-xl text-slate-500 leading-7">
              Have a question or need help?
              Feel free to reach out to our team.
              We're always happy to help you with your shopping experience.
            </p>

          </div>


          {/* Image */}
          <div className="flex justify-center md:justify-end">

            <img
              src={contactImg}
              alt="Contact ShopEase"
              className="w-full max-w-[380px] h-[300px] object-contain"
            />

          </div>

        </div>

      </section>


      {/* ================= CONTACT INFO ================= */}
      <section className="py-14 md:py-16">

        <div className="text-center mb-10">

          <p className="text-red-500 text-sm font-bold uppercase tracking-wide mb-2">
            Get In Touch
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            We're Here To Help
          </h2>

          <p className="text-slate-500 mt-3">
            Reach out to us whenever you need assistance.
          </p>

        </div>


        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


          {/* Email */}
          <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition duration-300">

            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">

              <Mail
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 mb-2">
              Email
            </h3>

            <p className="text-sm text-slate-500">
              support@shopease.com
            </p>

          </div>


          {/* Phone */}
          <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition duration-300">

            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">

              <Phone
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 mb-2">
              Phone
            </h3>

            <p className="text-sm text-slate-500">
              +92 300 1234567
            </p>

          </div>


          {/* Location */}
          <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition duration-300">

            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">

              <MapPin
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 mb-2">
              Location
            </h3>

            <p className="text-sm text-slate-500">
              Lahore, Pakistan
            </p>

          </div>


          {/* Working Hours */}
          <div className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition duration-300">

            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">

              <Clock
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 mb-2">
              Working Hours
            </h3>

            <p className="text-sm text-slate-500">
              Mon - Sat, 9 AM - 6 PM
            </p>

          </div>

        </div>

      </section>


      {/* ================= SOCIAL MEDIA ================= */}
      <section className="bg-slate-50 rounded-2xl py-12 md:py-14 px-6 text-center">

        <p className="text-red-500 text-sm font-bold uppercase tracking-wide mb-2">
          Follow Us
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Stay Connected With ShopEase
        </h2>

        <p className="text-slate-500 mb-8">
          Follow us for new products, special offers and updates.
        </p>


        <div className="flex justify-center gap-4">

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:border-red-200 hover:shadow-sm transition duration-300"
          >
            <FaFacebookF size={18} />
          </a>


          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:border-red-200 hover:shadow-sm transition duration-300"
          >
            <FaInstagram size={19} />
          </a>


          {/* Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:border-red-200 hover:shadow-sm transition duration-300"
          >
            <FaTwitter size={18} />
          </a>


          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:border-red-200 hover:shadow-sm transition duration-300"
          >
            <FaLinkedinIn size={18} />
          </a>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-[#fff3ef] rounded-2xl py-10 md:py-12 px-6 text-center my-10">

        <p className="text-red-500 font-semibold mb-2">
          START SHOPPING
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Ready To Start Shopping?
        </h2>

        <p className="text-slate-500 max-w-xl mx-auto mb-6">
          Explore our products and discover something you'll love.
        </p>
 
        <Link to="/products" className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-7 py-3 rounded-lg transition duration-300">

          Shop Now

          <ArrowRight size={18} />

        </Link>

      </section>

    </div>
  )
}


export default Contact