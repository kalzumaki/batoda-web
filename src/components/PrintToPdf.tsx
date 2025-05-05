"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

interface PrintToPDFProps {
  fileName?: string;
  title?: string;
  buttonLabel?: string;
  children: React.ReactNode;
}

const PrintToPDF: React.FC<PrintToPDFProps> = ({
  fileName = "download.pdf",
  title = "Report",
  buttonLabel = "Download PDF",
  children,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const content = contentRef.current;

    const headers = Array.from(content.querySelectorAll("table th"))
      .map((th) => th.textContent || "")
      .slice(0, -1);

    const rows = Array.from(content.querySelectorAll("table tbody tr")).map(
      (tr) =>
        Array.from(tr.children)
          .map((td) => td.textContent || "")
          .slice(0, -1)
    );

    // Add Title + Date
    doc.setFontSize(18);
    doc.text(title, 14, 15);

    // Date format
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(
      `Generated: ${timestamp}`,
      doc.internal.pageSize.getWidth() - 60,
      15
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 25,
      margin: { top: 20 },
      styles: { font: "helvetica", fontSize: 10 },
    });

    doc.save(fileName);
  };

  return (
    <div className="w-full">
      <div ref={contentRef}>{children}</div>
      <button
        onClick={handlePrint}
        className="mt-4 px-4 py-2 bg-[#3d5554] text-white rounded-md hover:bg-[#2c3f3e] transition-all"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PrintToPDF;
