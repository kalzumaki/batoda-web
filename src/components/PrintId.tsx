"use client";

import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PrintIDProps {
  fileName?: string;
  buttonLabel?: string;
  children: React.ReactNode;
}

const PrintID: React.FC<PrintIDProps> = ({
  fileName = "id_card.pdf",
  buttonLabel = "Download",
  children,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = async () => {
    if (!contentRef.current) return;
    setIsLoading(true);

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfWidth = imgWidth * 0.264583;
      const pdfHeight = imgHeight * 0.264583;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div ref={contentRef}>{children}</div>
      <button
        onClick={handlePrint}
        disabled={isLoading}
        className={`mt-4 px-4 py-2 flex items-center justify-center gap-2 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#3d5554] hover:bg-[#2c3f3e]"
        } text-white rounded-md transition-all`}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            ></path>
          </svg>
        )}
        {isLoading ? "Generating..." : buttonLabel}
      </button>
    </div>
  );
};

export default PrintID;
