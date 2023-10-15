import { Button, Card, Col, Modal, Popconfirm, Popover, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import toastOption from "~/utils/constants/toastOption";
import AddSeriesModal from "./add-series-modal/AddSeriesModal";
import { useAuth } from "~/utils/helpers";
import { NavLink } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Series {
  _id: string;
  title: string;
  description: string;
  numBlog: number;
  key: string;
}

const Series = () => {
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seriesList, setSeriesList] = useState<Series[]>([]);

  const deleteSeries = async (id: string) => {
    try {
      const res = await axiosPrivate.delete(`/api/v1/series/${id}`);
      setSeriesList(prev => prev.filter(seri => seri._id !== id));
      toast.success("Delete series thành công", toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getSeries = async () => {
      try {
        const res = await axiosPrivate.get("/api/v1/series");
        const formatedSeriesList = res.data.data?.map((seri: Series) => ({
          ...seri,
          key: seri._id
        }));
        setSeriesList(formatedSeriesList);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getSeries();
  }, [axiosPrivate]);

  const handleAddSeries = async (values: any) => {
    try {
      const res = await axiosPrivate.post("/api/v1/series", {
        ...values,
        userId: userGlobal._id
      });
      setSeriesList(prev => [{ ...res.data.blogSeries, key: res.data.blogSeries._id }, ...prev]);
      setIsModalOpen(false);
      toast.success(res.data.message, toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };
  // cảu tôi thì được sửa
  return (
    <Space direction="vertical">
      <Modal
        title="Add series Modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => <CancelBtn />}
      >
        <AddSeriesModal handleAddSeries={handleAddSeries} />
      </Modal>
      <Space align="center" size="middle" className="my-4">
        <Button onClick={showModal}>Thêm series</Button>
      </Space>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {seriesList.map((series: Series) => (
          <Card hoverable title={series.title} bordered style={{ width: "100%" }}>
            <Popover
              content={
                <div className="flex flex-col">
                  <Button type="primary" className="bg-blue-400">
                    Chỉnh sửa
                  </Button>
                  <Popconfirm
                    title="Delete the series"
                    description="Are you sure to delete this series?"
                    onConfirm={() => deleteSeries(series._id)}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger>
                      Xoá
                    </Button>
                  </Popconfirm>
                </div>
              }
              trigger="click"
              placement="rightBottom"
            >
              <div className="bg-transparent p-1 rounded absolute right-2 top-3 cursor-pointer hover:bg-gray-200">
                <BsThreeDotsVertical className="text-xl" />
              </div>
            </Popover>
            <p className="line-clamp-2 flex-1">{series.description}</p>

            <div className="flex justify-between items-center mt-2">
              <span className="text-base ">{series.numBlog} bài viết</span>
              <button className=" bg-blue-200 items-center justify-center rounded-sm py-1 px-3">
                Chi tiết
              </button>
            </div>
          </Card>
        ))}
      </div>
    </Space>
  );
};

export default Series;
