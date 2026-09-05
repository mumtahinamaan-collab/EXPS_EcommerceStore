import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroImage1 from "../assets/hero1.avif";
import heroImage2 from "../assets/image.avif";

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [heroImage1, heroImage2];

  // Next slide
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  // Previous slide
  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="
        relative
        w-full
        px-0
        md:px-4
        md:py-4
      "
    >
      {/* Slider Box */}
      <div
        className="
          relative
          h-[180px]
          w-full
          overflow-hidden
          rounded-xl
          bg-white

          sm:h-[200px]
          sm:rounded-2xl

          md:h-[320px]

          lg:h-[400px]
        "
      >
        {/* Slider Track */}
        <div
          className="
            flex
            h-full
            w-full
            transition-transform
            duration-700
            ease-in-out
          "
          style={{
            transform: `translate3d(-${currentImage * 100}%, 0, 0)`,
          }}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="
                h-full
                w-full
                shrink-0
                grow-0
                basis-full
              "
            >
              <img
                src={image}
                alt={`Shopora hero ${index + 1}`}
                draggable="false"
                className="
                  block
                  h-full
                  w-full
                  object-contain
                "
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={prevImage}
          aria-label="Previous slide"
          className="
            absolute
            left-2
            top-1/2
            z-20
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/40
            text-white
            backdrop-blur-sm
            transition
            hover:bg-black/60

            sm:left-3
            sm:h-9
            sm:w-9

            md:left-4
            md:h-10
            md:w-10
          "
        >
          <ChevronLeft
            size={18}
            className="sm:h-5 sm:w-5 md:h-6 md:w-6"
          />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextImage}
          aria-label="Next slide"
          className="
            absolute
            right-2
            top-1/2
            z-20
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/40
            text-white
            backdrop-blur-sm
            transition
            hover:bg-black/60

            sm:right-3
            sm:h-9
            sm:w-9

            md:right-4
            md:h-10
            md:w-10
          "
        >
          <ChevronRight
            size={18}
            className="sm:h-5 sm:w-5 md:h-6 md:w-6"
          />
        </button>

        {/* Dots */}
        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-20
            flex
            -translate-x-1/2
            gap-2
            md:bottom-4
          "
        >
          {heroImages.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  currentImage === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/60"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

