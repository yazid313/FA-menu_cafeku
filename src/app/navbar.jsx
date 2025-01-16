"use client";

import axios from "axios";
import Link from "next/link";
// import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Mendapatkan path saat ini, misalnya "/home/cecep"
  const lastPath = pathname.split("/").pop();

  const [url, setUrl] = useState(pathname);

  useEffect(() => {
    setUrl(pathname);
  });

  const onClickHeader = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white  shadow z-50 fixed w-full">
      <div className="mx-auto container ">
        <div className="flex  justify-between relative ">
          <div className="flex p-1 w-14 h-10">
            {/* Ganti placeholder dengan logo jika ada */}
            {/* {profile.logo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${profile.logo}`}
                className="w-full h-full object-contain"
                alt="Logo"
              />
            ) : (
              <p>cafe</p>
            )} */}
            pppp
          </div>
          <div className="flex  w-full ">
            <button
              onClick={onClickHeader}
              id="hamburger"
              name="hamburger"
              type="button"
              className={`${
                !isOpen ? "" : "hamburger-active"
              } block absolute right-4 md:hidden`}
            >
              <span className="hamburger-line transition duration-300 ease-in-out origin-top-left "></span>
              <span className="hamburger-line transition duration-300 ease-in-out"></span>
              <span className="hamburger-line transition duration-300 ease-in-out origin-bottom-left"></span>
            </button>

            <nav
              id="nav-menu"
              className={` ${
                isOpen ? "" : "hidden"
              } absolute p-5 md:p-0 bg-white shadow-lg rounded-lg max-w-[250px] w-full right-4 top-20 md:block md:static md:bg-transparent md:max-w-full md:shadow-none md:rounded-none`}
            >
              <ul className="block font-nunito font-bold w-full md:flex justify-end gap-10  ">
                <li className="  md:flex md:justify-center cursor-pointer">
                  <Link
                    href={`/home/${lastPath}`}
                    className="text-black md:text-black py-2 flex hover:text-yellow-700 hover:border-yellow-700 hover:border-b-2"
                  >
                    Home
                  </Link>
                </li>
                <li className=" md:flex md:justify-start cursor-pointer">
                  <Link
                    href={`/menu/${lastPath}`}
                    className="text-black md:text-black py-2 flex hover:text-yellow-700 hover:border-yellow-700 hover:border-b-2"
                  >
                    Menu
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
