"use client";
import React from "react";
interface Props {}
import Link from "next/link";
function Header(props: Props) {
  const {} = props;
  return (
    <div>
      <nav className="flex justify-between p-4 items-center m-4">
        <Link href={"/"}>Home</Link>
        <Link href={"/about"}>About Us</Link>
        <Link href={"/gradationalRedaction"}>Gradational Redaction</Link>
        <Link href={"/unet"}>Image Segmentation</Link>
      </nav>
    </div>
  );
}

export default Header;
