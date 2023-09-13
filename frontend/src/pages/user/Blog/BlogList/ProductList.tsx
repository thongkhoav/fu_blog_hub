import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";

interface ProductItem {
  id: number;
  title: string;
  createdAt: string;
}

const ProductList = () => {
  const [blogList, setBlogList] = useState<ProductItem[]>([]);
  useEffect(() => {
    // fetch blog list
  }, []);

  return (
    <MainLayout>
      <h2>Product List</h2>
      {blogList.map((product, index) => (
        <tr key={product.id}>
          <td>{product.createdAt}</td>
          <td>
            <Link className="btn btn-primary" to={PATH.PRODUCT + `/${product.id}`}>
              <td>{product.title}</td>
            </Link>
          </td>
        </tr>
      ))}
    </MainLayout>
  );
};

export default ProductList;
