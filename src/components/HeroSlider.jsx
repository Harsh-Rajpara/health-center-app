import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "YOUR HEALTH IS OUR TOP PRIORITY",
      subtitle: "Welcome to HealthCenter",
      buttonText: "About Us",
      buttonLink: "/about",
      image: "images/slider1.jpg",
      overlay: "bg-black/50",
      description: "Providing compassionate healthcare services since 2010",
    },
    {
      id: 2,
      title: "MEET OUR EXPERT DOCTORS",
      subtitle: "Specialized Care",
      buttonText: "Our Doctors",
      buttonLink: "/doctors",
      image: "images/slider2.jpg",
      overlay: "bg-black/50",
      description: "Highly qualified medical professionals at your service",
    },
    {
      id: 3,
      title: "STAY UPDATED WITH LATEST NEWS",
      subtitle: "Health Tips & Updates",
      buttonText: "Latest News",
      buttonLink: "/news",
      image: "images/slider3.jpg",
      overlay: "bg-black/50",
      description: "Get the latest health information and medical advancements",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={`absolute inset-0 ${slide.overlay}`}></div>
          </div>

          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                index === currentSlide
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <p className="text-teal-400 text-base md:text-lg lg:text-2xl uppercase tracking-wider mb-3 font-semibold">
                {slide.subtitle}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
                {slide.title}
              </h1>
              <p className="text-white lg:text-2xl md:text-base mb-6 max-w-xl mx-auto opacity-90">
                {slide.description}
              </p>
              <Link
                to={slide.buttonLink}
                className="inline-block px-6 py-2.5 md:px-8 md:py-3 bg-teal-600 text-white rounded-lg duration-300 font-semibold text-sm md:text-2xl"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 md:w-10 h-1.5 bg-teal-600"
                : "w-1.5 h-1.5 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
