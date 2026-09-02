import heroImage from "../assets/heroimg.jpg";

export default function Hero() {
  return (
    <section
      className="flex w-full h-[240px] sm:h-[300px] md:h-[320px] items-center bg-cover bg-right md:bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 "></div>

      <div
        className="
          relative z-10
          w-full
          px-5
          sm:px-8
          md:max-w-2xl
          md:px-14
        "
      >
        <h1
          className="
            mb-2
            text-3xl
            font-extrabold
            leading-tight
            sm:text-4xl
            md:mb-4
            md:text-6xl
          "
        >
          Shop Smart.
          <br />
          Live Better
        </h1>

       <p className="mb-4 max-w-lg text-sm leading-relaxed sm:text-base md:mb-6 md:text-xl">
  <span className="bg-black/20 text-white box-decoration-clone px-0.5 py-0.5">
    Explore the latest products at prices you'll love.
    Easy shopping, secure payments, and fast delivery.
  </span>
</p>

        <button
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            bg-black
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            sm:px-6
            sm:py-3
            md:text-base
          "
        >
          Shop Now
          <span>→</span>
        </button>
      </div>
    </section>
  );
}