import { useEffect, useState } from "react";
import { Avatar, Card, Col, Row, Tabs } from "antd";
import ModalBlog from "./modal-blog/ModalBlog";

interface WaitingBlogItem {
  id: number;
  title: string;
  intro: string;
  thumbnail: string;
  createdAt: string;
  status: string;
}

const waitingBlogItems: WaitingBlogItem[] = [
  {
    id: 1,
    title:
      "Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1Bài viết 1",
    intro: "Đây là bài số 1",
    thumbnail:
      "https://nld.mediacdn.vn/thumb_w/540/2014/article-2612308-1d51068a00000578-859-634x798-1398410783770.jpg",
    createdAt: "20-10-2022 12:33:00",
    status: "waiting"
  },
  {
    id: 2,
    title: "Bài viết 2",
    intro: "Đây là bài viết số 2",
    thumbnail: "https://tingenz.com/wp-content/uploads/2022/10/hinh-anh-con-khi-cuoi-6-min.jpg",
    createdAt: "20-10-2022 12:33:00",
    status: "edit"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "20-10-2022 12:33:00",
    status: "waiting"
  },
  {
    id: 4,
    title: "Bài viết 4",
    intro: "Đây là bài viết số 4Đây là bài viết số 4Đây là bài viết số 4Đây là bài viết số 4",
    thumbnail:
      "https://nhadepso.com/wp-content/uploads/2023/02/chiem-nguong-99-hinh-anh-con-ngua-dep-nhat-manh-me-oai-phong_1.jpg",
    createdAt: "20-10-2022 12:33:00",
    status: "edit"
  },
  {
    id: 5,
    title: "Bài viết 5",
    intro: "Đây là bài viết số 4Đây là bài viết số 4Đây là bài viết số 4Đây là bài viết số 4",
    thumbnail:
      "https://nhadepso.com/wp-content/uploads/2023/02/chiem-nguong-99-hinh-anh-con-ngua-dep-nhat-manh-me-oai-phong_1.jpg",
    createdAt: "20-10-2022 12:33:00",
    status: "edit"
  }
];

const WaitingBlogList = () => {
  const [blogList, setBlogList] = useState<WaitingBlogItem[]>([]);
  const [keyTab, setKeyTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogDetail, setBlogDetail] = useState({});

  useEffect(() => {
    setBlogList(waitingBlogItems);
    // fetch blog list
  }, []);

  return (
    <>
      <Tabs
        defaultActiveKey="all"
        centered
        items={[
          {
            label: <div style={{ color: "black" }}>All</div>,
            key: "all"
          },
          {
            label: <div style={{ color: "#ff7373" }}>Waiting</div>,
            key: "waiting"
          },
          {
            label: <div style={{ color: "#0c98ff" }}>Edit</div>,
            key: "edit"
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
                className={`${product.status === "waiting" ? "bg-red-100" : "bg-sky-50"}`}
                onClick={() => {
                  setBlogDetail(product);
                  setIsModalOpen(true);
                }}
                hoverable
                cover={<img style={{ height: "200px" }} alt="" src={product.thumbnail} />}
              >
                <div className="flex items-center" style={{ margin: "-10px 0 10px 0" }}>
                  <Avatar src="https://nld.mediacdn.vn/thumb_w/540/2014/article-2612308-1d51068a00000578-859-634x798-1398410783770.jpg" />
                  <div className="ml-2">
                    <p className="font-bold">Nguyen Van A</p>
                    <p className="font-light text-sm">{product.createdAt}</p>
                  </div>
                </div>
                <div className="font-bold mt-4 line-clamp-2">{product.title}</div>
                <p className="line-clamp-2 text-gray-500 mt-1">{product.intro}</p>
              </Card>
            ))}
      </div>
      <ModalBlog blogDetail={blogDetail} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WaitingBlogList;
