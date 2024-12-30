"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RedactionConfig from "../Components/RedactionConfig";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  FileText,
  Image,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { setEntities } from "@/features/Options/OptionsSlice";

function GradationalRedaction() {
  const [file, setFile] = useState<File | null>(null);
  const [showConfigs, setShowConfigs] = useState(false);
  const [fileActive, setFileActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfRedaction, setPdfRedaction] = useState<boolean | null>(null);
  const [imageRedaction, setImageRedaction] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const uploadSuccessRef = useRef<HTMLDivElement>(null);
  const configSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fileActive && uploadSuccessRef.current) {
      uploadSuccessRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [fileActive]);

  useEffect(() => {
    if (showConfigs && configSectionRef.current) {
      configSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showConfigs]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/api/entities", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setShowConfigs(true);
        dispatch(setEntities(data.entities));
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 mt-14">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Intelligent Document Redaction System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Choose your redaction type and follow the simple steps to secure
              your documents
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl shadow-lg transition-colors ${
                pdfRedaction
                  ? "bg-purple-100 border-2 border-purple-500"
                  : "bg-white"
              }`}
              onClick={() => {
                setPdfRedaction(true);
                setImageRedaction(false);
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <FileText size={32} className="text-purple-600" />
                <h2 className="text-xl font-semibold">PDF Redaction</h2>
              </div>
              <p className="text-gray-600">
                Securely redact sensitive information from PDF documents while
                maintaining document structure and formatting.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl shadow-lg transition-colors ${
                imageRedaction
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              }`}
              onClick={() => {
                setImageRedaction(true);
                setPdfRedaction(false);
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image size={32} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Image Redaction</h2>
              </div>
              <p className="text-gray-600">
                Protect sensitive information in images with advanced redaction
                techniques and customizable masking options.
              </p>
            </motion.div>
          </div>

          {(pdfRedaction || imageRedaction) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card>
                <CardContent className="p-6">
                  {!fileActive ? (
                    <div className="text-center">
                      <input
                        type="file"
                        accept={pdfRedaction ? ".pdf" : "image/*"}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Upload your {pdfRedaction ? "PDF" : "image"} file
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Click to select or drag and drop your file here
                        </p>
                        <Button
                          onClick={handleButtonClick}
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        >
                          Select File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div ref={uploadSuccessRef} className="text-center">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        File uploaded successfully!
                      </h3>
                      <Button
                        onClick={handleFileUpload}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      >
                        {isUploading ? "Processing..." : "Start Redaction"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {showConfigs && (
            <motion.div
              ref={configSectionRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-lg overflow-y-scroll"
            >
              <RedactionConfig File={file} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default GradationalRedaction;
