import { configureStore } from "@reduxjs/toolkit";
import "./App.css";

import ImplimentingRedux from "./Screens/redux/ImplimentingRedux";
import { counterSlice } from "./Screens/redux/CounterSlice";
import UncontrolledComp from "./Screens/uncontrolledComp";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

function App() {
  return (
    <>
      {/* <ImplimentingRedux /> */}
      <UncontrolledComp />
    </>
  );
}

export default App;
