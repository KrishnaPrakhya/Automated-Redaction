"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import RedactionConfig from "../Components/RedactionConfig";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Progress } from "@/components/ui/progress";
import { AppDispatch, RootState } from "@/redux/store";
import { setEntities } from "@/features/Options/OptionsSlice";
import ImageRedaction from "../Components/ImageRedaction";

interface Props {}

function Page(props: Props) {
  const [file, setFile] = useState<File | null>(null); // Single state for either PDF or image
  const [showConfigs, setShowConfigs] = useState(false);
  const [fileActive, setFileActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfRedaction, setPdfRedaction] = useState<boolean | null>(null);
  const [imageRedaction, setImageRedaction] = useState<boolean | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.log("No file selected!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/api/entities", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setShowConfigs(true);
        console.log(data.entities);

        dispatch(setEntities(data.entities));
      } else {
        console.error("Failed to upload the file.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Update file state
      setFileActive(true);
      console.log("File selected:", selectedFile);
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
        <div className="flex flex-col  gap-4">
          <div className="flex gap-4">
            <Button
              variant={pdfRedaction ? "destructive" : "default"}
              onClick={() => {
                setPdfRedaction(true);
                setImageRedaction(false);
              }}
            >
              PDF Redaction
            </Button>
            <Button
              variant={imageRedaction ? "destructive" : "default"}
              onClick={() => {
                setImageRedaction(true);
                setPdfRedaction(false);
              }}
            >
              Image Redaction
            </Button>
          </div>
          <div>
            {imageRedaction && (
              <div>
                <h1>Redact Your Images like never before ever after</h1>
              </div>
            )}
            {pdfRedaction && (
              <div>
                <h1>Redact Your PDFs like never before ever after</h1>
              </div>
            )}
          </div>
        </div>
        {(pdfRedaction || imageRedaction) && (
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
                <h3>Click Here To Upload The File To Be Redacted!</h3>
              </div>
            ) : (
              <h1>File Uploaded!</h1>
            )}
            <Button onClick={handleFileUpload}>Handle Flask</Button>
          </div>
        )}
        {showConfigs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-[550px] flex-none bg-gray-500 "
          >
            <RedactionConfig File={file} />{" "}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Page;
