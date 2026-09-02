
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Send,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import contactImg from "../assets/contact.jpg";

function Contact() {
  return (
    <div className="w-full bg-white text-slate-900">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#fff3ef]">

        <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">

          <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-6">

            {/* HERO CONTENT */}
            <div className="relative z-10 max-w-xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">

                <span className="h-2 w-2 rounded-full bg-red-500"></span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
                  Contact Us
                </span>

              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-6xl">

                We'd Love To

                <span className="block text-red-500">
                  Hear From You
                </span>

              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-600 md:text-base">
                Have a question about your order, products, or shopping
                experience? Our friendly support team is always ready to
                help you.
              </p>

              {/* HERO BUTTONS */}
              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href="mailto:support@shopease.com"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition duration-300 hover:bg-red-600 hover:shadow-xl"
                >
                  <Mail size={17} />
                  Email Us
                </a>

                <a
                  href="tel:+923001234567"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:border-red-200 hover:text-red-500"
                >
                  <Phone size={17} />
                  Call Us
                </a>

              </div>

            </div>


            {/* HERO IMAGE */}
            <div className="relative flex justify-center md:justify-end">

              {/* Decorative Circle */}
              <div className="absolute right-5 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-red-100 blur-3xl"></div>

              <img
                src={contactImg}
                alt="Contact ShopEase"
                className="relative z-10 h-[280px] w-full max-w-md rounded-3xl object-cover shadow-2xl md:h-[380px]"
              />

              {/* FLOATING BADGE */}
              <div className="absolute -bottom-5 left-3 z-20 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl md:left-0">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                  <Send
                    size={20}
                    className="text-red-500"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Quick Support
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    We're here for you
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT INFO + SOCIAL MEDIA
      ===================================================== */}
      <section className="bg-[#fffaf8] py-16 md:py-20">

        <div className="mx-auto max-w-7xl px-5 md:px-10">

          {/* SECTION HEADING */}
          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Get In Touch
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              We're Here To Help
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 md:text-base">
              Have a question or need assistance? Reach out to us anytime.
              Our team is always happy to help.
            </p>

          </div>


          {/* =================================================
              CONTACT CARDS
          ================================================= */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* EMAIL */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-lg">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <Mail
                  size={23}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="mb-2 text-base font-bold text-slate-900">
                Email Us
              </h3>

              <p className="mb-1 text-xs text-slate-400">
                Send us an email
              </p>

              <a
                href="mailto:support@shopease.com"
                className="text-sm font-medium text-slate-600 transition hover:text-red-500"
              >
                support@shopease.com
              </a>

            </div>


            {/* PHONE */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-lg">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <Phone
                  size={23}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="mb-2 text-base font-bold text-slate-900">
                Call Us
              </h3>

              <p className="mb-1 text-xs text-slate-400">
                Mon - Sat support
              </p>

              <a
                href="tel:+923001234567"
                className="text-sm font-medium text-slate-600 transition hover:text-red-500"
              >
                +92 300 1234567
              </a>

            </div>


            {/* LOCATION */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-lg">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <MapPin
                  size={23}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="mb-2 text-base font-bold text-slate-900">
                Our Location
              </h3>

              <p className="mb-1 text-xs text-slate-400">
                Visit our office
              </p>

              <p className="text-sm font-medium text-slate-600">
                Lahore, Pakistan
              </p>

            </div>


            {/* WORKING HOURS */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-lg">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <Clock
                  size={23}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="mb-2 text-base font-bold text-slate-900">
                Working Hours
              </h3>

              <p className="mb-1 text-xs text-slate-400">
                We're available
              </p>

              <p className="text-sm font-medium text-slate-600">
                Mon - Sat, 9 AM - 6 PM
              </p>

            </div>

          </div>


          {/* =================================================
              SOCIAL MEDIA
          ================================================= */}
          <div className="mt-12 border-t border-red-100 pt-10 text-center">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Follow Us
            </span>

            <h3 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
              Stay Connected With ShopEase
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Follow us for new products, special offers and latest updates.
            </p>


            {/* SOCIAL ICONS */}
            <div className="mt-6 flex justify-center gap-3">

              {/* FACEBOOK */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <FaFacebookF size={16} />
              </a>


              {/* INSTAGRAM */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <FaInstagram size={17} />
              </a>


              {/* TWITTER */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <FaTwitter size={16} />
              </a>


              {/* LINKEDIN */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <FaLinkedinIn size={16} />
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA SECTION
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">

        <div className="relative overflow-hidden rounded-3xl bg-[#fff3ef] px-6 py-12 text-center md:px-10 md:py-14">

          {/* DECORATIVE CIRCLES */}
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-100"></div>

          <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-red-100"></div>


          <div className="relative z-10">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Start Shopping
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-4xl">
              Ready To Start Shopping?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              Explore our latest products and discover something you'll
              absolutely love.
            </p>


            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-red-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:bg-red-600 hover:shadow-xl"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;

