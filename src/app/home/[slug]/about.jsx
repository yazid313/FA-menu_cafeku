import axios from "axios";

import React, { useState, useEffect } from "react";
import { AboutSkeleton } from "./homeSkeleton";

export default function About({ profile }) {
  return (
    <div className=" gap-4 grid grid-cols-1 md:grid-cols-2 px-[10px] sm:px-[30px] md:px-[50px]">
      <div className="py-6">
        <h4 className=" text-2xl md:text-4xl my-5 font-semibold font-display text-yellow-700">
          About Me
        </h4>
      </div>

      <div className="bg-custom w-full bg-cover rounded h-[500px]  md:mt-20">
        {profile.length == 0 ? <AboutSkeleton /> : <h1> {profile.history}</h1>}
      </div>
    </div>
  );
}
