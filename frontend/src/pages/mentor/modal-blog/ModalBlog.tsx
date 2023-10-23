import { Button, Col, Modal, Row } from "antd";
import "./modal-blog.scss";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import { PATH } from "~/utils/constants";
import parse from "html-react-parser";
import { axiosPrivate } from "~/config/axios";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";

export default function ModalBlog({ blogDetail, onClose, handleUpdateBlog, ...props }: any) {
  const modalTitle = (
    <Row>
      <Col span={16}>
        <p className="text-xl uppercase font-medium">
          Viết bởi tác giả:{" "}
          <Link to={`/profile/${blogDetail?.userId?._id}`}>{blogDetail?.userId?.fullName}</Link>
        </p>
        <p style={{ color: "#00000078", fontSize: "12px", marginLeft: "6px" }}>
          {moment(blogDetail?.createdAt).utc().format("DD/MM/YYYY HH:mm")} -{" "}
          {blogDetail?.status === "waiting" ? "Chờ duyệt" : "Đã từ chối"}
        </p>
      </Col>
      <Col span={8} style={{ textAlign: "right" }}>
        {blogDetail?.status === "waiting" && (
          <Button
            className="btn-reject"
            icon={<CloseOutlined />}
            onClick={() => {
              handleReject();
            }}
          >
            Từ chối
          </Button>
        )}
        <Button
          className="btn-primary"
          style={{ marginLeft: "6px", marginRight: "30px" }}
          icon={<CheckOutlined />}
          onClick={() => {
            handleAccept();
          }}
        >
          Duyệt
        </Button>
      </Col>
    </Row>
  );

  const handleReject = async () => {
    let dataSend = { status: "rejected" };
    try {
      const res = await axiosPrivate.put(
        `/api/v1/blogs/mentor/waiting-blogs/${blogDetail._id}`,
        dataSend
      );
      if (res.data.status === "success") {
        handleUpdateBlog("rejected", blogDetail._id);
        toast.success("Từ chối thành công!", toastOption);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
    onClose();
  };

  const handleAccept = async () => {
    let dataSend = { status: "public" };
    try {
      const res = await axiosPrivate.put(
        `/api/v1/blogs/mentor/waiting-blogs/${blogDetail._id}`,
        dataSend
      );
      if (res.data.status === "success") {
        handleUpdateBlog("public", blogDetail._id);
        toast.success("Duyệt thành công!", toastOption);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
    onClose();
  };

  return (
    <Modal
      className="modal_container"
      title={modalTitle}
      centered
      width={"70%"}
      onCancel={onClose}
      footer={false}
      {...props}
    >
      {blogDetail && (
        <>
          {blogDetail.thumbnail ? (
            <img src={blogDetail.thumbnail} alt="" className="h-[500px] w-full mb-2" />
          ) : (
            <p className="my-3 text-center"> Chưa có ảnh đại điện blog</p>
          )}
          <h1 className="text-2xl">Title: {blogDetail.title}</h1>
          <div className="flex justify-between items-center">
            <h2 className="capitalize text-lg font-medium text-[#404040] opacity-80">
              <span>Thể loại: {blogDetail.blogCateId?.name}</span>
            </h2>
          </div>
          <div className="mb-2">
            Tag:
            {blogDetail?.blogTagIds?.map((tag: any) => (
              <Link
                to={`${PATH.BLOG}?tag=${tag.name}`}
                key={tag._id}
                className="text-sm text-inherit px-3 py-2 mr-3 rounded-sm underline hover:opacity-100 text-gray-800 opacity-80"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          <hr />
          <div className="mt-2">{blogDetail.contentRaw && parse(`${blogDetail.contentRaw}`)}</div>
        </>
      )}
    </Modal>
  );
}
