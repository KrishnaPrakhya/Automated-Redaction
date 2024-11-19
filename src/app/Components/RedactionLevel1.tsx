import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setRedactionType } from "@/features/Options/OptionsSlice";
import EntitySelect from "./EntitySelect";
import { setProgressNum } from "@/features/progress/ProgressSlice";
interface Props {
  pdfFile: File | null;
}

function RedactionLevel1(props: Props) {
  const { pdfFile } = props;
  const dispatch: AppDispatch = useDispatch();
  const { level, redactionType, entities } = useSelector(
    (state: RootState) => state.options
  );
  const { progressNum } = useSelector(
    (state: RootState) => state.ProgressSlice
  );
  const [entityDisplay, setEntityDisplay] = useState<boolean>(false);
  const handleRedactionCall = () => {};
 
  return (
    <div className="">
      <div>
        <p className="text-white pb-10">
          Previous Option:{level},{redactionType}
        </p>
      </div>
      {!entityDisplay ? (
        <div className="flex flex-col gap-10">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            style={{
              padding: "20px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
            }}
          >
            <div
              onClick={() => {
                dispatch(setRedactionType("BlackOut"));
                handleRedactionCall();
                setEntityDisplay(true);
                dispatch(setProgressNum(75));
              }}
              className="flex gap-20  cursor-pointer"
            >
              <Button>BlackOut</Button>
              <span>It masks like spider-man</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            style={{
              padding: "20px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
            }}
          >
            <div
              onClick={() => {
                dispatch(setRedactionType("Vanishing"));
                handleRedactionCall();
                setEntityDisplay(true);
                dispatch(setProgressNum(75));
              }}
              className="flex gap-20  cursor-pointer"
            >
              <Button>Vanishing</Button>
              <span>It Vanishes like vanish-man</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            style={{
              padding: "20px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
            }}
          >
            <div
              onClick={() => {
                dispatch(setRedactionType("Blurring"));
                handleRedactionCall();
                setEntityDisplay(true);
                dispatch(setProgressNum(75)); 
              }}
              className="flex gap-20  cursor-pointer"
            >
              <Button>Blurring</Button>
              <span>It masks like spider-man</span>
            </div>
          </motion.div>
        </div>
      ) : (
        <EntitySelect pdfFile={pdfFile} />
      )}
    </div>
  );
}

export default RedactionLevel1;
