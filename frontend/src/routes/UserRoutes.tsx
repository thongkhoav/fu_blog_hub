import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
import MainLayout from "~/layouts/MainLayout";
import { Role } from "~/utils/models/user.model";
import ProtectedRoute from "~/contexts/ProtectedRoute";
import WriteBlog from "~/pages/user/write-blog/WriteBlog";
import { ButtonTitle } from "~/utils/constants/buttonTitle";
import UserViewBlogLayout from "~/layouts/UserViewBlogLayout";
const Home = lazy(() => import("~/pages/user/home/Home"));
const BlogList = lazy(() => import("~/pages/user/blog/blog-list/BlogList"));
const BlogDetail = lazy(() => import("~/pages/user/blog/blog-detail/BlogDetail"));
const WaitingBlogList = lazy(() => import("~/pages/mentor/WaitingBlogList"));
const Profile = lazy(() => import("~/pages/user/profile/Profile"));
const Posts = lazy(() => import("~/pages/user/profile/Posts"));
const Series = lazy(() => import("~/pages/user/profile/Series"));

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
        <Route path={PATH.BLOG} element={<UserViewBlogLayout />}>
          <Route
            index
            Component={() => (
              <Suspense fallback={<Loading />}>
                <BlogList />
              </Suspense>
            )}
          />
        </Route>
        <Route path={PATH.BLOG} element={<UserViewBlogLayout isBlogDetail={true} />}>
          <Route
            path=":idBlog"
            Component={() => (
              <Suspense fallback={<Loading />}>
                <BlogDetail />
              </Suspense>
            )}
          />
        </Route>

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
          path={PATH.PROFILE}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          )}
        >
          <Route index element={<Posts />} />
          <Route path="series" element={<Series />} />
          <Route path="follower" element={<Posts />} />
          <Route path="following" element={<Posts />} />
          <Route path="love" element={<Posts />} />
          <Route path="series" element={<Posts />} />
          <Route path="comment" element={<Posts />} />
        </Route>
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
      </Route>
    </Routes>
  );
}
