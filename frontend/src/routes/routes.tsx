import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "./LoginRoutes";
import HomeRoutes from "./UserRoutes";
import AuthProvider from "~/contexts/AuthProvider";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminRoutes />
        <HomeRoutes />
        <LoginRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
