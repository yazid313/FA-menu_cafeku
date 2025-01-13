"use client";

import React, { useEffect } from "react";
import "nprogress/nprogress.css";

export default function MenuSkeleton() {
  return (
    <>
      <div className="flex">
        <div className="w-full rounded-lg shadow-md h-96 bg-gray-200 animate-pulse flex justify-center items-center">
          <h1>loading data . . .</h1>
        </div>
      </div>
    </>
  );
}
