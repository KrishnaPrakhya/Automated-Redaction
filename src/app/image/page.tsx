"use client";
import React, { useState } from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";

interface Props {}

function ImageRoute(props: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const handleImageRedaction = async () => {
    const form = new FormData();
    if (!selectedImage) {
      return;
    }
    try {
      form.append("image", selectedImage);
      const response = await fetch("http://127.0.0.1:5000/api/image", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const result = await response.json();
      console.log(result.redacted_image_path);
      const redactedImageUrl = `${result?.redacted_image_path}`;
      console.log(redactedImageUrl);
      setImagePath(redactedImageUrl);
      console.log("Response from Flask:", result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Image Redaction Tool
      </Typography>

      <Paper sx={{ p: 4, my: 2, textAlign: "center" }}>
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 4,
            mb: 2,
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main" },
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary" }} />
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Drag and drop an image here or click to upload
        </Typography>

        {selectedImage && (
          <Box sx={{ mt: 2 }}>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                handleImageRedaction();
              }}
            >
              Process Image
            </Button>
          </Box>
        )}

        {imagePath && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Processed Result
            </Typography>
            <Image
              src={`${imagePath}`}
              alt="Redacted"
              width={300}
              height={500}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ImageRoute;
