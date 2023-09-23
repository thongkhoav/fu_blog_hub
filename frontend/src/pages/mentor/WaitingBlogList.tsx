import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";

interface WaitingBlogItem {
  id: number;
  title: string;
  intro: string;
  thumbnail: string | ImageData;
  createdAt: string;
}

const WaitingBlogList = () => {
  const [blogList, setBlogList] = useState<WaitingBlogItem[]>([]);
  useEffect(() => {
    // fetch blog list
  }, []);

  return (
    <>
      <h2>Product List</h2>
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
    </>
  );
};

export default WaitingBlogList;
