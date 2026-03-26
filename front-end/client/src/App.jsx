import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClientDetail from "./pages/ClientDetail";
import ClientForm from "./components/ClientForm";

import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
