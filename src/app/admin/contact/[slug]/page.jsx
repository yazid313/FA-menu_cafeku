"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import EditDataSkeleton from "../../adminSkeleton/editDataSkeleton";

export default function AddContact({ params }) {
  const [contact, setContact] = useState({
    contact_name: "",
    value: "",
  });
  const [outletId, setOutletId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [idOutlet, setIdOutlet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
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

  //mengambildata contact ketika edit
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug === "edit") {
          const idContact = localStorage.getItem("id_contact");

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/contact/show/${idContact}`
          );

          const data = response.data;
          setContact(data);

          setSelectedFile(data.logo);
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
    if (!contact.contact_name || !contact.value) {
      alert("Harap isi semua field!");
      return;
    }

    const formData = new FormData();
    formData.append("id_outlet", outletId);
    formData.append("contact_name", contact.contact_name);
    formData.append("value", contact.value);

    if (selectedFile) {
      formData.append("logo", selectedFile);
    } else if (contact.logo) {
      formData.append("logo", contact.logo);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (contact.id) {
        setLoadingButton(true);
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/contact/update/${contact.id}`,
          formData,
          { headers }
        );
        localStorage.removeItem("id_contact");
        alert("Data berhasil diperbarui!");
      } else {
        setLoadingButton(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/contact/create`,
          formData,
          { headers }
        );
        alert("Data berhasil ditambahkan!");
      }

      router.push("/admin/contact");
      setLoadingButton(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    router.push("/admin/contact");
    localStorage.removeItem("id_contact");
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((contact) => ({
      ...contact,
      [name]: value,
    }));
  };

  //handle perubahan state image
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
      <h2 className="text-xl font-nunito">Manage Contact</h2>
      {isLoading ? (
        <EditDataSkeleton />
      ) : (
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-2">
            <label htmlFor="contact_name" className="w-24">
              Contact_name:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="contact_name"
              placeholder="contact_name"
              type="text"
              name="contact_name"
              value={contact.contact_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="value" className="w-24">
              value:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="value"
              placeholder="Value"
              type="text"
              name="value"
              value={contact.value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="photo" className="w-24">
              Logo:
            </label>
            <input
              className="border rounded-lg border-primary50 w-full h-8"
              id="logo"
              type="file"
              name="logo"
              onChange={handleFileChange}
            />
          </div>
          {(selectedFile || contact.logo) && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  slug === "create"
                    ? URL.createObjectURL(selectedFile)
                    : contact.logo !== selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${contact.logo}`
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
