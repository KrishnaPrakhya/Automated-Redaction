"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import RedactionLevel1 from "./RedactionLevel1";
import RedactionLevel2 from "./RedactionLevel2";
import RedactionLevel3 from "./RedactionLevel3";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setLevel } from "@/features/Options/OptionsSlice";
import { Progress } from "@/components/ui/progress";
import { setProgressNum } from "@/features/progress/ProgressSlice";
interface Props {
  pdfFile: File | null;
}

type ConfigType = "Mask" | "Category" | "Synthetic";

function RedactionConfig(props: Props) {
  const { pdfFile } = props;

  const [activeLevel, setActiveLevel] = useState<ConfigType | null>(null);
  const { progressNum } = useSelector(
    (state: RootState) => state.ProgressSlice
  );

  const renderActiveComponent = () => {
    switch (activeLevel) {
      case "Mask":
        return <RedactionLevel1 pdfFile={pdfFile} />;
      case "Category":
        return <RedactionLevel2 pdfFile={pdfFile} />;
      case "Synthetic":
        return <RedactionLevel3 pdfFile={pdfFile} />;
      default:
        return null;
    }
  };
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center">
      <Progress value={progressNum} className="w-[60%]" />
      {!activeLevel && (
        <motion.div className="flex flex-col gap-6">
          <motion.div
            onClick={() => {
              setActiveLevel("Mask");
              dispatch(setLevel("Mask"));
              dispatch(setProgressNum(30));
            }}
            className=" cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: "20px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
            }}
          >
            <motion.button className="text-lg font-medium">
              Level-1 (Masking)
            </motion.button>
          </motion.div>

          <motion.div
            onClick={() => {
              setActiveLevel("Category");
              dispatch(setLevel("Category"));
              dispatch(setProgressNum(30));
            }}
            className=" cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: "20px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
            }}
          >
            <motion.button className="text-lg font-medium">
              Level-2 (Entities Replacement)
            </motion.button>
          </motion.div>

          <motion.div
            onClick={() => {
              setActiveLevel("Synthetic");
              dispatch(setLevel("Synthetic"));
              dispatch(setProgressNum(30));
            }}
            className=" cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: "20px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
            }}
          >
            <motion.button className="text-lg font-medium">
              Level-3 (Synthetic Replacement)
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {activeLevel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex items-center justify-center  cursor-pointer"
        >
          {renderActiveComponent()}
        </motion.div>
      )}

      {activeLevel && (
        <motion.button
          onClick={() => {
            setActiveLevel(null);
            dispatch(setProgressNum(0));
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 p-2 bg-emerald-500 text-white rounded cursor-pointer"
        >
          Back to Level Selection
        </motion.button>
      )}
    </div>
  );
}

export default RedactionConfig;
