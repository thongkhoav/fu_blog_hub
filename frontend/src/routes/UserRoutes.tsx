import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
import MainLayout from "~/layouts/MainLayout";
const Home = lazy(() => import("~/pages/user/home/Home"));
const BlogList = lazy(() => import("~/pages/user/blog/blog-list/BlogList"));
const BlogDetail = lazy(() => import("~/pages/user/blog/blog-detail/BlogDetail"));

export default function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          )}
        />
        <Route
          path={PATH.BLOG}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <BlogList />
            </Suspense>
          )}
        />
        <Route
          path={PATH.BLOG + "/:idBlog"}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <BlogDetail />
            </Suspense>
          )}
        />
      </Route>
    </Routes>
  );
}
