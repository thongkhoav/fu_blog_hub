export const PATH = {
  HOME: "/",
  BLOG: "/blog",
  WAITING_BLOGS: "/waiting-blogs",
  LOGIN: "/login"
};

export const ADMIN_PATH = {
  ADMIN_PATH: "/admin",
  MANAGE_BLOG: "manage-blog",
  MANAGE_USER: "manage-user",
  MANAGE_CATEGORY: "manage-category",
  CREATE_CATEGORY: "create-category",
  EDIT_CATEGORY: "edit-category",
  CREATE_BLOG: "create-blog",
  MANAGE_TAG: "manage-tag",
  CREATE_TAG: "create-tag",
  EDIT_TAG: "edit-tag"
};

export const navigateAdminTo = (path: string, id?: string) => {
  if (path) {
    path = "/" + path;
    if (id) {
      path = path + "/" + id;
    }
  } else path = "";
  return ADMIN_PATH.ADMIN_PATH + path;
};
