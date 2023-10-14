import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
import MainLayout from "~/layouts/MainLayout";
import { Role } from "~/utils/models/user.model";
import ProtectedRoute from "~/contexts/ProtectedRoute";
import WriteBlog from "~/pages/user/write-blog/WriteBlog";
import { ButtonTitle } from "~/utils/constants/buttonTitle";
import PersonalProfile from "~/pages/user/profile/personal-profile/PersonalProfile";
import Following from "~/pages/user/profile/following/Following";
import Followers from "~/pages/user/profile/followers/Followers";
import Bookmark from "~/pages/user/profile/bookmark/Bookmark";
const Home = lazy(() => import("~/pages/user/home/Home"));
const BlogListPage = lazy(() => import("~/pages/user/blog/blog-list-page/BlogListPage"));
const BlogDetail = lazy(() => import("~/pages/user/blog/blog-detail/BlogDetail"));
const WaitingBlogList = lazy(() => import("~/pages/mentor/WaitingBlogList"));
const Profile = lazy(() => import("~/pages/user/profile/Profile"));
const Posts = lazy(() => import("~/pages/user/profile/Posts"));
const Series = lazy(() => import("~/pages/user/profile/series/Series"));

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
          path={PATH.PROFILE + "/me"}
          Component={() => (
            <ProtectedRoute allowedRoles={[Role.MTR, Role.STU]}>
              <Suspense fallback={<Loading />}>
                <PersonalProfile />
              </Suspense>
            </ProtectedRoute>
          )}
        >
          <Route index element={<Posts />} />
          <Route path="series" element={<Series />} />
          <Route path="followers" element={<Followers />} />
          <Route path="following" element={<Following />} />
          <Route path="bookmark" element={<Bookmark />} />
        </Route>

        <Route
          path={PATH.PROFILE + "/:idUser"}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          )}
        >
          <Route index element={<Posts />} />
          <Route path="series" element={<Series />} />
        </Route>
      </Route>
      {/* protected routes - role student and mentor */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={[Role.MTR, Role.STU]}>
            <MainLayout />
          </ProtectedRoute>
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
