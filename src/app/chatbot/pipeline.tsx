"use client";
import React, { useEffect, useRef, useState } from "react";

function Pipeline() {
  const [responseData, setResponseData] = useState(null);
  const iframeRef = useRef(null);
  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const url = "https://api.vectorshift.ai/api/pipelines/run";

        const headers = {
          "Api-Key": "sk_x1LY3e4XJ6zXUSpdjGnGJwsssa1w4H1sylTtiokV6ZoDMpHG", // ✅ Secure API Key
          "Content-Type": "application/json",
        };
      } catch (error) {
        console.error("Error fetching pipeline response:", error);
      }
    };

    fetchPipelineData();
  }, []);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    const handlePaste = async () => {
      try {
        const text = await navigator.clipboard.readText();
        setCopiedText(text); // Update state with copied text
      } catch (error) {
        console.error("Failed to read clipboard:", error);
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);
  return (
    <div className="overflow-x-hidden overflow-y-hidden ">
      <iframe
        className="w-full"
        src="https://app.vectorshift.ai/forms/embedded/67aeb02af3fc9c277b46a8b7"
        width="1000px"
        height="900px"
        allow="clipboard-read; clipboard-write; microphone"
      />

      {/* <h3>Output</h3>
      <textarea value={copiedText} readOnly rows={4} cols={50} />

      <button
        onClick={async () =>
          setCopiedText(await navigator.clipboard.readText())
        }
      >
        Redact the entities
      </button> */}
    </div>
  );
}

export default Pipeline;
