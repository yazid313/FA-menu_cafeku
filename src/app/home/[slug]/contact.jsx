"use client";
import React, { useState, useEffect } from "react";
import { HomeSkeleton } from "./homeSkeleton";

export default function Contact({ contact }) {
  return (
    <div className="">
      <div className="px-[20px] md:px-[100px] lg:px-[200px] text-white bg-yellow-700">
        <div className=" py-6">
          <p className="text-center text-xs md:text-sm my-4 font-semibold uppercase">
            get up close and personal
          </p>
          <h2 className="text-center font-bold font-display text-2xl md:text-4xl  ">
            CONTACT US
          </h2>
          <div className="border-t-8 mt-4 border-white-700 w-[80px] mx-auto"></div>
        </div>
      </div>
      {contact.length == 0 ? (
        <div className="px-[20px] md:px-[50px] lg:px-[100px]">
          <HomeSkeleton />
        </div>
      ) : (
        <div className=" pt-14 gap-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 px-[10px] sm:px-[30px] md:px-[200px]">
          {contact.map((dr, index) => (
            <div key={index} className=" p-2 border-r-4 border-yellow-700 ">
              <div className=" rounded">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${dr.logo}`}
                  alt={dr.contact_name}
                  className="mx-auto w-[44px] h-[50px]"
                />
                <p className="text-center font-bold capitalize">
                  {dr.contact_name}
                </p>
                <a href={`/${dr.contact_name}/${dr.value}`}>
                  <p className="text-center font-bold capitalize">{dr.value}</p>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
