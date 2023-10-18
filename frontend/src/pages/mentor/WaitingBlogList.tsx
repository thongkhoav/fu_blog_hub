import { useEffect, useState } from "react";

import { Avatar, Card, Col, Row, Tabs } from "antd";

import ModalBlog from "./modal-blog/ModalBlog";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import moment from "moment";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";

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

  const getApproveBlogs = async (statusBlogs: string) => {
    try {
      const res = await axiosPrivate.get(`/api/v1/blogs/mentor/waiting-blogs?status=${statusBlogs}`);
      if ((res.data.status = "success")) {
        const waitingBlogs = [...res.data.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBlogList(waitingBlogs);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  useEffect(() => {
    getApproveBlogs("all");
  }, []);

  return (
    <div className="w-[1200px]">
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
          getApproveBlogs(key);
        }}
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {blogList &&
          blogList.map((product, index) => (
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
                    {moment(product.createdAt).utc().format("DD-MM-YYYY HH:mm:ss")}
                  </p>
                </div>
              </div>
              <div className="font-bold mt-4 line-clamp-2">{product.title}</div>
              <p className="line-clamp-2 text-gray-500 mt-1">{product.description}</p>
            </Card>
          ))}
      </div>
      <ModalBlog blogDetail={blogDetail} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default WaitingBlogList;
