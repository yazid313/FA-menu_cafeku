"use client";
import React, { useState, useEffect } from "react";

import Header from "./header";
import Navbar from "./navbar";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import MenuSkeleton from "./menuSkeleton";

export default function Home({ params }) {
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const { slug } = React.use(params);
  const searchParams = useSearchParams(); // Mengambil search params dari URL
  const id = searchParams.get("id"); // Mendapatkan parameter 'id' dari query

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/showall/${slug}`
        );
        setCategory(response.data[0].categories);
        setError(null);
      } catch (err) {
        setError("Failed to fetch drinks. Please try again later.");
        console.log(err);
      }
    };
    fetchDrinks();
  }, []);

  useEffect(() => {
    if (id || category) {
      const element = document.getElementById(id); // Temukan elemen dengan ID
      if (element) {
        const offset = 110; // Jarak tambahan ke atas
        const topPosition =
          element.getBoundingClientRect().top + window.scrollY; // Posisi elemen relatif ke viewport
        window.scrollTo({
          top: topPosition - offset, // Mengurangi offset untuk membuat posisi lebih tinggi
          behavior: "smooth",
        });
      }
    }
  }, [id, category]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // haldle untuk memperbesar gambar
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl); // Menyimpan URL gambar yang diklik
    setIsModalOpen(true); // Membuka modal
  };

  //handle close gambar besar
  const closeModal = () => {
    setIsModalOpen(false); // Tutup modal
    setCurrentImage(""); // Reset gambar saat modal ditutup
  };

  console.log(category);

  return (
    <div className="container bg-gradient-to-br  from-white to-yellow-100">
      <Header category={category} />
      <div id="menu" className="pt-[40px]">
        <div className="mt-[20px]">
          <div className=" py-6">
            <h4 className="text-center text-sm text-yellow-700">Assortments</h4>
            <h2 className="text-center font-bold text-2xl md:text-4xl">
              MENU BOOK
            </h2>
            <div className="border-t-8 mt-2 border-yellow-700 w-[80px] mx-auto"></div>
            <p className="text-center mt-1">
              Various kinds of food and drinks as well as snacks.
            </p>
          </div>
          {category.length == 0 ? (
            <MenuSkeleton />
          ) : (
            <>
              {category.map((item) => {
                return (
                  <div id={item.type} key={item.id} className="px-4 py-8 ">
                    <div className=" w-full rounded-lg">
                      <h1 className="font-bold capitalize text-center text-2xl md:text-4xl text-black">
                        {item.type}
                      </h1>
                      <div className="border-t-4 mx-auto mt-2 border-yellow-700 w-[80px]"></div>
                      <p className="text-center text-sm md:text-lg text-black mt-4">
                        Providing a variety of coffee and non-coffee drinks,
                        with quality coffee beans. Coffee adds energy as
                        caffeine stimulates the central nervous system, fighting
                        fatigue and increasing energy.
                      </p>
                      {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>} */}
                      {item.subcategories.map((item) => (
                        <div key={item.id}>
                          <h1 className="font-bold capitalize mt-4 md-mt-8 text-2xl md:text-4xl text-neutral-300">
                            {item.title}
                          </h1>
                          <div className="border-t-4 mt-2 border-yellow-700 w-[80px]"></div>
                          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                            {item.menus.map((item) => {
                              const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`;
                              return (
                                <div
                                  key={item.id}
                                  id={`${item.title}`}
                                  className="bg-slate-200 rounded-lg shadow-lg overflow-hidden"
                                >
                                  <div className="cursor-pointer">
                                    <img
                                      src={imageUrl}
                                      alt={item.title}
                                      className="w-full h-[140px] md:h-[220px] object-cover"
                                      onClick={() => handleImageClick(imageUrl)}
                                    />
                                  </div>
                                  <div className="p-4">
                                    <h1 className="text-center text-sm md:text-lg font-semibold capitalize">
                                      {item.title}
                                    </h1>
                                    <p className="text-center text-sm md:text-lg text-gray-700">
                                      {formatToRupiah(item.price)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <img
            src={currentImage}
            alt="Gambar Besar"
            className="max-w-3xl max-h-screen rounded shadow-lg"
          />
          <button
            onClick={closeModal}
            className="absolute top-6 h-8 w-8  bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full right-10 text-red-600 text-2xl "
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
