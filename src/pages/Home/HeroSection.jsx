import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://picsum.photos/id/1018/1000/600/",
    title: "Reasonable Price",
    subtitle: "10% OFF YOUR FIRST ORDER",
    button: "Shop Now",
  },
  {
    image: "https://picsum.photos/id/1015/1000/600/",
    title: "Trendy Collection",
    subtitle: "Discover the Latest Fashion",
    button: "Explore",
  },
  {
    image: "https://picsum.photos/id/1019/1000/600/",
    title: "Premium Quality",
    subtitle: "Best Materials, Best Design",
    button: "Buy Now",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto overflow-hidden py-4">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-96 object-cover"
            />
            {/* Caption Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
              <p className="text-sm md:text-lg font-medium mb-2 uppercase tracking-widest">
                {slide.subtitle}
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {slide.title}
              </h2>
              <button className="bg-white text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-200">
                {slide.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              current === i ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
