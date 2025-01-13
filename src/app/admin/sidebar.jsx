"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);
  const handleSetIsOpen = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`${
        isOpen ? "" : "hidden"
      } absolute p-5 bg-white shadow-lg rounded-lg lg:shadow-none lg:rounded-none right-4 max-w-[250px] w-[200px] lg:flex lg:static lg:w-[250px] lg:border-r lg:border-lightgray mt-20 lg:h-[630px] h-[530px] transition-all duration-300`}
    >
      <div className="flex flex-wrap gap-5 pt-4 h-[500px]">
        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin"
          className={`${
            url == "/admin" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className="mb-1">
            <img
              src="/img/profile.png"
              alt="Profile"
              className="w-4 h-4 lg:w-6 lg:h-6"
            />
          </div>
          Profile
        </Link>

        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin/kategory"
          className={`${
            url == "/admin/kategory" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className="mb-1">
            <img
              src="/img/Food.png"
              alt="Kategory"
              className="w-4 h-4 lg:w-5 lg:h-5"
            />
          </div>
          Kategory
        </Link>

        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin/subKategory"
          className={`${
            url == "/admin/subKategory" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className="mb-1">
            <img
              src="/img/snack.png"
              alt="subKategory"
              className="w-4 h-4 lg:w-5 lg:h-5"
            />
          </div>
          Sub Kategory
        </Link>

        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin/menu"
          className={`${
            url == "/admin/menu" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className="mb-1">
            <img
              src="/img/Food.png"
              alt="Menu"
              className="w-4 h-4 lg:w-5 lg:h-5"
            />
          </div>
          Menu
        </Link>

        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin/event"
          className={`${
            url == "/admin/event" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className=" lg:mb-1 ">
            <img
              src="/img/gallery.png"
              alt="Event"
              className="w-4 h-4 lg:w-6 lg:h-6"
            />
          </div>
          Event
        </Link>

        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin/gallery"
          className={`${
            url == "/admin/gallery" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className="mb-1">
            <img src="/img/gallery.png" alt="Gallery" className="w-5 h-5" />
          </div>
          Gallery
        </Link>
        <Link
          onClick={() => handleSetIsOpen()}
          href="/admin/contact"
          className={`${
            url == "/admin/contact" ? "bg-yellow-700" : "bg-gray-100"
          } flex items-center gap-2 body-text-sm-normal lg:body-text-lg-normal font-poppins lg:w-[195px] w-[150px] h-[44px] lg:h-[56px] rounded-lg px-4 py-3 cursor-pointer  hover:bg-yellow-700 hover:shadow-md transition duration-300`}
        >
          <div className="mb-1">
            <img
              src="/img/contact.png"
              alt="Contact"
              className="w-3 h-5 lg:w-6 lg:h-6"
            />
          </div>
          Contact
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
