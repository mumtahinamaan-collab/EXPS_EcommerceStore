import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import heroimg from "../assets/about1.jpg";
import story from "../assets/about2.jpg";
import customer from "../assets/about3.jpg";
import quality from "../assets/about4.jpg";
import easy from "../assets/about5.jpg";

function About() {
  return (
    <div className="w-full bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#fff3ef] px-4 py-10 md:px-10 md:py-12">

        {/* Background Image */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-cover bg-center bg-no-repeat
            opacity-80
            md:bg-contain md:bg-right
          "
          style={{
            backgroundImage: `url(${heroimg})`,
            filter: "brightness(0.65)",
          }}
        />

        {/* Mobile/desktop soft overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[#fff3ef]/20" />

        {/* Content */}
        <div className="relative z-10 grid min-h-[380px] grid-cols-1 items-center md:min-h-[430px] md:grid-cols-2">

          <div className="px-2 py-8 sm:px-6 md:px-8 lg:px-12">

            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500 sm:text-sm md:mb-4">
              About Shop<span className="text-black">Ease</span>
            </p>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:mb-5 md:text-5xl">
              Shopping Made
              <br />
              <span className="text-red-500">
                Simple & Better
              </span>
            </h1>

            <p className="max-w-lg text-sm leading-6 text-slate-700 sm:text-base sm:leading-7 md:text-lg">
              Discover quality products, great prices and a seamless
              shopping experience designed to make your everyday
              shopping easier.
            </p>

            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
              From everyday essentials to products you love, ShopEase
              brings everything together in one convenient place.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="relative overflow-hidden  px-4 py-12 sm:px-6 md:px-10 md:py-16">

        {/* Story Background */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-cover bg-center bg-no-repeat
          "
          style={{
            backgroundImage: `url(${story})`,

          }}
        />

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[#fff3ef]/65" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500 sm:text-sm">
              Our Story
            </p>

            <h2 className="mb-5 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              Your Trusted
              <br />
              <span className="text-red-500">
                Shopping Partner
              </span>
            </h2>

            <p className="mb-4 text-sm leading-7 text-slate-700 sm:text-base">
              ShopEase was created with one simple goal — to make online
              shopping easy, convenient and enjoyable for everyone. We
              believe that finding the right product should not be
              complicated or stressful.
            </p>

            <p className="mb-4 text-sm leading-7 text-slate-700 sm:text-base">
              Our platform brings a wide range of products together in
              one place, allowing customers to explore different
              categories, compare products and find exactly what they
              need without wasting time.
            </p>

            <p className="mb-7 text-sm leading-7 text-slate-700 sm:text-base">
              From electronics and fashion to everyday essentials, we
              focus on providing quality products, simple navigation and
              a smooth shopping experience from browsing to checkout.
            </p>


            {/* Stats */}

            <div className="grid max-w-lg grid-cols-2 gap-3 sm:gap-5">

              <div className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">

                <p className="text-xl font-bold text-red-500 sm:text-2xl">
                  10K+
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Happy Customers
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">

                <p className="text-xl font-bold text-red-500 sm:text-2xl">
                  500+
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Quality Products
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        <div className="mb-8 text-center sm:mb-10">

          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-500 sm:mb-3 sm:text-sm">
            Why ShopEase
          </p>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Why Choose Us?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Everything we do is focused on giving you a simple,
            reliable and enjoyable shopping experience.
          </p>

        </div>


        {/* Cards */}

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

          {/* Fast Delivery */}

          <div className="rounded-2xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 sm:mb-5 sm:h-12 sm:w-12">

              <Truck
                size={20}
                className="text-red-500 sm:h-[23px] sm:w-[23px]"
              />

            </div>

            <h3 className="mb-2 text-sm font-bold text-slate-900 sm:text-lg">
              Fast Delivery
            </h3>

            <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Get your favorite products delivered quickly,
              safely and conveniently to your doorstep.
            </p>

          </div>


          {/* Secure Payments */}

          <div className="rounded-2xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 sm:mb-5 sm:h-12 sm:w-12">

              <ShieldCheck
                size={20}
                className="text-red-500 sm:h-[23px] sm:w-[23px]"
              />

            </div>

            <h3 className="mb-2 text-sm font-bold text-slate-900 sm:text-lg">
              Secure Payments
            </h3>

            <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Shop confidently with secure payment options
              designed to keep your shopping experience safe.
            </p>

          </div>


          {/* Easy Returns */}

          <div className="rounded-2xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 sm:mb-5 sm:h-12 sm:w-12">

              <RotateCcw
                size={20}
                className="text-red-500 sm:h-[23px] sm:w-[23px]"
              />

            </div>

            <h3 className="mb-2 text-sm font-bold text-slate-900 sm:text-lg">
              Easy Returns
            </h3>

            <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Simple return options help make your shopping
              experience smooth and worry-free.
            </p>

          </div>


          {/* Support */}

          <div className="rounded-2xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 sm:mb-5 sm:h-12 sm:w-12">

              <Headphones
                size={20}
                className="text-red-500 sm:h-[23px] sm:w-[23px]"
              />

            </div>

            <h3 className="mb-2 text-sm font-bold text-slate-900 sm:text-lg">
              24/7 Support
            </h3>

            <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Our support team is always ready to help
              whenever you need assistance.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR VALUES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        <div className="mb-8 text-center sm:mb-10">

          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-500 sm:mb-3 sm:text-sm">
            What We Believe
          </p>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Our Values
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
            The principles that guide us in creating a better
            shopping experience for every customer.
          </p>

        </div>


        {/* 3 images always in ONE ROW */}

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">


          {/* Customer First */}

          <div
            className="
              relative h-[220px] overflow-hidden rounded-xl
              bg-cover bg-center
              sm:h-[300px] sm:rounded-2xl
              md:h-[380px]
            "
            style={{
              backgroundImage: `url(${customer})`,
            }}
          >

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-0 left-0 right-0 p-2 text-white sm:p-4 md:p-6">

              <h3 className="mb-1 text-[11px] font-bold sm:text-base md:text-xl">
                Customer First
              </h3>

              <p className="text-[8px] leading-3 text-white/90 sm:text-xs sm:leading-5 md:text-sm">
                Your satisfaction is always our priority.
              </p>

            </div>

          </div>


          {/* Quality */}

          <div
            className="
              relative h-[220px] overflow-hidden rounded-xl
              bg-cover bg-center
              sm:h-[300px] sm:rounded-2xl
              md:h-[380px]
            "
            style={{
              backgroundImage: `url(${quality})`,
            }}
          >

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-0 left-0 right-0 p-2 text-white sm:p-4 md:p-6">

              <h3 className="mb-1 text-[11px] font-bold sm:text-base md:text-xl">
                Quality & Trust
              </h3>

              <p className="text-[8px] leading-3 text-white/90 sm:text-xs sm:leading-5 md:text-sm">
                Quality products and honest service.
              </p>

            </div>

          </div>


          {/* Easy Shopping */}

          <div
            className="
              relative h-[220px] overflow-hidden rounded-xl
              bg-cover bg-center
              sm:h-[300px] sm:rounded-2xl
              md:h-[380px]
            "
            style={{
              backgroundImage: `url(${easy})`,
            }}
          >

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-0 left-0 right-0 p-2 text-white sm:p-4 md:p-6">

              <h3 className="mb-1 text-[11px] font-bold sm:text-base md:text-xl">
                Easy Shopping
              </h3>

              <p className="text-[8px] leading-3 text-white/90 sm:text-xs sm:leading-5 md:text-sm">
                Everything you need in one place.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">

        <div className="rounded-2xl bg-[#fff3ef] px-5 py-10 text-center sm:px-6 sm:py-12 md:py-14">

          <p className="mb-2 text-xs font-semibold text-red-500 sm:text-sm">
            START SHOPPING
          </p>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Ready to Find Something You Love?
          </h2>

          <p className="mx-auto mb-6 max-w-xl text-sm leading-6 text-slate-500 sm:mb-7 sm:text-base">
            Explore our collection and discover quality products,
            great prices and everything you need in one place.
          </p>

          <Link
            to="/products"
            className="
              inline-flex items-center gap-2 rounded-lg
              bg-red-500 px-6 py-3 text-sm font-semibold
              text-white transition hover:bg-red-600
              sm:px-7
            "
          >
            Shop Now
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default About;