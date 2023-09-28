import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { useParams } from "react-router-dom";

interface BlogDetail {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}

function BlogDetail() {
  const { idBlog } = useParams<{ idBlog: string }>();
  const [blogDetail, setBlogDetail] = useState<BlogDetail>({
    id: "",
    title: "",
    category: "",
    createdAt: ""
  });
  useEffect(() => {
    // fetch blog
    try {
    } catch (error) {}
  }, [idBlog]);
  return (
    <>
      blog detail
      {/* hình thumbnail trên cùng */}
      {/* phần thông tin nhỏ */}
      {/* divider */}
      {/* content */}
      {/* blog tương tự */}
      {/* comment */}
    </>
  );
}

export default BlogDetail;
