"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UnetModel = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [redactedImage, setRedactedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageKey, setImageKey] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file: File | null = acceptedFiles[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setRedactedImage(null);
        setError("");
      }
    },
  });
  const ngrok = "https://4e50-35-185-228-57.ngrok-free.app/";
  const handleRedact = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setRedactedImage(null);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${ngrok}/predict`, {
        method: "POST",
        body: formData,
        cache: "no-cache",
      });
      const data = await response.json();
      const timestamp = new Date().getTime();
      const redactedImageUrl = `${ngrok}/${data?.redacted_image_path}?t=${timestamp}`;
      setRedactedImage(redactedImageUrl);
      setImageKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to redact the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-full bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Financial Redaction
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            Upload an image to apply advanced segmentation and redaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {image
                ? "Replace Image"
                : "Drag & drop an image here, or click to select"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preview && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Original Image
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}

            {redactedImage && (
              <div className="space-y-4 flex justify-center items-center flex-col">
                <h3 className="text-lg font-medium text-gray-900">
                  Redacted Image
                </h3>
                {/* <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video"> */}
                {/* <img
                    key={imageKey}
                    src={redactedImage}
                    alt="Redacted"
                    className="object-contain w-full h-full"
                  /> */}
                {/* </div> */}
                <Button asChild className="w-full" variant="outline">
                  <a
                    href={redactedImage}
                    download="redacted_image.jpg"
                    className="flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Download Redacted Image
                  </a>
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleRedact}
              disabled={!image || loading}
              className="w-full sm:w-auto"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Redact Image"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnetModel;
