"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import RedactionConfig from "./RedactionConfig";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Progress } from "@/components/ui/progress";
import { AppDispatch } from "@/redux/store";
import { setEntities } from "@/features/Options/OptionsSlice";
interface Props {}

function DashBoard(props: Props) {
  const {} = props;
  const [progress, setProgress] = useState(0);
  const [fileActive, setFileActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showConfigs, setShowConfigs] = useState(false);
  const [fileUrl, setFileUrl] = useState<null | string>("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // const [entities, setEntities] = useState([]);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async () => {
    if (!fileObj) {
      console.log("No file selected!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileObj);

      const response = await fetch("http://127.0.0.1:5000/api/entities", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setShowConfigs(true);
        console.log(data.entities);
        console.log("hi");

        dispatch(setEntities(data.entities));
      } else {
        console.error("Failed to upload the file.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileObj(file);
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setFileActive(true);
      console.log("File selected:", file);
      setFileUrl(url);
    }
  };
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="h-screen w-screen flex justify-center items-center">

      <div
        className={`flex w-full ${
          showConfigs ? "justify-between" : "justify-center"
        } items-center gap-4 text-center`}
      >
        {/* {fileUrl && <PDFComponent fileUrl={fileUrl} />} */}
        <div className="flex flex-col items-center justify-center w-full ">
          {!fileActive ? (
            <div className="flex flex-col justify-center gap-4 items-center">
              <input
                type="file"
                accept=".pdf, image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                onClick={handleButtonClick}
                variant="secondary"
                color="fill"
              >
                Click Here!
              </Button>
              <h3>Click Here To upload The file to be redacted!</h3>
            </div>
          ) : (
            <h1>File Uploaded!</h1>
          )}
          <Button onClick={handleFileUpload}>Flask ni gelukufy</Button>
        </div>
        <div></div>
        {showConfigs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-[550px] flex-none bg-gray-500 "
          >
            <RedactionConfig pdfFile={pdfFile} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DashBoard;
