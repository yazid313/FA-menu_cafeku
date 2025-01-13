"use client";

import axios from "axios";
import Pagination from "./paginate";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "./modal";
import AdminSkeleton from "./adminSkeleton/adminSkeleton";

// import AdminSkeleton from "./adminSkeleton/adminSkeleton";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [outletName, setOutletName] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // cek token
  useEffect(() => {
    const savedToken = localStorage.getItem("refreshToken");

    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      const outlet_id = decoded.id;
      const expirationTime = new Date(decoded.exp * 1000);
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        localStorage.removeItem("refreshToken");
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

  //mengambil data profile
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (outletName) {
        try {
          // Mengambil data transaksi menggunakan axios dengan query params
          const response = await axios.get(
            ` ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/profile/showcafename/${outletName}`
            // {
            //   headers: {
            //     Authorization: `Bearer ${savedToken}`,
            //   },
            //   params: params,
            // }
          );

          const data = response.data;

          setProfile(data);
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

  return (
    <div className=" pl-5 pt-20 pb-8 w-full bg-white overflow-auto border-l-2">
      {isLoading ? (
        <AdminSkeleton />
      ) : (
        <>
          <h1 className="my-2 md:my-5 font-nunitoSans text-darkgray body-text-base-bold text-lg md:text-xl">
            Setting Data Profile
          </h1>

          <div className="rounded-lg shadow-lg bg-white overflow-x-auto ">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-yellow-700  body-text-sm-bold font-nunitoSans">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama Outlet</th>
                  <th className="px-4 py-3">Nama Cafe</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3">History</th>
                  <th className="px-4 py-3">Logo</th>
                  <th className="px-4 py-3">aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-nunitoSans">
                {profile &&
                  profile.map((item, index) => {
                    const number = index + 1;
                    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.logo}`;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-100 transition-all duration-300 border-b-2"
                      >
                        <td className="px-4 py-3 text-center">{number}</td>
                        <td className="px-4 py-3 text-center">
                          {item.outlet_name}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item.cafe_name}
                        </td>
                        <td className="px-4 py-3">{item.address}</td>
                        <td className="px-4 py-3">{item.history}</td>

                        <td className="px-4 py-3 flex justify-center">
                          <img
                            src={item.logo ? imageUrl : "-"}
                            alt="Bukti Pembayaran"
                            className="w-12 h-12 rounded-md shadow-md cursor-pointer"
                            onClick={() => handleImageClick(imageUrl)}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <a
                            href={`/admin/profile/edit?id=${item.id}`}
                            onClick={() =>
                              localStorage.setItem("id_profile", item.id)
                            }
                            className="w-full text-blue-600"
                          >
                            edit
                          </a>
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
          {profile.length === 0 && (
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
