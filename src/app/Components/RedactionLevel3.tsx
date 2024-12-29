import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setRedactionType } from "@/features/Options/OptionsSlice";
import EntitySelect from "./EntitySelect";
import { setProgressNum } from "@/features/progress/ProgressSlice";
interface Props {
  File: File | null;
}

function RedactionLevel3(props: Props) {
  const { File } = props;
  const [entityDisplay, setEntityDisplay] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { level } = useSelector((state: RootState) => state.options);
  console.log(File);
  return (
    <div>
      {entityDisplay ? (
        <div>
          <p className="text-white">Previous option:{level}</p>
          <Button
            onClick={() => {
              dispatch(setRedactionType("SyntheticReplacement"));
              setEntityDisplay(true);
              dispatch(setProgressNum(75));
            }}
          >
            Wanna Replace With Synthetic Text
          </Button>
        </div>
      ) : (
        <EntitySelect File={File} />
      )}
    </div>
  );
}

export default RedactionLevel3;
