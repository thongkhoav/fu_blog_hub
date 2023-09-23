import { useEffect, useState } from "react";
import "./manage-category.scss";

interface Category {
  id: string;
  account: string;
  banned: boolean;
}

const ManageCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {}, []);

  return <div>category list</div>;
};

export default ManageCategory;
