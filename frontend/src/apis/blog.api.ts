import axios, { AxiosResponse } from "axios";
import { HOST } from "~/utils/constants";
import { BlogDetail, BlogItem } from "~/utils/models/blog.model";
import useAxiosPrivate from "~/config/useAxiosPrivate";
interface HighlightBlogsRes extends AxiosResponse {
  data: {
    highlightBlogs: BlogItem[];
  };
}

export const getHighlightBlogsApi = async (refreshToken: string): Promise<HighlightBlogsRes> =>
  await axios.get(`${HOST}/api/blogs/highlight`);

export const getBlogDetailApi = async (idBlog: string) =>
  await axios.get<BlogDetail>(`${HOST}/api/blogs/${idBlog}`);

export const getBlogTagsApi = async () => await axios.get(`${HOST}/api/v1/tags`);

export const getBlogCategoriesApi = async () => await axios.get(`${HOST}/api/v1/categories`);

export const getProfileSeriesApi = async (id: string) =>
  await axios.get(`${HOST}/api/v1/series/user/${id}`);

export const getAllPublicBlogs = async () => await axios.get(`${HOST}/api/v1/blogs`);

export const createBlogApiPath = `${HOST}/api/v1/blogs`;
export const getSeftBlogDetailApiPath = `${HOST}/api/v1/blogs/self`;
