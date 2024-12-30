"use client";
import React from "react";
import GradationalRedaction from "./page";
import UnetModel from "./page";
import { motion } from "framer-motion";
interface Props {}

function Layout(props: Props) {
  const {} = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, transition: { duration: 0.5 }, y: 0 }}
      className="px-5"
    >
      <div className="flex items-center mb-20 justify-between mt-20 ">
        <h1 className="text-6xl font-bold  gradient-title tracking-tighter">
          Unet Model
        </h1>
      </div>
      <UnetModel />
    </motion.div>
  );
}

export default Layout;
