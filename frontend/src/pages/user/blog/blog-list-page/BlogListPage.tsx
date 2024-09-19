import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BlogList from "./blog-list/BlogList";
import OptionSideBlogs from "./option-side-blogs/OptionSideBlogs";

export interface FilterList {
  category: string[];
  tag: string[];
}

const BlogListPage = () => {
  const { state } = useLocation();
  const [filters, setFilters] = useState<FilterList>({ category: [], tag: [], ...state });

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
