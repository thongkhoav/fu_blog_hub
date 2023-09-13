import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedGuard from "src/guards/AuthenticatedGuard";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
const Home = lazy(() => import("src/pages/user/Home/Home"));

export default function HomeRoutes() {
  return (
    <Switch>
      {/* <AuthenticatedGuard
        exact
        path={PATH.HOME}
        component={() => (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        )}
      /> */}
      <Route
        path={PATH.LOGIN}
        component={() => (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        )}
      />
    </Switch>
  );
}
