import React, { useRef } from "react";

const UncontrolledComp = () => {
  const ref = useRef("ram");
  const hadleRef = (e) => {
    e.preventDefault();
    console.log("refdata", ref.current.value);
  };
  return (
    <form onSubmit={hadleRef}>
      <input
        type="text"
        ref={ref}
        placeholder="enter name"
        defaultValue={"initial"}
        className="bg-amber-300"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledComp;
