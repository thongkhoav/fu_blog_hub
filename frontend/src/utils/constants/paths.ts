export const PATH = {
  HOME: "/",
  BLOG: "/blogs",
  WAITING_BLOGS: "/waiting-blogs",
  WRITE_BLOG: "/write-blog",
  EDIT_BLOG: "/edit-blog",
  LOGIN: "/login",
  PROFILE: "/profile"
};

export enum ADMIN_PATH {
  ADMIN_PATH = "/admin",
  MANAGE_BLOG = "manage-blog",
  MANAGE_USER = "manage-user",
  MANAGE_CATEGORY = "manage-category",
  CREATE_CATEGORY = "create-category",
  EDIT_CATEGORY = "edit-category",
  CREATE_BLOG = "create-blog",
  MANAGE_TAG = "manage-tag",
  CREATE_TAG = "create-tag",
  EDIT_TAG = "edit-tag",
  REPORT_USER = "report-user",
  REPORT_BLOG = "report-blog",
  REPORT_COMMENT = "report-comment"
}

export const userPath = (path: string, id?: string) => {
  if (path) {
    if (id) {
      path = path + "/" + id;
    }
  } else path = "";
  return path;
};

export const adminPath = (path: string, id?: string) => {
  if (path) {
    path = "/" + path;
    if (id) {
      path = path + "/" + id;
    }
  } else path = "";
  return ADMIN_PATH.ADMIN_PATH + path;
};
