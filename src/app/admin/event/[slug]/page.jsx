"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import EditDataSkeleton from "../../adminSkeleton/editDataSkeleton";

export default function Addevents({ params }) {
  const [events, setEvents] = useState({
    title: "",
    description: "",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug === "edit") {
          const idEvent = localStorage.getItem("id_event");

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/event/show/${idEvent}`
          );

          const data = response.data;
          setEvents(data);

          setSelectedFile(data.photo);
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
    if (!events.title || !events.description) {
      alert("Harap isi semua field!");
      return;
    }

    const formData = new FormData();
    formData.append("id_outlet", outletId);
    formData.append("title", events.title);
    formData.append("description", events.description);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else if (events.photo) {
      formData.append("photo", events.photo);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (events.id) {
        setLoadingButton(true);
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/event/update/${events.id}`,
          formData,
          { headers }
        );
        localStorage.removeItem("id_event");
        alert("Data berhasil diperbarui!");
      } else {
        setLoadingButton(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/event/create`,
          formData,
          { headers }
        );
        alert("Data berhasil ditambahkan!");
      }

      router.push("/admin/event");
      setLoadingButton(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    router.push("/admin/event");
    localStorage.removeItem("id_event");
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvents((events) => ({
      ...events,
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
      <h2 className="text-xl font-nunito">Manage events</h2>
      {isLoading ? (
        <EditDataSkeleton />
      ) : (
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
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
              value={events.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="description" className="w-24">
              Description:
            </label>
            <input
              className="border p-1 rounded-lg border-primary50 w-full h-8"
              id="description"
              placeholder="description"
              type="text"
              name="description"
              value={events.description}
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
          {(selectedFile || events.photo) && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  slug === "create"
                    ? URL.createObjectURL(selectedFile)
                    : events.photo !== selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${events.photo}`
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
