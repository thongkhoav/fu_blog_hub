import { useEffect, useState } from "react";

import { Avatar, Card, Col, Row, Tabs } from "antd";

import ModalBlog from "./modal-blog/ModalBlog";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import moment from "moment";

interface WaitingBlogItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  status: string;
  tags: string[];
  userId: any;
}
const WaitingBlogList = () => {
  const [blogList, setBlogList] = useState<WaitingBlogItem[]>([]);
  const [keyTab, setKeyTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogDetail, setBlogDetail] = useState({});
  const axiosPrivate = useAxiosPrivate();

  const getAllWaitingBlogs = async () => {
    const res = await axiosPrivate.get("/api/v1/blogs/mentor/waiting-blogs");
    if (res.status === 200) {
      let waitingBlogs = res.data.data.blogs;
      setBlogList(waitingBlogs);
    }
  };

  useEffect(() => {
    getAllWaitingBlogs();
    // setBlogList(waitingBlogItems);
    // fetch blog list
  }, []);

  return (
    <>
      <Tabs
        defaultActiveKey="all"
        centered
        items={[
          {
            label: <div style={{ color: "black" }}>Tất cả</div>,
            key: "all"
          },
          {
            label: <div style={{ color: "#0c98ff" }}>Chờ duyệt</div>,
            key: "waiting"
          },
          {
            label: <div style={{ color: "#ff7373" }}>Đã từ chối</div>,
            key: "rejected"
          }
        ]}
        onChange={(key: string) => {
          setKeyTab(key);
        }}
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {blogList &&
          blogList
            .filter(item => (keyTab === "all" ? item : item.status === keyTab))
            .map((product, index) => (
              <Card
                key={index}
                className={`${product.status === "waiting" ? "bg-sky-50" : "bg-red-100"}`}
                onClick={() => {
                  setBlogDetail(product);
                  setIsModalOpen(true);
                }}
                hoverable
                cover={<img style={{ height: "200px" }} alt="" src={product.thumbnail} />}
              >
                <div className="flex items-center" style={{ margin: "-10px 0 10px 0" }}>
                  <Avatar src={product.userId?.avatar} />
                  <div className="ml-2">
                    <p className="font-bold">{product.userId?.fullName}</p>
                    <p className="font-light text-sm">
                      {moment(product.createdAt).utc().format("DD-MM-YYYY hh:mm:ss")}
                    </p>
                  </div>
                </div>
                <div className="font-bold mt-4 line-clamp-2">{product.title}</div>
                <p className="line-clamp-2 text-gray-500 mt-1">{product.description}</p>
              </Card>
            ))}
      </div>
      <ModalBlog blogDetail={blogDetail} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WaitingBlogList;
