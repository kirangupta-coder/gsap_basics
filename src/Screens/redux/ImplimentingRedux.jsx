import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decreament, increament, reset } from "./CounterSlice";

function ImplimentingRedux() {
  const count = useSelector((state) => state.counter.count);
  const dispath = useDispatch();
  return (
    <>
      <h1>Counter: {count}</h1>
      {/* <input value={count} onChange={()=} /> */}
      <button
        onClick={() => dispath(increament())}
        className="bg-amber-500 p-2 rounded-xxl m-6 text-xl font-bold"
      >
        Increament
      </button>
      <button
        onClick={() => dispath(decreament())}
        className="bg-amber-900 p-2 rounded-xxl m-6 text-xl font-bold"
      >
        Decreament
      </button>
      <button
        onClick={() => dispath(reset())}
        className="bg-amber-100 p-2 rounded-xxl m-6 text-xl font-bold"
      >
        Reset
      </button>
    </>
  );
}
export default ImplimentingRedux;
