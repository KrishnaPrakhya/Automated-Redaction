import React from "react";
import AboutUs from "./page";

interface Props {}

function Layout(props: Props) {
  const {} = props;

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mt-20 mb-5">
        <h1 className="text-6xl font-bold  gradient-title !tracking-[0.01em]">
          About
        </h1>
      </div>
      <AboutUs />
    </div>
  );
}

export default Layout;
