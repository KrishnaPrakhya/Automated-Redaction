import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setRedactionType } from "@/features/Options/OptionsSlice";
import EntitySelect from "./EntitySelect";
import { setProgressNum } from "@/features/progress/ProgressSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
interface Props {
  File: File | null;
}
export const cardVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};
function RedactionLevel2(props: Props) {
  const { File } = props;
  const dispatch: AppDispatch = useDispatch();
  const [entityDisplay, setEntityDisplay] = useState(false);
  const { level } = useSelector((state: RootState) => state.options);

  if (entityDisplay) {
    return <EntitySelect File={File} />;
  }
  return (
    <Card className="bg-slate-800 text-white">
      <CardHeader>
        <CardTitle>Category Replacement</CardTitle>
        <CardDescription className="text-gray-400">
          Replace sensitive information with relevant category labels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              dispatch(setRedactionType("CategoryReplacement"));
              setEntityDisplay(true);
              dispatch(setProgressNum(75));
            }}
          >
            Replace with Categories
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default RedactionLevel2;
