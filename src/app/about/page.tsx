"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function AboutUs() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      level: "Level 1",
      title: "Basic Redaction",
      description:
        "Fundamental document protection focusing on common sensitive data like phone numbers, emails, and basic personal information.",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      level: "Level 2",
      title: "Category Replacement",
      description:
        "Entities which are detected by the NER model are replaced with the corresponding categories ensuring user privacy.",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      level: "Level 3",
      title: "Synthetic Generation",
      description:
        "Comprehensive security with context-aware redaction, handling classified information and highly sensitive organizational data.",
    },
  ];

  return (
    <div className="min-h-screen mt-14 bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Gradation Redaction System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intelligent document protection through our innovative three-tier
            redaction system, ensuring the right level of security for every
            document.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 text-blue-600">{feature.icon}</div>
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-3">
                    {feature.level}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">
            Why Choose Gradation Redaction?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Automated Processing",
              "Context-Aware Detection",
              "Customizable Rules",
              "Real-time Analysis",
              "Compliance Ready",
              "Audit Trails",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-700"
              >
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutUs;
