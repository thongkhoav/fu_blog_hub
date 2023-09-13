import React, { lazy, Suspense } from "react";
import { Switch } from "react-router-dom";
import AuthenticatedGuard from "../guards/AuthenticatedGuard";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
const ProductList = lazy(() => import("src/pages/user/Blog/BlogList/ProductList"));
const ProductItem = lazy(() => import("src/pages/user/Blog/BlogDetail/BlogDetail"));
export default function ProductRoutes() {
  return (
    <Switch>
      <AuthenticatedGuard
        exact
        path={PATH.PRODUCT}
        component={() => (
          <Suspense fallback={<Loading />}>
            <ProductList />
          </Suspense>
        )}
      />
      <AuthenticatedGuard
        exact
        path={PATH.PRODUCT + "/:idProduct"}
        component={() => (
          <Suspense fallback={<Loading />}>
            <ProductItem />
          </Suspense>
        )}
      />
    </Switch>
  );
}
