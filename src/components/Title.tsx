import React from "react";

const Title = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="md:text-3xl text-lg font-bold">{children}</h1>;
};

export default Title;
