import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";

interface ProductItem {
  id: number;
  title: string;
  createdAt: string;
}

const BlogList = () => {
  const [blogList, setBlogList] = useState<ProductItem[]>([]);
  useEffect(() => {
    // fetch blog list
  }, []);

  return (
    <div>
      <h2>blog List</h2>
      <p>filter theo 1 cate hoặc 1 tag, 1 blog có {">"}=1 tag</p>
      {blogList.map((product, index) => (
        <tr key={product.id}>
          <td>{product.createdAt}</td>
          <td>
            <Link className="btn btn-primary" to={PATH.BLOG + `/${product.id}`}>
              <td>{product.title}</td>
            </Link>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default BlogList;
