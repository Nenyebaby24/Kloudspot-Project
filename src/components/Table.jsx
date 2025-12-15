import React from "react";

export default function Table({ columns, data }) {
  return (
    <table className="data-table">
      <thead>
        <tr>{columns.map((c) => <th key={c.key}>{c.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ textAlign: 'center' }}>No records</td></tr>
        ) : data.map((row, i) => (
          <tr key={i}>
            {columns.map(col => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
