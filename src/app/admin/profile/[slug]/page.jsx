"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import EditDataSkeleton from "../../adminSkeleton/editDataSkeleton";

export default function AddProfile({ params }) {
  const [profile, setProfile] = useState({
    cafe_name: "",
    address: "",
    history: "",
  });
  const [outletId, setOutletId] = useState("");
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
            setOutletId(data.id);
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

  //CARI DATA BERDASARKAN ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug === "edit") {
          const idProfile = localStorage.getItem("id_profile");

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/profile/show/${idProfile}`
          );

          const data = response.data;
          setProfile(data[0]);

          setSelectedFile(data[0].logo);
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

    const formData = new FormData();
    formData.append("id_outlet", outletId);
    formData.append("cafe_name", profile.cafe_name);
    formData.append("address", profile.address);
    formData.append("history", profile.history);

    if (selectedFile) {
      formData.append("logo", selectedFile);
    } else if (profile.logo) {
      formData.append("logo", profile.logo);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      setLoadingButton(true);

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/profile/update/${profile.id}`,
        formData,
        { headers }
      );
      alert("Data berhasil diperbarui!");
      localStorage.removeItem("id_profile");
      router.push("/admin");
      setLoadingButton(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    router.push("/admin");
    localStorage.removeItem("id_profile");
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((profile) => ({
      ...profile,
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
      <h2 className="text-xl font-nunito">Manage profile</h2>
      {isLoading ? (
        <EditDataSkeleton />
      ) : (
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-2">
            <label htmlFor="cafe_name" className="w-24">
              Cafe_name:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="cafe_name"
              placeholder="cafe_name"
              type="text"
              name="cafe_name"
              value={profile.cafe_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="address" className="w-24">
              Address:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="address"
              placeholder="Address"
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="history" className="w-24">
              History:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="history"
              placeholder="history"
              type="text"
              name="history"
              value={profile.history}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="logo" className="w-24">
              logo:
            </label>
            <input
              className="border rounded-lg border-primary50 w-full h-8"
              id="logo"
              type="file"
              name="logo"
              onChange={handleFileChange}
            />
          </div>
          {(selectedFile || profile.logo) && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  slug === "create"
                    ? URL.createObjectURL(selectedFile)
                    : profile.logo !== selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${profile.logo}`
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
