import { useEffect, useState } from "react";
import "./manage-tag.scss";

interface Tag {
  id: string;
  title: string;
  numBlog: number;
}

const ManageTag = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {}, []);

  return <div>Tag list</div>;
};

export default ManageTag;
