import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import ProjectOne from "./Screens/ProjectOne";
// import ProjectTwo from "./Screens/ProjectTwo";
import LoadMoreProducts from "./Screens/LoadMoreProducts";
import { ScrollTrigger, SplitText } from "gsap/all";
import gsap from "gsap";
import Mojito from "./Screens/Mojito";

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  return (
    <>
      {/* <ProjectOne /> */}
      {/* <ProjectTwo /> */}
      {/* <LoadMoreProducts /> */}
      <Mojito />
    </>
  );
}

export default App;
