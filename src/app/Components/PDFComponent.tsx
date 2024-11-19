// "use client";

// import React from "react";
// import dynamic from "next/dynamic";

// const PDFViewer = dynamic(
//   () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
//   {
//     ssr: false,
//   }
// );

// interface PDFViewerProps {
//   fileUrl: string;
// }

// const PDFComponent: React.FC<PDFViewerProps> = ({ fileUrl }) => {
//   return (
//     <div className="pdf-container">
//       {fileUrl ? (
//         <PDFViewer>
//           <iframe
//             src={fileUrl}
//             width="100%"
//             height="500px"
//             style={{ border: "none" }}
//             title="PDF Preview"
//           ></iframe>
//         </PDFViewer>
//       ) : (
//         <p>No PDF file selected</p>
//       )}
//     </div>
//   );
// };

// export default PDFComponent;
