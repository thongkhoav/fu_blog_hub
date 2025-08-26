import { useEffect, useState } from "react";

import { Avatar, Card, Empty, Tabs } from "antd";

import ModalBlog from "./modal-blog/ModalBlog";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import moment from "moment";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
interface WaitingBlogItem {
  _id: string;
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
      const res = await axiosPrivate.get(
        `/api/v1/blogs/mentor/waiting-blogs?status=${statusBlogs}`
      );
      if ((res.data.status = "success")) {
        const waitingBlogs = [...res.data.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBlogList(waitingBlogs);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const handleUpdateBlog = (value: string, id: string) => {
    let newBlogList = [...blogList];
    const index = newBlogList.findIndex(obj => obj._id === id);
    if (keyTab === "all" && value === "rejected") {
      newBlogList[index].status = value;
      setBlogList(newBlogList);
    } else {
      newBlogList.splice(index, 1);
      setBlogList(newBlogList);
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
            label: <div style={{ color: "black" }}>All</div>,
            key: "all"
          },
          {
            label: <div style={{ color: "#0c98ff" }}>Waiting</div>,
            key: "waiting"
          },
          {
            label: <div style={{ color: "#ff7373" }}>Rejected</div>,
            key: "rejected"
          }
        ]}
        onChange={(key: string) => {
          setKeyTab(key);
          getApproveBlogs(key);
        }}
      />
      {blogList.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 mb-4">
          {blogList.map((product, index) => (
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
                    {moment(product.createdAt).utc().format("DD-MM-YYYY HH:mm")}
                  </p>
                </div>
              </div>
              <div className="font-bold mt-4 line-clamp-2">{product.title}</div>
              <p className="line-clamp-2 text-gray-500 mt-1">{product.description}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          style={{ marginTop: "50px" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={"Không có dữ liệu"}
        />
      )}
      <ModalBlog
        blogDetail={blogDetail}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleUpdateBlog={(valueStatus: string, id: string) => {
          handleUpdateBlog(valueStatus, id);
        }}
      />
    </div>
  );
};

export default WaitingBlogList;
