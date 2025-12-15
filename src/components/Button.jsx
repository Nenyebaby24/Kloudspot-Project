import React from "react";

export default function Button({ children, loading, ...props }) {
  return (
    <button className={`btn ${loading ? "btn-disabled" : ""}`} {...props} disabled={loading || props.disabled}>
      {loading ? <span className="loader-inline" /> : children}
    </button>
  );
}
