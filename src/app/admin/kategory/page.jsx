"use client";

import axios from "axios";
import Pagination from "../paginate";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import AdminSkeleton from "../adminSkeleton/adminSkeleton";
// import AdminSkeleton from "../adminSkeleton/adminSkeleton";

export default function Kategory() {
  const [kategory, setKategory] = useState([]);
  const [outletName, setOutletName] = useState("");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // cek token
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      const outlet_id = decoded.id;
      const expirationTime = new Date(decoded.exp * 1000);
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        localStorage.removeItem("token");
        router.push(`/login`);
      } else {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/outlet/show/${outlet_id}`
          )
          .then((response) => {
            const data = response.data;
            setOutletName(data.outlet_name);
            if (data.role !== 1) {
              router.push("/login");
            }
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    } else {
      router.push(`/login`);
    }
  }, [router]);

  //mengambil data kategory
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (outletName) {
        try {
          // Mengambil data transaksi menggunakan axios dengan query params
          const response = await axios.get(
            ` ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category/showcafename/${outletName}`
          );

          const data = response.data;

          setKategory(data);
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        }
      }
    };

    setIsLoading(false);

    fetchData();
  }, [outletName]);

  // haldle untuk memperbesar gambar
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl); // Menyimpan URL gambar yang diklik
    setIsModalOpen(true); // Membuka modal
  };

  //handle untuk menghapus data
  const handleRemove = (dataRemove) => {
    const savedToken = localStorage.getItem("token");
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category/delete/${dataRemove}`,
        {
          headers: {
            Authorization: "Bearer " + savedToken,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(true);
          const fetchData = async () => {
            if (outletName) {
              try {
                // Mengambil data transaksi menggunakan axios dengan query params
                const response = await axios.get(
                  ` ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category/showcafename/${outletName}`
                );

                const data = response.data;

                setKategory(data);
              } catch (error) {
                console.error("Error fetching transaction data:", error);
              }
            }
          };

          setIsLoading(false);

          fetchData();
        } else {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className=" pl-5 pt-20 pb-8 w-full bg-white overflow-auto border-l-2">
      {isLoading ? (
        <AdminSkeleton />
      ) : (
        <>
          <h1 className="my-2 md:my-5 font-nunitoSans text-darkgray body-text-base-bold text-lg md:text-xl">
            Setting Data kategory
          </h1>
          <div className="flex flex-wrap justify-between items-center lg:w-full gap-4 md:gap-6 w-full mb-6">
            <a
              className="bg-yellow-700 body-text-sm-bold font-nunitoSans px-4 py-2 md:px-5 md:py-3 rounded-md shadow-md hover:bg-yellow-600 transition-all duration-300"
              href="/admin/kategory/create"
            >
              buat data baru
            </a>
          </div>

          <div className="rounded-lg shadow-lg bg-white overflow-x-auto ">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-yellow-700 body-text-sm-bold font-nunitoSans">
                <tr>
                  <th className="px-4 py-3 ">No</th>
                  <th className="px-4 py-3">Nama outlet</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-nunitoSans">
                {kategory &&
                  kategory.map((item, index) => {
                    const number = index + 1;
                    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-100 transition-all duration-300 border-b-2"
                      >
                        <td className="px-4 py-3 text-center">{number}</td>
                        <td className="px-4 py-3 text-center">
                          {item.outlet.outlet_name}
                        </td>
                        <td className="px-4 py-3 text-center">{item.type}</td>
                        <td className="px-4 py-3  text-center">
                          <img
                            src={item.photo ? imageUrl : "-"}
                            alt="Bukti Pembayaran"
                            className="w-12 h-12 rounded-md shadow-md cursor-pointer"
                            onClick={() => handleImageClick(imageUrl)}
                          />
                        </td>
                        <td className="px-4 py-3 flex flex-col gap-2 text-center">
                          <a
                            href={`/admin/kategory/edit?id=${item.id}`}
                            onClick={() =>
                              localStorage.setItem("id_kategory", item.id)
                            }
                            className="w-full text-blue-600"
                          >
                            edit
                          </a>
                          <button
                            className="w-full text-red-600"
                            onClick={() => handleRemove(item.id)}
                          >
                            hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {/* Modal */}
            {isModalOpen && (
              <Modal
                currentImage={currentImage}
                setIsModalOpen={setIsModalOpen}
                setCurrentImage={setCurrentImage}
              />
            )}
          </div>

          {/* Tampilkan pesan data kosong jika tidak ada data */}
          {kategory.length === 0 && (
            <div className="flex justify-center mt-6">
              <p className="italic text-red-500 border-b border-red-500">
                Data tidak ditemukan!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
