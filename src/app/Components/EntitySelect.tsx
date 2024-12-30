import { Button } from "@/components/ui/button";
import { addEntity } from "@/features/entities/EntitySlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProgressNum } from "@/features/progress/ProgressSlice";
import { motion } from "framer-motion";
interface Props {
  File: File | null;
}

function EntitySelect(props: Props) {
  const dispatch: AppDispatch = useDispatch();
  const { entities, redactionType } = useSelector(
    (state: RootState) => state.options
  );
  console.log(entities);
  const { progressNum } = useSelector(
    (state: RootState) => state.ProgressSlice
  );
  const { entitiesSelected } = useSelector((state: RootState) => state.entity);
  const { File } = props;

  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

  const redactSelectedEntities = async () => {
    try {
      const formData = new FormData();
      if (File) {
        formData.append("file", File);
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
        const data = await response.json();
        if (data.redacted_file_url) {
          console.log("Redacted image URL:", data.redacted_file_url);
        } else if (data.output_file) {
          console.log("Redacted PDF file:", data.output_file);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(entitiesSelected);
  const handleItemClick = (entityText: string) => {
    setSelectedEntities((prev) =>
      prev.includes(entityText)
        ? prev.filter((item) => item !== entityText)
        : [...prev, entityText]
    );
    console.log(entityText);
    console.log(entities.find((entity) => entity.text === entityText)?.label);
    dispatch(
      addEntity({
        text: entityText,
        label: entities.find((entity) => entity.text === entityText)?.label,
      })
    );
  };

  return (
    <div>
      <ul>
        {entities.map((entity, index) => {
          const isSelected = selectedEntities.includes(entity.text);

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
      {progressNum === 100 ? (
        <p className=" text-xl font-semibold">
          Please check your file directory. It's been thrown there!
        </p>
      ) : (
        <Button
          onClick={() => {
            redactSelectedEntities();
            dispatch(setProgressNum(100));
          }}
        >
          Redact The Selected
        </Button>
      )}
    </div>
  );
}

export default EntitySelect;
