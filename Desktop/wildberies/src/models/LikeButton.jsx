import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className="transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Like"
    >
      {liked ? (
        <FaHeart className="w-5 h-5 text-red-500 transition-colors duration-300" />
      ) : (
        <FaRegHeart className="w-5 h-5 text-gray-400 hover:text-red-300 transition-colors duration-300" />
      )}
    </button>
  );
}
