import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Upload = () => {
  const { removeBg } = useContext(AppContext);

  return (
    <div className="pb-16">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 p-2 font-semibold bg-gradient-to-r from-black to-white bg-clip-text text-transparent py-6 md:py-16">
        See the magic. Try now
      </h1>
      <div className="text-center mb-24">
        <input
          onChange={(e) => removeBg(e.target.files[0])}
          type="file"
          accept="image/*"
          id="upload2"
          hidden
        />
        <label
          htmlFor="upload2"
          className="inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-600 m-auto hover:scale-105 transtion-all duration-700 "
        >
          <img width={20} src={assets.upload_btn_icon} alt="" />
          <p className="text-white text-sm">Upload your img</p>
        </label>
      </div>
    </div>
  );
};

export default Upload;
