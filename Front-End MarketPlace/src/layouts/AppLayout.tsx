import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex-1">
      <Navbar />
      <Outlet />
    </div>
  );
}
