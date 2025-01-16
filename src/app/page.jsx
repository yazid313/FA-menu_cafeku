"use client";

import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Import required modules
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import Navbar from "./navbar";

export default function Home({ params }) {
  const gallery = [
    { value: "batagor.jpeg" },
    { value: "cafe.jpeg" },
    { value: "cafe.jpeg" },
    { value: "cafe.jpeg" },
    { value: "batagor.jpeg" },
  ];

  return (
    <div>
      <Navbar />
      <div className="container bg-gradient-to-br md:h-screen h-full from-white to-yellow-100 py-10">
        <div className="flex flex-wrap">
          <div className="w-full self-center px-4 lg:w-1/2 mt-12">
            <h1 className="font-bold bg-gradient-to-r from-yellow-500 to-yellow-800 bg-clip-text text-transparent text-5xl lg:text-6xl">
              Mau Daftar Menu
            </h1>
            <h1 className="font-bold bg-gradient-to-r from-yellow-500 to-yellow-800 bg-clip-text text-transparent text-5xl lg:text-6xl">
              Online Gratis!
            </h1>
            <h1 className="font-bold bg-gradient-to-r from-yellow-500 to-yellow-800 bg-clip-text text-transparent text-5xl lg:text-6xl">
              Untuk Cafemu!!
            </h1>
            <p className="text-gray-700 text-base font-medium mt-5">
              Coba sekarang dan buat akun menu cafe GRATIS untuk semua cafe
              dalam waktu 5 menit - Gak mau ribet? Minta dibuatin admin,
              Gratis!!!
            </p>
            <a href="https://wa.me/6285946652309/">
              <button className="mt-5 bg-yellow-500 text-white py-3 px-5 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
                Hubungi Admin
              </button>
            </a>
          </div>
          <div className="w-full self-end px-4 lg:w-1/2 mt-10 py-10">
            <Swiper
              slidesPerView={3}
              spaceBetween={20}
              speed={1000}
              loop={true}
              effect="coverflow"
              centeredSlides={true}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Autoplay, EffectCoverflow]}
              className="w-full h-80"
            >
              {gallery.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="text-center text-[18px]  flex justify-center items-center transition-transform duration-500 hover:scale-105 shadow-lg"
                >
                  <img
                    src={`/img/${item.value}`}
                    alt={`slide-${index}`}
                    className="block w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
