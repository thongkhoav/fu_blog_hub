import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ADMIN_PATH } from "src/utils/constants/paths";
import Loading from "src/components/Loading/Loading";
import ProtectedRoute from "~/contexts/ProtectedRoute";
import AdminLayout from "~/layouts/AdminLayout";
import ReportUser from "~/pages/admin/reports/report-user/ReportUser";
import ReportBlog from "~/pages/admin/reports/report-blog/ReportBlog";
import ReportComment from "~/pages/admin/reports/report-comment/ReportComment";
const ManageBlog = lazy(() => import("~/pages/admin/manage-blog/ManageBlog"));
const ManageUser = lazy(() => import("~/pages/admin/manage-user/ManageUser"));
const ManageCategory = lazy(() => import("~/pages/admin/manage-category/ManageCategory"));
const CreateCategory = lazy(
  () => import("~/pages/admin/manage-category/create-category/CreateCategory")
);
const ManageTag = lazy(() => import("~/pages/admin/manage-tag/ManageTag"));
const CreateTag = lazy(() => import("~/pages/admin/manage-tag/create-tag/CreateTag"));
export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path={ADMIN_PATH.ADMIN_PATH}
        element={
          // <ProtectedRoute allowedRoles={[Role.ADM]}>
          <AdminLayout />
          // </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <ManageUser />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.MANAGE_BLOG}
          element={
            <Suspense fallback={<Loading />}>
              <ManageBlog />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.MANAGE_USER}
          element={
            <Suspense fallback={<Loading />}>
              <ManageUser />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.MANAGE_TAG}
          element={
            <Suspense fallback={<Loading />}>
              <ManageTag />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.CREATE_TAG}
          element={
            <Suspense fallback={<Loading />}>
              <CreateTag />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.EDIT_TAG + "/:idTag"}
          element={
            <Suspense fallback={<Loading />}>
              <CreateTag mode="edit" />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.MANAGE_CATEGORY}
          element={
            <Suspense fallback={<Loading />}>
              <ManageCategory />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.CREATE_CATEGORY}
          element={
            <Suspense fallback={<Loading />}>
              <CreateCategory />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.EDIT_CATEGORY + "/:idCategory"}
          element={
            <Suspense fallback={<Loading />}>
              <CreateCategory mode="edit" />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.REPORT_USER}
          element={
            <Suspense fallback={<Loading />}>
              <ReportUser />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.REPORT_BLOG}
          element={
            <Suspense fallback={<Loading />}>
              <ReportBlog />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATH.REPORT_COMMENT}
          element={
            <Suspense fallback={<Loading />}>
              <ReportComment />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
