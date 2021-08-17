import React from "react";
import { WanderingCubes } from "better-react-spinkit";

export interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <section className="component-loading h-screen flex justify-center items-center">
      <WanderingCubes size={50} cubeSize={12} color="#4297BA" />
    </section>
  );
};

export { Loader };
