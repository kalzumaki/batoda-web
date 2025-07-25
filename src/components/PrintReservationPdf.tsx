"use client";

import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
interface PrintReservationPDFProps {
  fileName?: string;
  title?: string;
  buttonLabel?: string;
  children: React.ReactNode;
  generatedByFname?: string;
  generatedByLname?: string;
}

const PrintReservationPDF: React.FC<PrintReservationPDFProps> = ({
  fileName = "reservation_report.pdf",
  title = "Reservation History",
  buttonLabel = "Download Reservation PDF",
  children,
  generatedByFname,
  generatedByLname,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = () => {
    if (!contentRef.current) return;
    setIsLoading(true);

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [215.9, 330.2], // Long bond paper: 8.5 x 13 inches
      });
      const content = contentRef.current;

      const headers = Array.from(
        content.querySelectorAll("table thead tr th")
      ).map((th) => th.textContent?.trim() || "");

      const rows = Array.from(content.querySelectorAll("table tbody tr")).map(
        (tr) =>
          Array.from(tr.querySelectorAll("td")).map(
            (td) => td.textContent?.trim() || ""
          )
      );

      // Title
      doc.setFontSize(18);
      doc.text(title, 14, 15);

      // Timestamp
      const timestamp = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(
        `Generated: ${timestamp}`,
        doc.internal.pageSize.getWidth() - 60,
        15
      );

      if (generatedByFname || generatedByLname) {
        const fullName = `${generatedByFname ?? ""} ${
          generatedByLname ?? ""
        }`.trim();
        doc.text(`By: ${fullName}`, doc.internal.pageSize.getWidth() - 60, 20);
      }

      // Table
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        margin: { top: 20 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [61, 85, 84] },
        didDrawPage: (data) => {
          doc.setFontSize(10);
          doc.text(
            `Page ${doc.getNumberOfPages()}`,
            14,
            doc.internal.pageSize.getHeight() - 10
          );
        },
      });

      doc.save(fileName);
    } catch (error) {
      console.error("Error generating reservation PDF:", error);
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

export default PrintReservationPDF;
