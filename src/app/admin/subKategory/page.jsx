"use client";

import axios from "axios";
import Pagination from "../paginate";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import AdminSkeleton from "../adminSkeleton/adminSkeleton";
import { getNewAccessToken } from "../refreshToken";
// import AdminSkeleton from "../adminSkeleton/adminSkeleton";

export default function subCategory() {
  const [subCategory, setSubCategory] = useState([]);
  const [outletName, setOutletName] = useState("");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // cek token
  useEffect(() => {
    const savedToken = localStorage.getItem("refreshToken");

    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      const outlet_id = decoded.id;
      const expirationTime = new Date(decoded.exp * 1000);
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        localStorage.clear();
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

  //function mengambil data subCategory
  const fetchData = async () => {
    try {
      // Mengambil data transaksi menggunakan axios dengan query params
      const response = await axios.get(
        ` ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/subcategory/showcafename/${outletName}`
      );

      const data = response.data;

      setSubCategory(data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  //useEffect mengambil data subCategory
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true); // Tampilkan loading
      try {
        await fetchData(); // Tunggu hingga pengambilan data selesai
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Pastikan loading dihentikan
      }
    };

    if (outletName) {
      loadData();
    }
  }, [outletName]);

  // haldle untuk memperbesar gambar
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl); // Menyimpan URL gambar yang diklik
    setIsModalOpen(true); // Membuka modal
  };

  //handle untuk menghapus data
  const handleRemove = async (dataRemove) => {
    const savedToken = localStorage.getItem("token");

    const handleError = async (error) => {
      if (error.response?.status === 401) {
        try {
          const newToken = await getNewAccessToken();
          localStorage.setItem("token", newToken); // Simpan token baru
          await handleRemove(dataRemove); // Ulangi proses dengan token baru
        } catch (err) {
          console.error("Failed to refresh token:", err);
          alert("Session Anda telah berakhir. Silakan login ulang.");
          localStorage.clear();
          router.push("/login");
        }
      } else {
        console.error("Error deleting contact:", error);
      }
    };

    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/subcategory/delete/${dataRemove}`,
        { headers: { Authorization: `Bearer ${savedToken}` } }
      );

      if (response.status === 200) {
        await fetchData();
        setIsLoading(false);
      }
    } catch (error) {
      await handleError(error);
    }
  };

  return (
    <div className=" pl-5 pt-20 pb-8 w-full bg-white overflow-auto border-l-2">
      {isLoading ? (
        <AdminSkeleton />
      ) : (
        <>
          <h1 className="my-2 md:my-5 font-nunitoSans text-darkgray body-text-base-bold text-lg md:text-xl">
            Setting Data subCategory
          </h1>
          <div className="flex flex-wrap justify-between items-center lg:w-full gap-4 md:gap-6 w-full mb-6">
            <a
              className="bg-yellow-700 body-text-sm-bold font-nunitoSans px-4 py-2 md:px-5 md:py-3 rounded-md shadow-md hover:bg-yellow-600 transition-all duration-300"
              href="/admin/subKategory/create"
            >
              buat data baru
            </a>
          </div>

          <div className="rounded-lg shadow-lg bg-white overflow-x-auto ">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-yellow-700  body-text-sm-bold font-nunitoSans">
                <tr>
                  <th className="px-4 py-3 ">No</th>
                  <th className="px-4 py-3">Nama category</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-nunitoSans">
                {subCategory &&
                  subCategory.map((item, index) => {
                    const number = index + 1;
                    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-100 transition-all duration-300 border-b-2"
                      >
                        <td className="px-4 py-3 text-center">{number}</td>
                        <td className="px-4 py-3 text-center">{item.type}</td>
                        <td className="px-4 py-3 text-center">{item.title}</td>
                        <td className="px-4 py-3 text-center">
                          <img
                            src={item.photo ? imageUrl : "-"}
                            alt="Bukti Pembayaran"
                            className="w-12 h-12 rounded-md shadow-md cursor-pointer"
                            onClick={() => handleImageClick(imageUrl)}
                          />
                        </td>
                        <td className="px-4 py-3 flex flex-col gap-2 text-center">
                          <a
                            href={`/admin/subKategory/edit?id=${item.id}`}
                            onClick={() =>
                              localStorage.setItem("id_subCategory", item.id)
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
          {subCategory.length === 0 && (
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
