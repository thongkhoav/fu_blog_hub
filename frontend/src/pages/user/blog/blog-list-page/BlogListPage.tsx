import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { BlogItem } from "~/utils/models/blog.model";
import BlogList from "./blog-list/BlogList";
import OptionSideBlogs from "./option-side-blogs/OptionSideBlogs";

export interface FilterList {
  category: string[];
  tag: string[];
}

const BlogListPage = () => {
  const [filters, setFilters] = useState<FilterList>({ category: [], tag: [] });
  return (
    <div className="flex mt-5 gap-4">
      <div className="flex-1">
        <OptionSideBlogs filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex-[2]">
        <BlogList filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default BlogListPage;
