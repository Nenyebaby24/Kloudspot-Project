import React from "react";

export default function Input({ label, ...props }) {
  return (
    <div className="form-item">
      {label && <label className="form-label">{label}</label>}
      <input className="input" {...props} />
    </div>
  );
}
