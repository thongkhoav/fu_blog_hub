import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
const Login = lazy(() => import("~/pages/user/login/Login"));

export default function LoginRoutes() {
  return (
    <Routes>
      <Route
        path={PATH.LOGIN}
        Component={() => (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        )}
      />
    </Routes>
  );
}
