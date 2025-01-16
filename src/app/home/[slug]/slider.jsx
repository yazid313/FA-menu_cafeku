"use client";

import React, { useState, useEffect, useRef } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

const Slider = ({ events }) => {
  return (
    <div className="w-full h-full">
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {events.map((item) => {
          return (
            <SwiperSlide
              key={item.id}
              className="w-full h-full text-center text-[18px] bg-black flex justify-center items-center"
            >
              <div
                className="min-w-full h-[400px] bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo})`,
                }}
              >
                <div className="text-center text-white p-4 bg-black bg-opacity-50 rounded-lg">
                  <h2 className="text-2xl md:text-5xl font-bold mb-2">
                    {item.title}
                  </h2>
                  <p className="max-w-xl mx-auto text-sm md:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;
