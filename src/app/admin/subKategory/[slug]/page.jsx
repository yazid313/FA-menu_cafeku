"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import EditDataSkeleton from "../../adminSkeleton/editDataSkeleton";
import { getNewAccessToken } from "../../refreshToken";

export default function AddsubKategory({ params }) {
  const [subKategory, setSubKategory] = useState({
    id_category: "",
    title: "",
  });
  const [Kategory, setKategory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [outletName, setoutletName] = useState(null);
  const router = useRouter();
  const { slug } = React.use(params);

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
            setoutletName(data.outlet_name);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug === "edit") {
          const savedToken = localStorage.getItem("token");
          const idsubKategory = localStorage.getItem("id_subCategory");

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/subcategory/showbyid/${idsubKategory}`
          );

          const data = response.data;
          setSubKategory(data[0]);

          setSelectedFile(data[0].photo);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //handle edit dan create
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subKategory.title || !subKategory.id_category) {
      alert("Harap isi semua field!");
      return;
    }

    const formData = new FormData();
    formData.append("id_category", subKategory.id_category);
    formData.append("title", subKategory.title);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else if (subKategory.photo) {
      formData.append("photo", subKategory.photo);
    }
    const handleError = async (error) => {
      if (error.response?.status === 401) {
        try {
          const newToken = await getNewAccessToken();
          localStorage.setItem("token", newToken); // Simpan token baru
          await handleSubmit(e); // Ulangi proses dengan token baru
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
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (subKategory.id) {
        setLoadingButton(true);
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/subcategory/update/${subKategory.id}`,
          formData,
          { headers }
        );
        localStorage.removeItem("id_subKategory");
        alert("Data berhasil diperbarui!");
      } else {
        setLoadingButton(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/subcategory/create`,
          formData,
          { headers }
        );
        alert("Data berhasil ditambahkan!");
      }

      router.push("/admin/subKategory");
      setLoadingButton(false);
    } catch (error) {
      await handleError(error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/subKategory");
    localStorage.removeItem("id_subKategory");
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubKategory((subKategory) => ({
      ...subKategory,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (maksimal 2MB)!");
      return;
    }
    setSelectedFile(file);
  };

  return (
    <div className="p-8 pt-20 w-full">
      <h2 className="text-xl font-nunito">Manage subKategory</h2>
      {isLoading ? (
        <EditDataSkeleton />
      ) : (
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          <div className={` flex items-center`}>
            <label
              htmlFor="id_category"
              className="body-text-sm-normal md:body-text-base-normal font-nunitoSans min-w-28 lg:w-52"
            >
              Category:
            </label>
            <select
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="id_category"
              name="id_category"
              value={subKategory.id_category}
              onChange={handleChange}
            >
              <option value="" className="bg-primary50 " disabled>{`${
                slug == "create" ? "pilih nama kategory" : subKategory.type
              }`}</option>
              {Kategory.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="title" className="w-24">
              Title:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="title"
              placeholder="title"
              type="text"
              name="title"
              value={subKategory.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="photo" className="w-24">
              Photo:
            </label>
            <input
              className="border rounded-lg border-primary50 w-full h-8"
              id="photo"
              type="file"
              name="photo"
              onChange={handleFileChange}
            />
          </div>
          {(selectedFile || subKategory.photo) && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  slug === "create"
                    ? URL.createObjectURL(selectedFile)
                    : subKategory.photo !== selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${subKategory.photo}`
                }
                alt="event Preview"
                className="mx-auto w-40 h-40 object-cover"
              />
            </div>
          )}
          <div className="flex gap-8 text-white justify-end">
            <button
              type={loadingButton ? "button" : "submit"}
              className="bg-primary50 border-primary50 body-text-sm-bold font-nunitoSans w-[100px] p-2 rounded-md"
            >
              {loadingButton ? "Loading..." : "Simpan"}
            </button>
            <button
              type="button"
              className="bg-red-500 border-red-5bg-red-500 body-text-sm-bold font-nunitoSans w-[100px] p-2 rounded-md"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
