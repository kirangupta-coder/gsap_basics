import React, { useState } from "react";
import { CiStar } from "react-icons/ci";

const ProjectOne = ({ noOfStar = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (index) => {
    setHover(index);
    setRating(index);
  };
  const handleMouseEnter = (index) => {
    setHover(index);
  };
  const handleMouseLeave = () => {
    setHover(rating);
  };
  return (
    <>
      <h1>Give the Rating and review</h1>
      {[...Array(noOfStar)].map((_, i) => {
        i += 1;
        return (
          <CiStar
            key={i}
            className={i <= (hover || rating) ? "bg-amber-300" : "bg-black"}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            size={40}
            style={{ color: "gray" }}
            display="inline"
          />
        );
      })}
    </>
  );
};

export default ProjectOne;
