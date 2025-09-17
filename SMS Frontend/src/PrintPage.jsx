import React from "react";
import { Printer } from "lucide-react";

const PrintButton = ({ targetId }) => {
  const handlePrint = () => {
    const content = document.getElementById(targetId);
    if (!content) {
      alert("No content to print!");
      return;
    }

    // Save original page
    const originalContents = document.body.innerHTML;

    // Replace body with only target content
    document.body.innerHTML = `
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `;

    // Trigger print
    window.print();

    // Restore page after printing
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore event listeners
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
    >
      <Printer size={18} /> Print
    </button>
  );
};

export default PrintButton;
