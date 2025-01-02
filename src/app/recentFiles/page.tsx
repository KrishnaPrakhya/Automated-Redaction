"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {}

type FileItem = {
  title: string;
  redactedFile: string;
  originalFile: string;
};

function Page(props: Props) {
  const [files, setFiles] = useState<FileItem[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/getFiles");
      if (Array.isArray(response.data.files)) {
        setFiles(response.data.files);
      }
    } catch (error) {
      setFiles(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const showPdf = (file: string) => {
    window.open(`http://localhost:4000/upload/${file}`, "_blank", "noreferrer");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      <h1 className=" mb-8 animate-fade-in text-3xl text-center font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Recent Files
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files?.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600">
                No Recent Files
              </h2>
            </div>
          </div>
        ) : (
          files?.map((item: FileItem, index: number) => (
            <Card
              key={index}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 truncate">
                  Original: {item.originalFile}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Redacted: {item.redactedFile}
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full group"
                  variant="outline"
                  onClick={() => showPdf(item.originalFile)}
                >
                  <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  View Original
                </Button>

                <Button
                  className="w-full group"
                  onClick={() => showPdf(item.redactedFile)}
                >
                  <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  View Redacted
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Page;
