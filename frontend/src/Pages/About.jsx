import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
} from "lucide-react"

import heroimg from "../assets/about1.png"
import story from "../assets/about2.png"
import customer from "../assets/about3.png"
import quality from "../assets/about4.png"
import easy from "../assets/about5.png"


function About() {
  return (
    <div className="w-full bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        <div className="bg-[#fff3ef] rounded-2xl overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">

            {/* Hero Content */}
            <div className="px-6 py-12 sm:px-10 md:px-12 lg:px-16">

              <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-4">
                About Shop<span className="text-black">Ease</span>
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5">
                Shopping Made
                <br />
                <span className="text-red-500">
                  Simple & Better
                </span>
              </h1>

              <p className="text-slate-500 text-base md:text-lg leading-7 max-w-lg">
                Discover quality products, great prices and a seamless
                shopping experience designed to make your everyday
                shopping easier.
              </p>

            </div>


            {/* Hero Image */}
            <div className="flex justify-center items-center p-6 md:p-8">

              <img
                src={heroimg}
                alt="ShopEase Shopping"
                className="w-full max-w-[420px] h-[320px] md:h-[400px] object-cover rounded-2xl shadow-lg"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Story Image */}

          <div className="flex justify-center">

            <img
              src={story}
              alt="Our Story"
              className="w-full max-w-[480px] h-[360px] md:h-[440px] object-cover rounded-2xl"
            />

          </div>


          {/* Story Content */}

          <div>

            <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-3">
              Our Story
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">

              Your Trusted
              <br />

              <span className="text-red-500">
                Shopping Partner
              </span>

            </h2>


            <p className="text-slate-500 leading-7 mb-5">
              ShopEase was created with one simple goal —
              to make online shopping easy, convenient and
              enjoyable for everyone.
            </p>


            <p className="text-slate-500 leading-7 mb-7">
              From electronics and fashion to everyday
              essentials, we bring quality products together
              in one place so you can shop with confidence.
            </p>


            {/* Stats */}

            <div className="grid grid-cols-2 gap-4">

              <div className="border border-slate-200 rounded-xl p-5">

                <p className="text-2xl font-bold text-red-500">
                  10K+
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Happy Customers
                </p>

              </div>


              <div className="border border-slate-200 rounded-xl p-5">

                <p className="text-2xl font-bold text-red-500">
                  500+
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Products
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">

        {/* Heading */}

        <div className="text-center mb-10">

          <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-3">
            Why ShopEase
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why Choose Us?
          </h2>

          <p className="max-w-xl mx-auto text-slate-500 mt-3">
            Everything we do is focused on giving you a
            simple and reliable shopping experience.
          </p>

        </div>


        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


          {/* Fast Delivery */}

          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition duration-300">

            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">

              <Truck
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2">
              Fast Delivery
            </h3>

            <p className="text-sm text-slate-500 leading-6">
              Get your favorite products delivered quickly
              and safely to your doorstep.
            </p>

          </div>


          {/* Secure Payments */}

          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition duration-300">

            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">

              <ShieldCheck
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2">
              Secure Payments
            </h3>

            <p className="text-sm text-slate-500 leading-6">
              Shop confidently with safe and secure
              payment options.
            </p>

          </div>


          {/* Easy Returns */}

          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition duration-300">

            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">

              <RotateCcw
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2">
              Easy Returns
            </h3>

            <p className="text-sm text-slate-500 leading-6">
              Simple return options for a smooth and
              worry-free experience.
            </p>

          </div>


          {/* Support */}

          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition duration-300">

            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">

              <Headphones
                size={23}
                className="text-red-500"
              />

            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2">
              24/7 Support
            </h3>

            <p className="text-sm text-slate-500 leading-6">
              Our support team is always ready to help
              whenever you need us.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR VALUES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Heading */}

        <div className="text-center mb-10">

          <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-3">
            What We Believe
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Our Values
          </h2>

        </div>


        {/* Image Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          {/* Customer First */}

          <div
            className="relative h-[380px] rounded-2xl overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${customer})`,
            }}
          >

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

              <h3 className="font-bold text-xl mb-2">
                Customer First
              </h3>

              <p className="text-sm text-white/90">
                Your satisfaction is always our priority.
              </p>

            </div>

          </div>


          {/* Quality */}

          <div
            className="relative h-[380px] rounded-2xl overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${quality})`,
            }}
          >

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

              <h3 className="font-bold text-xl mb-2">
                Quality & Trust
              </h3>

              <p className="text-sm text-white/90">
                We believe in quality products and honest service.
              </p>

            </div>

          </div>


          {/* Easy Shopping */}

          <div
            className="relative h-[380px] rounded-2xl overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${easy})`,
            }}
          >

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

              <h3 className="font-bold text-xl mb-2">
                Easy Shopping
              </h3>

              <p className="text-sm text-white/90">
                Everything you need, all in one place.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <div className="bg-[#fff3ef] rounded-2xl px-6 py-12 md:py-14 text-center">

          <p className="text-red-500 font-semibold mb-2">
            START SHOPPING
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Ready to Find Something You Love?
          </h2>

          <p className="text-slate-500 max-w-xl mx-auto mb-7">
            Explore our collection and discover quality products
            at prices you'll love.
          </p>

          <button className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-7 py-3 rounded-lg transition">

            Shop Now

            <ArrowRight size={18} />

          </button>

        </div>

      </section>

    </div>
  )
}


export default About