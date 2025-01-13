"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import EditDataSkeleton from "../../adminSkeleton/editDataSkeleton";

export default function AddMenu({ params }) {
  const [menu, setMenu] = useState({
    id_subcategory: "",
    title: "",
    price: "",
    best_seller: "",
    title_subcategory: "",
  });
  const [outletName, setoutletName] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [idOutlet, setIdOutlet] = useState([]);
  const router = useRouter();
  const { slug } = React.use(params);

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

  //menampilkan semua sub category
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (outletName) {
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
          const idMenu = localStorage.getItem("id_menu");

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/showbyid/${idMenu}`
          );

          const data = response.data;
          setMenu(data[0]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !menu.id_subcategory ||
      !menu.title ||
      !menu.price ||
      !menu.best_seller
    ) {
      alert("Harap isi semua field!");
      return;
    }

    const formData = new FormData();
    formData.append("id_subcategory", menu.id_subcategory);
    formData.append("title", menu.title);
    formData.append("price", menu.price);
    formData.append("best_seller", menu.best_seller);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else if (menu.photo) {
      formData.append("photo", menu.photo);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (menu.id) {
        setLoadingButton(true);
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/update/${menu.id}`,
          formData,
          { headers }
        );
        localStorage.removeItem("id_menu");
        alert("Data berhasil diperbarui!");
      } else {
        setLoadingButton(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/menu/create`,
          formData,
          { headers }
        );
        alert("Data berhasil ditambahkan!");
      }

      router.push("/admin/menu");
      setLoadingButton(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    router.push("/admin/menu");
    localStorage.removeItem("id_menu");
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((menu) => ({
      ...menu,
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
      <h2 className="text-xl font-nunito">Manage menu</h2>
      {isLoading ? (
        <EditDataSkeleton />
      ) : (
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          <div className={` flex items-center`}>
            <label
              htmlFor="id_subcategory"
              className="body-text-sm-normal md:body-text-base-normal font-nunitoSans min-w-28 lg:w-52"
            >
              Subcategory:
            </label>
            <select
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="id_subcategory"
              name="id_subcategory"
              value={menu.id_subcategory}
              onChange={handleChange}
            >
              <option value="" className="bg-primary50 " disabled>{`${
                slug == "create"
                  ? "pilih nama subcategory"
                  : menu.title_subcategory
              }`}</option>
              {subCategory.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.title}
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
              placeholder="Title"
              type="text"
              name="title"
              value={menu.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="price" className="w-24">
              Price:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="price"
              placeholder="Price"
              type="number"
              name="price"
              value={menu.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="best_seller" className="w-24">
              best_seller:
            </label>
            <select
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="best_seller"
              name="best_seller"
              value={menu.best_seller}
              onChange={handleChange}
            >
              <option value="">{`${
                slug == "create" ? "apakah ini best seller?" : menu.best_seller
              }`}</option>
              <option>true</option>
              <option>false</option>
            </select>
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
          {(selectedFile || menu.photo) && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  slug === "create"
                    ? URL.createObjectURL(selectedFile)
                    : menu.photo !== selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${menu.photo}`
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
