"use client";

import Image from "next/image";
import axios from "axios";
import Pagination from "../paginate";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import AdminSkeleton from "../adminSkeleton/adminSkeleton";
// import AdminSkeleton from "../adminSkeleton/adminSkeleton";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [outletName, setOutletName] = useState("");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  //use state untuk pagination
  const [rows, setRows] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 item per halaman
  const targetRef = useRef(null);

  // Menghitung indeks awal dan akhir untuk menampilkan nomber
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Data yang disimpan dalam state
  //set untuk page yg di tampilkan
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  //setiap kali ada perubahan di current page maka scroll ke atas
  useEffect(() => {
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  //stabilo pencarian
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi"); // Cari query (case-insensitive)
    const parts = text.split(regex); // Pisah teks berdasarkan query

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-green-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // useEffect untuk search
  useEffect(() => {
    setSearchQuery(menu);
  }, [menu]);

  //handle pencarian
  const searchData = () => {
    setIsLoading(true);
    setCurrentPage(1);
    const fetchData = async () => {
      outletName;

      if (outletName) {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: query,
          outlet_name: outletName,
        };
        try {
          // Mengambil data transaksi menggunakan axios dengan query params
          const response = await axios.get(
            `  ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/show`,
            {
              params: params,
            }
          );

          const data = response.data.menu;
          setMenu(data);
          setRows(response.data.totalItems);
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        }
      }
    };
    setIsLoading(false);

    fetchData();
  };

  // mengambil data lapangan by limit
  useEffect(() => {
    if (query === "") {
      setIsLoading(true);
      const fetchData = async () => {
        if (outletName) {
          const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: query,
            outlet_name: outletName,
          };
          try {
            // Mengambil data transaksi menggunakan axios dengan query params
            const response = await axios.get(
              `  ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/show`,
              {
                params: params,
              }
            );

            const data = response.data.menu;
            setMenu(data);
            setRows(response.data.totalItems);
          } catch (error) {
            console.error("Error fetching transaction data:", error);
          }
        }
      };
      setIsLoading(false);

      fetchData();
    } else {
      setIsLoading(true);
      const fetchData = async () => {
        if (outletName) {
          const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: query,
            outlet_name: outletName,
          };
          try {
            // Mengambil data transaksi menggunakan axios dengan query params
            const response = await axios.get(
              `  ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/show`,
              {
                params: params,
              }
            );

            const data = response.data.menu;
            setMenu(data);
            setRows(response.data.totalItems);
          } catch (error) {
            console.error("Error fetching transaction data:", error);
          }
        }
      };
      setIsLoading(false);

      fetchData();
    }
  }, [itemsPerPage, currentPage, outletName]);

  //handle untuk menghapus data
  const handleRemove = (dataRemove) => {
    const savedToken = localStorage.getItem("token");
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/delete/${dataRemove}`,
        {
          headers: {
            Authorization: "Bearer " + savedToken,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          const fetchData = async () => {
            if (outletName) {
              const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: query,
                outlet_name: outletName,
              };
              try {
                // Mengambil data transaksi menggunakan axios dengan query params
                const response = await axios.get(
                  `  ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/show`,
                  {
                    headers: {
                      Authorization: `Bearer ${savedToken}`,
                    },
                    params: params,
                  }
                );

                const data = response.data.menu;
                setMenu(data);
                setRows(response.data.totalItems);
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

  const handleUpdate = (dataUdate, boolean) => {
    const savedToken = localStorage.getItem("token");

    const best = {
      best_seller: boolean,
    };
    axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/update/${dataUdate}`,
        best,
        {
          headers: {
            Authorization: "Bearer " + savedToken,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const fetchData = async () => {
            if (outletName) {
              const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: query,
                outlet_name: outletName,
              };
              try {
                // Mengambil data transaksi menggunakan axios dengan query params
                const response = await axios.get(
                  `  ${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/show`,
                  {
                    headers: {
                      Authorization: `Bearer ${savedToken}`,
                    },
                    params: params,
                  }
                );

                const data = response.data.menu;
                setMenu(data);
                setRows(response.data.totalItems);
              } catch (error) {
                console.error("Error fetching transaction data:", error);
              }
            }
          };

          fetchData();
        } else {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // haldle untuk memperbesar gambar
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl); // Menyimpan URL gambar yang diklik
    setIsModalOpen(true); // Membuka modal
  };

  return (
    <div
      ref={targetRef}
      className=" pl-5 pt-20 pb-8 w-full bg-white overflow-auto border-l-2"
    >
      {isLoading ? (
        <AdminSkeleton />
      ) : (
        <>
          <h1 className="my-2 md:my-5 font-nunitoSans text-darkgray body-text-base-bold text-lg md:text-xl">
            Setting Data menu
          </h1>
          <div className="flex flex-wrap justify-between items-center lg:w-full gap-4 md:gap-6 w-full mb-6">
            <div className="flex gap-3 items-center ">
              <input
                type="text"
                placeholder="Nama menu. . ."
                id="search"
                className="px-4 py-2 md:px-5 md:py-3 h-[40px] md:h-[48px] w-[200px] md:w-[300px] text-gray-700 body-text-sm md:body-text-base font-poppins border border-gray-300 focus:outline-primary50 rounded-md shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={searchData}
                className="px-4 py-2 md:px-5 md:py-3 h-[40px] md:h-[48px] bg-yellow-700 body-text-sm-bold font-nunitoSans rounded-md shadow-md hover:bg-yellow-600 transition-all duration-300"
              >
                Cari
              </button>
            </div>

            <a
              className="bg-yellow-700 body-text-sm-bold font-nunitoSans px-4 py-2 md:px-5 md:py-3 rounded-md shadow-md hover:bg-yellow-700 transition-all duration-300"
              href="/admin/menu/create"
            >
              buat data baru
            </a>
          </div>

          <div className="rounded-lg shadow-lg bg-white overflow-x-auto ">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-yellow-700 body-text-sm-bold font-nunitoSans">
                <tr>
                  <th className="px-4 py-3 ">No</th>
                  <th className="px-4 py-3">Nama Sub Kategory</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Best Seller</th>
                  <th className="px-4 py-3">Konfirmasi</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-nunitoSans">
                {searchQuery &&
                  searchQuery.map((item, index) => {
                    const number = indexOfFirstItem + index + 1;
                    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.photo}`;
                    return (
                      <tr
                        key={number}
                        className="hover:bg-gray-100 transition-all duration-300 border-b-2"
                      >
                        <td className="px-4 py-3 text-center">{number}</td>
                        <td className="px-4 py-3">{item.subcategory_title}</td>
                        <td className="px-4 py-3">
                          {highlightText(item.title, query)}
                        </td>
                        <td className="px-4 py-3">{item.price}</td>

                        <td className="px-4 py-3 ">
                          <img
                            src={item.photo ? imageUrl : "-"}
                            alt="Bukti Pembayaran"
                            className="w-12 h-12 rounded-md shadow-md cursor-pointer"
                            onClick={() => handleImageClick(imageUrl)}
                          />
                        </td>
                        <td className="px-4 py-3">{item.best_seller}</td>
                        <td className="px-4 py-3">
                          {" "}
                          <button
                            className="bg-yellow-700 text-white rounded-lg p-2"
                            onClick={() =>
                              handleUpdate(
                                item.id,
                                item.best_seller === "true" ? false : true
                              )
                            }
                          >
                            {item.best_seller === "true"
                              ? "Non Best Seller"
                              : "Best Seller"}
                          </button>
                        </td>
                        <td className="px-4 py-3 flex flex-col gap-2 text-center">
                          <a
                            href={`/admin/menu/edit?id=${item.id}`}
                            onClick={() =>
                              localStorage.setItem("id_menu", item.id)
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

          {/* Tampilkan navigasi pagination */}
          {searchQuery.length > 0 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              rows={rows}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}

          {/* Tampilkan pesan data kosong jika tidak ada data */}
          {searchQuery.length === 0 && (
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
