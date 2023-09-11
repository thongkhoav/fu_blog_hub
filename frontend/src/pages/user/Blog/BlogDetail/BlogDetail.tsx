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
  const params: { idProduct: string } = useParams();
  const [blogDetail, setBlogDetail] = useState<BlogDetail>({
    id: "",
    title: "",
    category: "",
    createdAt: ""
  });
  useEffect(() => {
    const { idProduct } = params;
    // fetch blog
  }, [params]);
  return (
    <MainLayout>
      {blogDetail && (
        <>
          <h2>{blogDetail.title}</h2>
        </>
      )}
    </MainLayout>
  );
}

export default BlogDetail;
