import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
  rowKey: (row: any) => string; // Add a rowKey prop to specify unique key for each row
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data, rowKey }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header.key}
              style={{
                padding: "16px",
                borderBottom: "2px solid #ddd",
                backgroundColor: "#f9f9f9",
                textAlign: "left",
                width: getColumnWidth(header.key),
                minWidth: "80px",
              }}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <tr key={rowKey(row)}> {/* Use rowKey to set unique key */}
              {headers.map((header) => (
                <td
                  key={header.key}
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={row[header.key]}
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
      return "20%";
    case "authors":
      return "25%";
    case "doi":
      return "15%";
    default:
      return "auto";
  }
};

export default SortableTable;
