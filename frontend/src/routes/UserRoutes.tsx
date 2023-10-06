import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
import MainLayout from "~/layouts/MainLayout";
import { Role } from "~/utils/models/user.model";
import ProtectedRoute from "~/contexts/ProtectedRoute";
import WriteBlog from "~/pages/user/write-blog/WriteBlog";
import { ButtonTitle } from "~/utils/constants/buttonTitle";
const Home = lazy(() => import("~/pages/user/Home/Home"));
const BlogListPage = lazy(() => import("~/pages/user/blog/blog-list-page/BlogListPage"));
const BlogDetail = lazy(() => import("~/pages/user/blog/blog-detail/BlogDetail"));
const WaitingBlogList = lazy(() => import("~/pages/mentor/WaitingBlogList"));
const Profile = lazy(() => import("~/pages/user/profile/Profile"));

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
              <BlogListPage />
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

        <Route
          path={PATH.WAITING_BLOGS}
          Component={() => (
            <ProtectedRoute allowedRoles={[Role.MTR]}>
              <Suspense fallback={<Loading />}>
                <WaitingBlogList />
              </Suspense>
            </ProtectedRoute>
          )}
        />

        <Route
          path={PATH.PROFILE + "/:idUser"}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          )}
        />
      </Route>

      {/* protected routes - role student and mentor */}
      <Route
        path="/"
        element={
          // <ProtectedRoute allowedRoles={[Role.MTR, Role.STU]}>
            <MainLayout />
          // </ProtectedRoute>
        }
      >
        <Route
          path={PATH.WRITE_BLOG}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <WriteBlog />
            </Suspense>
          )}
        />
        <Route
          path={PATH.EDIT_BLOG + "/:idBlog"}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <WriteBlog mode={ButtonTitle.EDIT} />
            </Suspense>
          )}
        />
        <Route
          path={PATH.PROFILE + "/me"}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Profile isUserProfile={true} />
            </Suspense>
          )}
        />
      </Route>
    </Routes>
  );
}
