import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import { Card, Col, Modal, Row, Tabs } from "antd";

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
    title: "Bài viết 1",
    intro: "Đây là bài viết số 1",
    thumbnail:
      "https://nld.mediacdn.vn/thumb_w/540/2014/article-2612308-1d51068a00000578-859-634x798-1398410783770.jpg",
    createdAt: "2023-10-02T12:00:00Z",
    status: "waiting"
  },
  {
    id: 2,
    title: "Bài viết 2",
    intro: "Đây là bài viết số 2",
    thumbnail: "https://tingenz.com/wp-content/uploads/2022/10/hinh-anh-con-khi-cuoi-6-min.jpg",
    createdAt: "2023-10-01T14:30:00Z",
    status: "edit"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  },
  {
    id: 3,
    title: "Bài viết 3",
    intro: "Đây là bài viết số 3",
    thumbnail:
      "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg",
    createdAt: "2023-09-30T10:15:00Z",
    status: "waiting"
  }
];

const WaitingBlogList = () => {
  const [blogList, setBlogList] = useState<WaitingBlogItem[]>([]);
  const [keyTab, setKeyTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleApprovalBlog = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setBlogList(waitingBlogItems);
    // fetch blog list
  }, []);

  return (
    <>
      <h2>Product List</h2>
      <Tabs
        defaultActiveKey="all"
        centered
        items={[
          {
            label: "All",
            key: "all"
          },
          {
            label: "Waiting",
            key: "waiting"
          },
          {
            label: "Edit",
            key: "edit"
          }
        ]}
        onChange={(key: string) => {
          setKeyTab(key)
        }}
      />
      <Row gutter={[12, 12]} style={{ margin: '6px' }}>
        {blogList &&
          blogList.filter((item) => keyTab === 'all' ? item : item.status === keyTab).map((product, index) =>
            <>
              <Col span={4}>
                <Card
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  key={index}
                  hoverable
                  cover={<img style={{ height: "200px" }} alt="" src={product.thumbnail} />}
                >
                  <Card.Meta title={product.title} description={product.intro} />
                </Card>
              </Col>
            </>
          )
        }
      </Row>

      <Modal title="Basic Modal" open={isModalOpen} onOk={handleApprovalBlog} onCancel={() => setIsModalOpen(false)}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default WaitingBlogList;
