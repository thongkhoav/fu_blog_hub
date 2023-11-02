import { useEffect, useState } from "react";
import { Button, Drawer, Layout, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useLocation, useParams } from "react-router-dom";
import { FE_HOST, HOST } from "~/utils/constants";
import { BlogDetail } from "~/utils/models/blog.model";
import TextArea from "antd/es/input/TextArea";
import { reportApiPath } from "~/apis/blog.api";

export interface ReportItem {
  _id: string;
  content: string;
  objectId: string;
  reportBy: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  resolvedAt: Date;
  resolveContent?: string;
  key: string;
}

export interface ReportDetail {
  blog: BlogDetail;
  report: ReportItem;
}

const ReportBlog = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [resolveContent, setResolveContent] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [reportDetail, setReportDetail] = useState<ReportDetail>();

  const showDrawer = async (record: ReportItem) => {
    try {
      const { data } = await axiosPrivate.get("/api/v1/reports/blog/detail/" + record._id);
      setReportDetail(data.data);
    } catch (error) {}
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const removeBlog = async () => {
    // xoá thì mất hết report chưa xử lí của blog
    const idBlog = reportDetail?.blog._id;
    try {
      await axiosPrivate.put(`${HOST}/api/v1/reports/${reportDetail?.report._id}`, {
        content: resolveContent
      });
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/blogs/${idBlog}`);
      toast.success(data.message);
      setReports(prev => prev.filter(report => report.objectId !== idBlog));
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const processReport = async () => {
    // chỉ mất report được xử lí
    const idReport = reportDetail?.report._id;
    try {
      const { data } = await axiosPrivate.put(`${HOST}/api/v1/reports/${idReport}`);
      toast.success(data.message);
      setReports(prev => prev.filter(report => report._id !== reportDetail?.report._id));
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const pathnameArr = pathname.split("/");
    const getReports = async () => {
      try {
        const res = await axiosPrivate.get(
          reportApiPath + "/blog/" + pathnameArr[pathnameArr.length - 1]
        );

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
      render: (_, record) => <Button onClick={() => showDrawer(record)}>Xử lý</Button>
    }
  ];

  return (
    <Layout className="mt-5">
      <Drawer
        title="Chi tiết báo cáo bài viết"
        placement="right"
        onClose={onClose}
        open={open}
        width={400}
        footer={
          <div className="flex justify-between">
            <button className="rounded-md text-white bg-green-500 px-4" onClick={processReport}>
              Chỉ xử lý
            </button>
            <Button danger onClick={removeBlog}>
              Xoá bài viết
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-lg ">Chủ đề: {reportDetail?.blog.blogCateId.name}</h1>
          <h1 className="text-lg">Tiêu đề: {reportDetail?.blog.title}</h1>

          <a href={FE_HOST + "/blogs/" + reportDetail?.blog._id} target="_blank" rel="noreferrer">
            Click để xem chi tiết
          </a>
          <hr className="my-2" />
          <p>
            <span className="font-bold">Lý do báo cáo:</span> {reportDetail?.report.content}
          </p>
          <TextArea
            rows={4}
            placeholder="Nội dung xử lý"
            maxLength={300}
            onChange={e => setResolveContent(e.target.value)}
          />
        </div>
      </Drawer>
      <Table columns={columns} dataSource={reports} />
    </Layout>
  );
};

export default ReportBlog;
