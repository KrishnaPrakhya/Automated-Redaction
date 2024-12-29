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

function RedactionLevel2(props: Props) {
  const { File } = props;
  const dispatch: AppDispatch = useDispatch();
  const [entityDisplay, setEntityDisplay] = useState(false);
  const { level } = useSelector((state: RootState) => state.options);
  return (
    <div>
      {!entityDisplay ? (
        <div>
          <p className="text-white">Previous Option:{level}</p>
          <Button
            onClick={() => {
              dispatch(setRedactionType("CategoryReplacement"));
              setEntityDisplay(true);
              dispatch(setProgressNum(75));
            }}
          >
            Wanna Replace With Categories
          </Button>
        </div>
      ) : (
        <EntitySelect File={File} />
      )}
    </div>
  );
}

export default RedactionLevel2;
