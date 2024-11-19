import React from "react";

interface Props {}

function Header(props: Props) {
  const {} = props;

  return (
    <div>
      <nav className="flex justify-between p-4 items-center m-4">
        <button>Home</button>
        <button>About Us</button>
        <button>PDF Redaction</button>
        <button>Image Redaction</button>
      </nav>
    </div>
  );
}

export default Header;
