import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "./LoginRoutes";
import HomeRoutes from "./UserRoutes";
import AuthProvider from "~/contexts/AuthProvider";
import AdminRoutes from "./AdminRoutes";
import StoreProvider from "~/contexts/StoreProvider";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <AdminRoutes />
          <HomeRoutes />
          <LoginRoutes />
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
