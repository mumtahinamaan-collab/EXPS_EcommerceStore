
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import heroimg from "../assets/about1.jpg";
import story from "../assets/about2.jpg";
import customer from "../assets/about3.jpg";
import quality from "../assets/about4.jpg";
import easy from "../assets/about5.jpg";

function About() {
  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#fff5f2]">

        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-100/70 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-10 md:py-16 lg:py-20">

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* HERO CONTENT */}
            <div className="max-w-xl">

              {/* Label */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 shadow-sm">

                <span className="h-2 w-2 rounded-full bg-red-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 sm:text-xs">
                  About SHOPORA
                </span>

              </div>


              {/* Heading */}
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">

                Shopping Made

                <span className="block text-red-500">
                  Simple & Better
                </span>

              </h1>


              {/* Description */}
              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                Discover quality products, great prices and a seamless
                shopping experience designed to make your everyday
                shopping easier.
              </p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                From everyday essentials to products you love, Shopora
                brings everything together in one convenient place.
              </p>


              {/* Button */}
              <div className="mt-8">

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-xl"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </Link>

              </div>

            </div>


            {/* HERO IMAGE */}
            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

              {/* Glow */}
              <div className="absolute inset-5 rounded-[2rem] bg-red-200/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">

                <img
                  src={heroimg}
                  alt="Shopora Shopping"
                  className="h-[300px] w-full object-cover sm:h-[380px] md:h-[430px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />


                {/* Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-xs text-slate-400">
                        Our Promise
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                        Quality products. Better experience.
                      </p>

                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                      <CheckCircle2
                        size={21}
                        className="text-red-500"
                      />
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}
      <section className="bg-white py-16 sm:py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* STORY IMAGE */}
            <div className="relative order-2 lg:order-1">

              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-3xl bg-[#fff0eb]" />

              <div className="relative overflow-hidden rounded-[2rem]">

                <img
                  src={story}
                  alt="Our Story"
                  className="h-[320px] w-full object-cover sm:h-[400px] md:h-[470px]"
                />

              </div>

              {/* Small floating stat */}
              <div className="absolute -bottom-5 right-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:right-8">

                <p className="text-xl font-extrabold text-red-500">
                  10K+
                </p>

                <p className="text-xs text-slate-500">
                  Happy Customers
                </p>

              </div>

            </div>


            {/* STORY CONTENT */}
            <div className="order-1 lg:order-2">

              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-500">
                Our Story
              </span>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">

                Your Trusted

                <span className="block text-red-500">
                  Shopping Partner
                </span>

              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">

                <p>
                  Shopora was created with one simple goal — to make
                  online shopping easy, convenient and enjoyable for
                  everyone.
                </p>

                <p>
                  We believe finding the right product should not be
                  complicated or stressful. Our platform brings a wide
                  range of products together in one convenient place.
                </p>

                <p>
                  From electronics and fashion to everyday essentials,
                  we focus on quality products, simple navigation and
                  a smooth shopping experience from browsing to checkout.
                </p>

              </div>


              {/* Stats */}
              <div className="mt-8 grid max-w-lg grid-cols-2 gap-4">

                <div className="rounded-2xl border border-red-100 bg-[#fff9f7] p-5">

                  <p className="text-2xl font-extrabold text-red-500">
                    10K+
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Happy Customers
                  </p>

                </div>

                <div className="rounded-2xl border border-red-100 bg-[#fff9f7] p-5">

                  <p className="text-2xl font-extrabold text-red-500">
                    500+
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Quality Products
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <section className="bg-[#fffaf8] py-16 sm:py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">

          {/* Heading */}
          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-500">
              Why Shopora
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Us?
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Everything we do is focused on giving you a simple,
              reliable and enjoyable shopping experience.
            </p>

          </div>


          {/* Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* FAST DELIVERY */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <Truck
                  size={22}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Fast Delivery
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Get your favorite products delivered quickly,
                safely and conveniently to your doorstep.
              </p>

            </div>


            {/* SECURE PAYMENTS */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <ShieldCheck
                  size={22}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Secure Payments
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Shop confidently with secure payment options
                designed to keep your shopping experience safe.
              </p>

            </div>


            {/* EASY RETURNS */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <RotateCcw
                  size={22}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Easy Returns
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Simple return options help make your shopping
                experience smooth and worry-free.
              </p>

            </div>


            {/* SUPPORT */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 transition duration-300 group-hover:bg-red-500">

                <Headphones
                  size={22}
                  className="text-red-500 transition group-hover:text-white"
                />

              </div>

              <h3 className="text-lg font-bold text-slate-900">
                24/7 Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Our support team is always ready to help
                whenever you need assistance.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR VALUES
      ===================================================== */}
      <section className="bg-white py-16 sm:py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">

          {/* Heading */}
          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-500">
              What We Believe
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Our Values
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              The principles that guide us in creating a better
              shopping experience for every customer.
            </p>

          </div>


          {/* Values Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* CUSTOMER FIRST */}
            <div className="group relative overflow-hidden rounded-3xl">

              <img
                src={customer}
                alt="Customer First"
                className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[400px] md:h-[430px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">

                  <CheckCircle2 size={19} />

                </div>

                <h3 className="text-xl font-bold">
                  Customer First
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/80">
                  Your satisfaction is always our priority.
                </p>

              </div>

            </div>


            {/* QUALITY */}
            <div className="group relative overflow-hidden rounded-3xl">

              <img
                src={quality}
                alt="Quality and Trust"
                className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[400px] md:h-[430px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">

                  <ShieldCheck size={19} />

                </div>

                <h3 className="text-xl font-bold">
                  Quality & Trust
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/80">
                  Quality products and honest service.
                </p>

              </div>

            </div>


            {/* EASY SHOPPING */}
            <div className="group relative overflow-hidden rounded-3xl">

              <img
                src={easy}
                alt="Easy Shopping"
                className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[400px] md:h-[430px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">

                  <ArrowRight size={19} />

                </div>

                <h3 className="text-xl font-bold">
                  Easy Shopping
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/80">
                  Everything you need in one convenient place.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="px-5 pb-12 sm:px-6 md:px-10 md:pb-16">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#fff3ef] px-6 py-12 text-center sm:px-10 md:py-16">

          {/* Decorative circles */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-100/70" />

          <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-orange-100/60" />


          <div className="relative z-10">

            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-500">
              Start Shopping
            </span>

            <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Ready To Find Something You Love?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore our collection and discover quality products,
              great prices and everything you need in one place.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-red-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-xl"
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

export default About;

