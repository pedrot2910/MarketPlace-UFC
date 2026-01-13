import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AppLayout from "../layouts/AppLayout";
import Marketplace from "../pages/Marketplace";
import CreateListing from "../pages/CreateListing";
import EditListing from "../pages/EditListing";
import ListingDetails from "../pages/ListingDetails";
import Profile from "../pages/Profile";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/Signup";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Layout principal (com Navbar e Sidebar) */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Navigate to="/marketplace" replace />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Route>

      {/* Layout de autenticação (sem Navbar/Sidebar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />}></Route>
      </Route>
    </Routes>
  );
}
