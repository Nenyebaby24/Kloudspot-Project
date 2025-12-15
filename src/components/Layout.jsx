import React from "react";
import Navbar from "./Navbar";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      {/* Top navbar (appears to the right of the sidebar) */}
      <Navbar />

      {/* Page content (Dashboard or Entries content) */}
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}



