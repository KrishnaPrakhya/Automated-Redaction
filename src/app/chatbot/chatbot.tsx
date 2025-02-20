"use client";
import React, { useState } from "react";
import { Upload, File, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const RedactionInterface = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  interface RedactionResult {
    message: string;
    redacted_file_url?: string;
  }

  const [result, setResult] = useState<RedactionResult | null>(null);
  const [error, setError] = useState("");
  const [redactionType, setRedactionType] = useState("BlackOut");

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type.startsWith("image/")
      ) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a PDF or image file");
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file || !prompt) {
      setError("Please provide both a file and a redaction prompt");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/redactEntityPrompt?type=${redactionType}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const redacted = await fetch("/redacted_document.pdf");
        const pdfBlob = await redacted.blob();
        formData.append("redacted", pdfBlob, "redacted.pdf");
        const data = await response.json();
        const result = await axios.post(
          "http://localhost:4000/uploadFiles",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(result);
        if (!response.ok) {
          throw new Error(data.error || "Failed to process redaction");
        }

        setResult(data);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
      <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-800">
            Document Redaction Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-white hover:bg-blue-50 transition-all duration-300">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {file ? (
                  <File className="h-12 w-12 text-blue-500 mb-2" />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-600">
                  {file ? file.name : "Click to upload PDF or Image"}
                </span>
              </label>
            </div>

            {/* Redaction Style Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Redaction Style
              </label>
              <select
                value={redactionType}
                onChange={(e) => setRedactionType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              >
                <option value="BlackOut">Black Out</option>
                <option value="Blur">Blur</option>
                <option value="Remove">Remove</option>
              </select>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                What would you like to redact?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Redact all personal information and phone numbers'"
                className="w-full p-3 border border-gray-300 rounded-md h-24 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-all duration-300`}
            >
              {loading ? "Processing..." : "Redact Document"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {result && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {result.message}
                {result.redacted_file_url && (
                  <a
                    href={result.redacted_file_url}
                    className="block mt-2 text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Redacted Document
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RedactionInterface;
