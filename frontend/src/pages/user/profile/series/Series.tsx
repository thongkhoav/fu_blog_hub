import { Button, Card, Col, Modal, Popconfirm, Popover, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import toastOption from "~/utils/constants/toastOption";
import AddSeriesModal from "./add-series-modal/AddSeriesModal";
import { useAuth } from "~/utils/helpers";
import { NavLink, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "~/config/axios";
import { AiOutlineSetting } from "react-icons/ai";

interface Series {
  _id: string;
  title: string;
  description: string;
  numBlog: number;
  key: string;
}

const Series = ({ isPersonalProfile = false }: { isPersonalProfile?: boolean }) => {
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();
  const { idUser } = useParams();
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
        const userId = idUser || userGlobal._id;
        const res = await axios.get("/api/v1/series/user/" + userId);
        const formatedSeriesList = res.data.data?.map((seri: Series) => ({
          ...seri,
          key: seri._id
        }));
        setSeriesList(formatedSeriesList);
        console.log(formatedSeriesList);
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
    <Space direction="vertical" className="w-full">
      {isPersonalProfile && (
        <>
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
        </>
      )}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {seriesList.map((series: Series) => (
          <Card hoverable key={series._id} title={series.title} bordered style={{ width: "100%" }}>
            {isPersonalProfile ? (
              <Popover
                content={
                  <div className="flex flex-col">
                    <Button className="text-blue-500 border-none h-fit rounded-none">
                      Chỉnh sửa
                    </Button>
                    <Popconfirm
                      title="Xoá series?"
                      description="Bạn có chắc chắn muốn xoá series này?"
                      onConfirm={() => deleteSeries(series._id)}
                      onCancel={() => {}}
                      okText="Có"
                      cancelText="Không"
                      okButtonProps={{ danger: true, className: "text-red-500" }}
                    >
                      <Button
                        danger
                        className=" text-red-500 border-none p-0 h-fit w-full rounded-none"
                      >
                        Xoá
                      </Button>
                    </Popconfirm>
                  </div>
                }
                trigger="click"
                placement="rightBottom"
              >
                <div className=" p-1 rounded bg-white opacity-60 absolute right-1 top-1 cursor-pointer ant-popover-open">
                  <AiOutlineSetting className="text-sm text-black" />
                </div>
              </Popover>
            ) : undefined}

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
