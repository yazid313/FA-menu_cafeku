"use client";
import axios from "axios";
// import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Slider = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      events.length > 0 ? (prevIndex + 1) % events.length : prevIndex
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      events.length > 0
        ? (prevIndex - 1 + events.length) % events.length
        : prevIndex
    );
  };

  // Auto slide useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="relative overflow-hidden w-full bg-black">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-[400px] bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_API_URL}/${slide.photo})`,
            }}
          >
            <div className="text-center text-white p-4 bg-black bg-opacity-50 rounded-lg">
              <h2 className="text-2xl md:text-5xl font-bold mb-2">
                {slide.title}
              </h2>
              <p className="max-w-xl mx-auto text-sm md:text-lg">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full"
        aria-label="Previous Slide"
      >
        &lt;
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full"
        aria-label="Next Slide"
      >
        &gt;
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {events.map((_, index) => (
          <div
            key={index}
            className={`h-4 w-4 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
