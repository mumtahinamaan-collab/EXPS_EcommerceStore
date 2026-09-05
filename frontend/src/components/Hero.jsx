import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import heroImage1 from "../assets/hero1.avif";
import heroImage2 from "../assets/image.avif";

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [heroImage1, heroImage2];

  // Next image
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  // Previous image
  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  // Auto slide every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 100}%)`,
        }}
      >
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-[240px] sm:h-[300px] md:h-[320px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevImage}
        aria-label="Previous slide"
        className="
          absolute left-3 top-1/2 z-10
          -translate-y-1/2
          flex h-9 w-9 items-center justify-center
          rounded-full
          bg-black/35
          text-white
          backdrop-blur-sm
          transition
          hover:bg-black/60
          sm:left-5
          sm:h-11
          sm:w-11
        "
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextImage}
        aria-label="Next slide"
        className="
          absolute right-3 top-1/2 z-10
          -translate-y-1/2
          flex h-9 w-9 items-center justify-center
          rounded-full
          bg-black/35
          text-white
          backdrop-blur-sm
          transition
          hover:bg-black/60
          sm:right-5
          sm:h-11
          sm:w-11
        "
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}