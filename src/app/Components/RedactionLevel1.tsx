import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setRedactionType } from "@/features/Options/OptionsSlice";
import { setProgressNum } from "@/features/progress/ProgressSlice";
import EntitySelect from "./EntitySelect";
import { Shield, Eye, Droplet } from "lucide-react";

interface Props {
  File: File | null;
}

const cardVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export function RedactionLevel1({ File }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const { level, redactionType } = useSelector(
    (state: RootState) => state.options
  );
  const [entityDisplay, setEntityDisplay] = useState(false);

  const handleOptionSelect = (type: string) => {
    dispatch(setRedactionType(type));
    setEntityDisplay(true);
    dispatch(setProgressNum(75));
  };

  const redactionOptions = [
    {
      type: "BlackOut",
      title: "Black Out Redaction",
      description:
        "Completely obscures sensitive information with black rectangles, similar to traditional document redaction.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      type: "Vanishing",
      title: "Vanishing Redaction",
      description:
        "Makes sensitive information disappear entirely, leaving a clean document without visible redaction marks.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      type: "Blurring",
      title: "Blur Redaction",
      description:
        "Applies a strong blur effect to sensitive information, making it unreadable while indicating content presence.",
      icon: <Droplet className="w-6 h-6" />,
    },
  ];

  if (entityDisplay) {
    return <EntitySelect File={File} />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-300 ">
        <CardHeader>
          <CardTitle className="text-2xl">Basic Masking Options</CardTitle>
          <CardDescription className="">
            Select a redaction method to protect sensitive information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {redactionOptions.map((option) => (
              <motion.div
                key={option.type}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card
                  className="cursor-pointer border-2 border-slate-700 hover:border-blue-500 transition-colors"
                  onClick={() => handleOptionSelect(option.type)}
                >
                  <CardContent className="flex items-center p-6 gap-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{option.title}</h3>
                      <p className="text-sm text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
