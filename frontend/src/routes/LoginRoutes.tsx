import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
const Login = lazy(() => import("src/pages/user/Login/Login"));

export default function LoginRoutes() {
  return (
    <Switch>
      <Route
        path={PATH.LOGIN}
        component={() => (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        )}
      />
    </Switch>
  );
}
