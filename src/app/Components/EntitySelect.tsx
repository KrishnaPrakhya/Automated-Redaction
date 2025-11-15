import { Button } from "@/components/ui/Button";
import {
  addEntity,
  removeEntity,
  clearEntities,
} from "@/features/entities/EntitySlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProgressNum,
  setRedactStatus,
} from "@/features/progress/ProgressSlice";
import { motion } from "framer-motion";
import axios from "axios";
import { Undo2 } from "lucide-react";

interface Props {
  File: File | null;
}

function EntitySelect(props: Props) {
  const dispatch: AppDispatch = useDispatch();
  const { entities, redactionType } = useSelector(
    (state: RootState) => state.options
  );
  const { progressNum, redactStatus } = useSelector(
    (state: RootState) => state.ProgressSlice
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false); // State for undo animation
  const { entitiesSelected } = useSelector((state: RootState) => state.entity);
  const { File } = props;
  console.log("File", File);

  const redactSelectedEntities = async () => {
    try {
      setIsLoading(true);
      dispatch(setRedactStatus(false));
      const formData = new FormData();

      if (File) {
        formData.append("file", File);
        formData.append("title", File.name);
      }
      formData.append("entities", JSON.stringify(entitiesSelected));
      const response = await fetch(
        `http://127.0.0.1:5000/api/redactEntity?type=${redactionType}`,
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
        dispatch(setRedactStatus(true));
        if (data.redacted_file_url) {
          console.log("Redacted image URL:", data.redacted_file_url);
        } else if (data.output_file) {
          console.log("Redacted PDF file:", data.output_file);
        }
      }
    } catch (err) {
      dispatch(setRedactStatus(false));
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (entityText: string) => {
    dispatch(setProgressNum(75));

    const isSelected = entitiesSelected.some(
      (item) => item.text === entityText
    );

    if (isSelected) {
      dispatch(removeEntity(entityText));
    } else {
      const entityToAdd = entities.find((entity) => entity.text === entityText);
      if (entityToAdd) {
        dispatch(
          addEntity({
            text: entityToAdd.text,
            label: entityToAdd.label,
          })
        );
      }
    }
  };

  const handleUndo = async () => {
    try {
      setIsUndoing(true); // Start the undo animation
      // Clear all selected entities from Redux state
      dispatch(clearEntities());

      // Reset progress and redact status
      dispatch(setProgressNum(0));
      dispatch(setRedactStatus(false));

      // Perform the undo redaction API call
      const formData = new FormData();
      if (File) {
        formData.append("file", File);
        formData.append("title", File.name);
      }
      const response = await fetch(`http://127.0.0.1:5000/api/undoRedaction`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to undo redaction");
      }

      // Fetch the updated document after undoing redaction
      const redacted = await fetch("/redacted_document.pdf");
      const pdfBlob = await redacted.blob();
      formData.append("redacted", pdfBlob, "redacted.pdf");

      // Upload the updated document to the server
      const result = await axios.post(
        "http://localhost:4000/uploadFiles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Undo result:", result);

      // Update the Redux state to reflect the undone state
      dispatch(setRedactStatus(true));
      dispatch(setProgressNum(100));
    } catch (error) {
      console.error("Error undoing redaction:", error);
      dispatch(setRedactStatus(false));
    } finally {
      setIsUndoing(false); // Stop the undo animation
    }
  };

  return (
    <div>
      <ul>
        {entities.map((entity, index) => {
          const isSelected = entitiesSelected.some(
            (item) => item.text === entity.text
          );

          return (
            <motion.li
              key={index}
              onClick={() => handleItemClick(entity.text)}
              className={`mb-4 hover:cursor-pointer`}
              style={{
                border: isSelected ? "2px solid green" : "1px solid gray",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: isSelected ? "lightgreen" : "white",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-4 shadow-md">
                {Object.entries(entity).map(([key, value], innerIndex) => (
                  <div key={innerIndex} className="mb-2">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </motion.li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleUndo}
          disabled={isUndoing}
        >
          {isUndoing ? (
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-4 h-4 rounded-full bg-blue-500"
                animate={{
                  scale: [1, 0.8, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span>Undoing...</span>
            </div>
          ) : (
            <>
              <Undo2 className="w-4 h-4" />
              Undo Redaction
            </>
          )}
        </Button>
      </div>
      {progressNum === 100 && redactStatus ? (
        <motion.p
          className="text-xl font-semibold text-green-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Saved to your file directory.
        </motion.p>
      ) : (
        <div className="relative">
          <Button
            onClick={() => {
              redactSelectedEntities();
              dispatch(setProgressNum(100));
            }}
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-4 h-4 rounded-full bg-white"
                  animate={{
                    scale: [1, 0.8, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span>Processing...</span>
              </div>
            ) : (
              "Redact The Selected"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EntitySelect;
