import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/redux/store";
interface DocumentViewerProps {
  file: File;
  isPDF: boolean;
  progressNum: number;
}

const DocumentViewer = React.memo(
  ({ file, isPDF, progressNum }: DocumentViewerProps) => {
    const documentUrl = useMemo(() => URL.createObjectURL(file), [file]);
    const { redactStatus } = useSelector(
      (state: RootState) => state.ProgressSlice
    );
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 h-full"
      >
        <div className="h-[calc(100%-2rem)] rounded-lg overflow-hidden bg-gray-100">
          {isPDF ? (
            <iframe
              src={redactStatus ? "/redacted_document.pdf" : documentUrl}
              className="w-full h-full"
            />
          ) : (
            <img
              src={redactStatus ? "/redacted_image.png" : documentUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.file === nextProps.file &&
      prevProps.isPDF === nextProps.isPDF &&
      (nextProps.progressNum !== 100 || prevProps.progressNum === 100)
    );
  }
);

DocumentViewer.displayName = "DocumentViewer";

export default DocumentViewer;
