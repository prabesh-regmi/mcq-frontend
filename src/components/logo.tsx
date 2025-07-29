import Image, { ImageProps } from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      src="/logo.png"
      alt="EQ Admin"
      width={32}
      height={32}
      className="size-8"
    />
  );
};

export default Logo;
