import React, { useState } from "react";
import { motion } from "framer-motion";
import RedactionLevel2 from "./RedactionLevel2";
import RedactionLevel3 from "./RedactionLevel3";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setLevel } from "@/features/Options/OptionsSlice";
import { Progress } from "@/components/ui/progress";
import { setProgressNum } from "@/features/progress/ProgressSlice";
import { Shield, Replace, Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RedactionLevel1 } from "./RedactionLevel1";

interface Props {
  File: File | null;
}

type ConfigType = "Mask" | "Category" | "Synthetic";

const levelInfo = {
  Mask: {
    title: "Level 1 - Basic Masking",
    description:
      "Simple yet effective masking techniques to hide sensitive information",
    features: ["Black-out redaction", "Blur effects", "Complete removal"],
    icon: Shield,
    color: "from-blue-500 to-blue-600",
  },
  Category: {
    title: "Level 2 - Entity Replacement",
    description: "Replace sensitive data with category placeholders",
    features: [
      "Category-based replacement",
      "Maintains context",
      "Customizable categories",
    ],
    icon: Replace,
    color: "from-purple-500 to-purple-600",
  },
  Synthetic: {
    title: "Level 3 - Synthetic Generation",
    description: "Advanced AI-powered replacement of sensitive information",
    features: [
      "AI-generated replacements",
      "Context-aware",
      "Natural looking results",
    ],
    icon: Wand2,
    color: "from-emerald-500 to-emerald-600",
  },
};

function RedactionConfig({ File }: Props) {
  const [activeLevel, setActiveLevel] = useState<ConfigType | null>(null);
  const { progressNum } = useSelector(
    (state: RootState) => state.ProgressSlice
  );
  const dispatch: AppDispatch = useDispatch();

  const renderActiveComponent = () => {
    switch (activeLevel) {
      case "Mask":
        return <RedactionLevel1 File={File} />;
      case "Category":
        return <RedactionLevel2 File={File} />;
      case "Synthetic":
        return <RedactionLevel3 File={File} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Redaction Progress
          </h2>
          <Progress value={progressNum} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">{progressNum}% Complete</p>
        </div>

        {!activeLevel ? (
          <div className="grid gap-6">
            <h1 className="text-3xl font-bold text-center mb-6">
              Choose Your Redaction Level
            </h1>
            {(Object.keys(levelInfo) as ConfigType[]).map((level) => {
              const info = levelInfo[level];
              const Icon = info.icon;

              return (
                <motion.div
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer overflow-hidden"
                    onClick={() => {
                      setActiveLevel(level);
                      dispatch(setLevel(level));
                      dispatch(setProgressNum(30));
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${info.color} text-white`}
                        >
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            {info.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {info.description}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {info.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {levelInfo[activeLevel].title}
                </h2>
                {renderActiveComponent()}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <button
                onClick={() => {
                  setActiveLevel(null);
                  dispatch(setProgressNum(0));
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
              >
                Back to Level Selection
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RedactionConfig;
