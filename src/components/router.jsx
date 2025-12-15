import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login. ";
import Dashboard from "../pages/Dashboard";
import Entries from "../pages/Entries";
import { getToken } from "../services/auth";

function Protected({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
            
          </Protected>
        }
      />

      <Route
        path="/entries"
        element={
          <Protected>
            <Entries />
           
          </Protected>
        }
      />

      <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />
    </Routes>
  );
}

