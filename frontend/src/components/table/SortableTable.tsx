import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header.key}
              style={{
                padding: "16px",  // Increase padding for bigger header rows
                borderBottom: "2px solid #ddd",
                backgroundColor: "#f9f9f9",
                textAlign: "left",
                width: getColumnWidth(header.key),  // Set specific column width
                minWidth: "80px",  // Ensure a reasonable minimum width
              }}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <tr key={i}>
              {headers.map((header) => (
                <td
                  key={header.key}
                  style={{
                    padding: "16px",  // Increase padding for bigger rows
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    whiteSpace: "normal",  // Allow text to wrap within the cells
                    wordWrap: "break-word",
                    maxWidth: "200px",  // Max width for cells (especially for title)
                    overflow: "hidden",
                    textOverflow: "ellipsis",  // Add ellipsis for long text
                  }}
                  title={row[header.key]} // Show full content on hover
                >
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} style={{ padding: "16px", textAlign: "center" }}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// Helper function to assign widths to certain columns
const getColumnWidth = (key: string) => {
  switch (key) {
    case "title":
      return "20%";  // Make the title column narrower
    case "authors":
      return "25%";
    case "doi":
      return "15%";
    default:
      return "auto";
  }
};

export default SortableTable;
