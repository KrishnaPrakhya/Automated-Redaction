"use client";
import React, { useState } from "react";
import Pipeline from "./pipeline";
import Chatbot from "./chatbot";
import { motion } from "framer-motion";
interface Props {}

function Layout(props: Props) {
  const {} = props;
  const [selectedValue, setSelectedValue] = useState<null | string>(
    "redactBot"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-[60px] bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen"
    >
      <div className=" mx-auto p-6">
        <div className="flex justify-center mb-8">
          <select
            defaultValue={"redactBot"}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="px-6 py-3 border-2 border-blue-300 rounded-lg shadow-sm text-lg font-semibold text-blue-800 bg-white hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={"agent"}>Agentic Pipeline (BETA)</option>
            <option value={"redactBot"}>Redact Bot</option>
          </select>
        </div>
        {selectedValue === "agent" ? <Pipeline /> : <Chatbot />}
      </div>
    </motion.div>
  );
}

export default Layout;
