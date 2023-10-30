import axios, { AxiosResponse } from "axios";
import { HOST } from "~/utils/constants";
import { BlogDetail, BlogItem } from "~/utils/models/blog.model";
interface HighlightBlogsRes extends AxiosResponse {
  data: {
    highlightBlogs: BlogItem[];
  };
}

export const getHighlightBlogsApi = async (refreshToken: string): Promise<HighlightBlogsRes> =>
  await axios.get(`${HOST}/api/blogs/highlight`);

export const getBlogDetailApi = async (idBlog: string) =>
  await axios.get(`${HOST}/api/v1/blogs/` + idBlog);

export const getBlogTagsApi = async () => await axios.get(`${HOST}/api/v1/tags`);

export const getBlogCategoriesApi = async () => await axios.get(`${HOST}/api/v1/categories`);

export const getProfileSeriesApi = async (id: string) =>
  await axios.get(`${HOST}/api/v1/series/user/${id}`);

export const getAllPublicBlogs = async () => await axios.get(`${HOST}/api/v1/blogs`);
export const getSeriesBlogs = async (id: string) =>
  await axios.get(`${HOST}/api/v1/series/${id}/blogs`);

export const getSameAuthorBlogs = async (blogId: string, userId: string) =>
  await axios.get(`${HOST}/api/v1/blogs/${blogId}/author/${userId}`);

export const getSameCateBlogs = async (blogId: string, cateId: string) =>
  await axios.get(`${HOST}/api/v1/blogs/${blogId}/category/${cateId}`);

export const createBlogApiPath = `${HOST}/api/v1/blogs`;
export const updateBlogApiPath = `${HOST}/api/v1/blogs`;
export const getSeftBlogDetailApiPath = `${HOST}/api/v1/blogs/self`;
export const reportBlogApiPath = `${HOST}/api/v1/reports`;
export const reportBlogDetailApiPath = `${HOST}/api/v1/reports`;
