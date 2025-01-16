"use client";
import axios from "axios";
// import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { HomeSkeleton } from "./homeSkeleton";

export default function Gallery({ gallery }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  const openImage = (index) => {
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setCurrentIndex(null);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="px-[20px] md:px-[50px] lg:px-[100px]">
      <div className="py-6">
        <h4 className="text-center text-sm md:text-lg font-semibold text-yellow-700">
          Moments
        </h4>
        <h2 className="text-center font-bold font-display text-3xl md:text-4xl">
          Gallery
        </h2>
        <div className="border-t-8 mt-4 border-yellow-700 w-[80px] mx-auto"></div>
      </div>
      {gallery.length == 0 ? (
        <HomeSkeleton />
      ) : (
        <div className="pt-4 gap-8 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 ">
          {gallery.map((dr, index) => (
            <div
              key={index}
              className=" cursor-pointer w-[180px] h-[120px] md-w-[200px] md-h-[150px] hover:scale-110 transition-transform duration-300 shadow rounded"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${dr.image}`}
                alt={dr.alt}
                onClick={() => openImage(index)}
                className="w-full h-full "
              />
            </div>
          ))}
        </div>
      )}

      {currentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button
            onClick={closeImage}
            className="absolute top-6 right-6 text-white text-4xl font-bold"
          >
            &times;
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white text-5xl font-bold hover:scale-110"
          >
            &lt;
          </button>

          <img
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${gallery[currentIndex].image}`}
            alt={gallery[currentIndex].alt}
            className="max-w-[90%] max-h-[80%] rounded"
          />

          <button
            onClick={nextImage}
            className="absolute right-6 text-white text-5xl font-bold hover:scale-110"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
