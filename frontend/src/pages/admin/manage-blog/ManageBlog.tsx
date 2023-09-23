import { useState } from "react";
import "./manage-blog.scss";

interface BlogItem {
  id: string;
  title: string;
  introduction: string;
}

const ManageBlog = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  return <div>blog list</div>;
};

export default ManageBlog;
