import { useState } from "react";
import "./manage-blog.scss";
import { BlogItem } from "~/utils/models/blog.model";

const ManageBlog = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  return <div>blog list</div>;
};

export default ManageBlog;
