"use client";

import React, { useEffect } from "react";
import "nprogress/nprogress.css";

export function HomeSkeleton() {
  return (
    <div className="flex">
      <div className="w-full rounded-lg shadow-md h-40 bg-gray-200 animate-pulse"></div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="flex">
      <div className="w-full rounded-lg shadow-md h-80 bg-gray-200 animate-pulse"></div>
    </div>
  );
}
