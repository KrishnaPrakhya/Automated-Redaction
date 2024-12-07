"use client";
import React from "react";
interface Props {}
import Link from "next/link";
function Header(props: Props) {
  const {} = props;
  return (
    <div>
      <nav className="flex justify-between p-4 items-center m-4">
        <button>Home</button>
        <button>About Us</button>
        <button>PDF Redaction</button>
        <button>Image Redaction</button>
        <Link href={"/unet"}>Image Segmentation</Link>
      </nav>
    </div>
  );
}

export default Header;
