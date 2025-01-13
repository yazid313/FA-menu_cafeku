"use client";

import React, { useState, useEffect } from "react";
export default function Header({ category }) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Jarak tambahan ke atas
      const topPosition = element.getBoundingClientRect().top + window.scrollY; // Posisi elemen relatif ke viewport
      window.scrollTo({
        top: topPosition - offset, // Mengurangi offset untuk membuat posisi lebih tinggi
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <div className=" fixed top-10 left-0 w-full z-50  shadow-md bg-black text-white h-8">
      {/* Navigation Section */}
      <div className="container ">
        <ul className="flex items-center justify-between text-sm gap-4 px-4 py-1 ">
          {/* Scroll to Top Button */}
          <button onClick={() => scrollToSection("menu")}>
            <img src="/img/atas.png" alt="Top" className=" w-20" />
          </button>

          {/* Navigation Buttons */}
          <div className="flex gap-6">
            {category.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.type)}
                className="hover:text-yellow-700 cursor-pointer capitalize transition-colors duration-300"
              >
                {item.type}
              </button>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}
