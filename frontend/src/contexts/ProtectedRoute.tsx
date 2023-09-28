import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "~/utils/helpers/auth";
import { Role } from "~/utils/models/user.model";

interface Props {
  children: React.ReactElement;
  allowedRoles?: Role[];
  redirectPath?: string;
}

function ProtectedRoute({ allowedRoles = [], redirectPath = "/login", children }: Props) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user?.userRoles.find(role => allowedRoles?.includes(role))) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
