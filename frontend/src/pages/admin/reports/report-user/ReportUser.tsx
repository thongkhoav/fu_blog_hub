import { UserProfile } from "~/utils/models/user.model";
import { ReportItem } from "../report-blog/ReportBlog";
import TextArea from "antd/es/input/TextArea";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Layout,
  Modal,
  Space,
  Table,
  Typography
} from "antd";
import { FE_HOST, HOST } from "~/utils/constants";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { toast } from "react-toastify";
import { reportApiPath } from "~/apis/blog.api";
import toastOption from "~/utils/constants/toastOption";
import { ColumnsType } from "antd/es/table";
import { deleteUserApiPath } from "~/apis/user.api";
import moment from "moment";

export interface ReportDetail {
  user: UserProfile;
  report: ReportItem;
}

function ReportUser() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [resolveContent, setResolveContent] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [status, setStatus] = useState<string>();
  const [reportDetail, setReportDetail] = useState<ReportDetail>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = async (record: ReportItem) => {
    try {
      const { data } = await axiosPrivate.get("/api/v1/reports/user/detail/" + record._id);
      setReportDetail(data.data);
    } catch (error) {}
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const banUser = async () => {
    form
      .validateFields()
      .then(async values => {
        if (!reportDetail?.user?._id) {
          return;
        }
        const deletePayload = {
          ...values,
          banUntil: values.banUntil.$d
        };
        try {
          await axiosPrivate.put(`${HOST}/api/v1/reports/${reportDetail?.report._id}`, {
            content: resolveContent
          });

          axiosPrivate
            .put(deleteUserApiPath(reportDetail?.user._id!), deletePayload)
            .then(res => {
              setIsModalOpen(false);
              setReports(prev => prev.filter(report => report.objectId !== reportDetail?.user._id));
              toast.success("Đã ban user ", toastOption);
              showModal(false);
            })
            .catch(err => {
              toast.error(err.response.data.message, toastOption);
            });
        } catch (error: any) {
          toast.error(error.message, toastOption);
        }
      })
      .catch(err => {});
  };

  const processReport = async () => {
    // chỉ mất report được xử l
    if (resolveContent === "") {
      toast.error("Vui lòng nhập nội dung xử lý");
      return;
    }
    const idReport = reportDetail?.report._id;
    if (!idReport) return;
    try {
      const { data } = await axiosPrivate.put(`${HOST}/api/v1/reports/${idReport}`, {
        content: resolveContent
      });
      toast.success(data.message);
      setReports(prev => prev.filter(report => report._id !== reportDetail?.report._id));
      setResolveContent("");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const pathnameArr = pathname.split("/");
    const status1 = pathnameArr[pathnameArr.length - 1];
    setStatus(status1);
    const getReports = async () => {
      try {
        const res = await axiosPrivate.get(reportApiPath + "/user/" + status1);

        const formatedReports = res.data.data?.map((report: ReportItem) => ({
          ...report,
          key: report._id
        }));
        setReports(formatedReports);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getReports();
  }, [pathname]);

  const columns: ColumnsType<ReportItem> = [
    {
      title: "Người báo cáo",
      render: (_, record) => (
        <Space>
          <img
            className="w-[30px] h-[30px] rounded-full border border-slate-600"
            src={record.reportBy.avatar}
            alt=""
          />
          <Typography.Text>{record.reportBy.fullName}</Typography.Text>
        </Space>
      ),
      filterSearch: true,
      width: "30%"
    },
    {
      title: "Nội dung",
      dataIndex: "content"
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <>
          {status === "unresolved" ? (
            <Button onClick={() => showDrawer(record)}>Xử lý</Button>
          ) : (
            <Button onClick={() => showDrawer(record)}>Chi tiết</Button>
          )}
        </>
      )
    }
  ];

  const showModal = (value: boolean) => setIsModalOpen(value);

  return (
    <Layout className="mt-5">
      <Modal
        forceRender
        title="Thông tin ban user"
        style={{ maxWidth: "700px", zIndex: 9999 }}
        open={isModalOpen}
        onCancel={() => showModal(false)}
        footer={[
          <Button
            key="customCancel"
            className="h-[40px]"
            onClick={() => {
              showModal(false);
              setOpen(true);
            }}
          >
            Cancel
          </Button>,
          <Button key="customOk" className="h-[40px]" onClick={banUser}>
            Ban user
          </Button>
        ]}
      >
        <Form form={form} requiredMark layout="vertical">
          <Form.Item
            label="Lý do ban user"
            name="bannedReason"
            rules={[{ required: true, message: "Vui lòng nhập lý do ban" }]}
          >
            <Input
              maxLength={200}
              style={{
                width: "100%",
                padding: "0px 6px",
                borderRadius: "5px",
                fontSize: "14px"
              }}
            />
          </Form.Item>

          <Form.Item
            label="Thời hạn ban"
            name="banUntil"
            rules={[{ required: true, message: "Vui lòng chọn thời hạn ban" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Chi tiết báo cáo bài viết"
        placement="right"
        onClose={onClose}
        style={{ zIndex: 1000 }}
        open={open}
        width={400}
        footer={
          status === "unresolved" && (
            <div className="flex justify-between">
              <button className="rounded-md text-white bg-amber-500 px-4" onClick={processReport}>
                Chỉ xử lý
              </button>
              <Button
                danger
                onClick={() => {
                  if (resolveContent == "") {
                    toast.error("Vui lòng nhập nội dung xử lý");
                    return;
                  }
                  showModal(true);
                  setOpen(false);
                }}
              >
                Xoá bài viết
              </Button>
            </div>
          )
        }
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Người dùng bị báo cáo</h1>
          <p className="text-lg ">Email: {reportDetail?.user.email}</p>
          <p className="text-lg">Họ và tên: {reportDetail?.user.fullName}</p>
          <p className="text-lg">Vai trò: {reportDetail?.user.role}</p>

          <a href={FE_HOST + "/profile/" + reportDetail?.user._id} target="_blank" rel="noreferrer">
            Click để xem chi tiết profile
          </a>
          <hr className="my-2" />
          {status === "unresolved" ? (
            <>
              <p>
                <span className="font-bold">Lý do báo cáo:</span> {reportDetail?.report.content}
              </p>
              <TextArea
                rows={4}
                placeholder="Nhập nội dung xử lý"
                maxLength={300}
                onChange={e => setResolveContent(e.target.value)}
              />
            </>
          ) : (
            <>
              <p>
                <span className="font-bold">Nội dung xử lý:</span>{" "}
                {reportDetail?.report.resolveContent}
              </p>
              <p>
                <span className="font-bold">Xử lý lúc:</span>{" "}
                {moment(reportDetail?.report.resolvedAt).utc().format("DD-MM-YYYY HH:mm")}
              </p>
            </>
          )}
        </div>
      </Drawer>
      <Table columns={columns} dataSource={reports} />
    </Layout>
  );
}

export default ReportUser;
