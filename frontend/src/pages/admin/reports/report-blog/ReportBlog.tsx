import { useEffect, useState } from "react";
import { Button, Drawer, Input, Layout, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { reportBlogApiPath } from "~/apis/blog.api";
import { useLocation, useParams } from "react-router-dom";
import { FE_HOST, HOST } from "~/utils/constants";
import { BlogDetail } from "~/utils/models/blog.model";

export interface ReportBlogItem {
  _id: string;
  content: string;
  objectId: string;
  reportBy: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  resolve: {
    resolvedAt: Date;
    // resolvedBy: Schema.Types.ObjectId;
    resolveContent?: string;
  };
  key: string;
}

export interface ReportDetail {
  blog: BlogDetail;
  report: ReportBlogItem;
}

const ReportBlog = () => {
  const [reports, setReports] = useState<ReportBlogItem[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [reportDetail, setReportDetail] = useState<ReportDetail>();

  const showDrawer = async (record: ReportBlogItem) => {
    try {
      const { data } = await axiosPrivate.get("/api/v1/reports/blog/detail/" + record._id);
      setReportDetail(data.data);
    } catch (error) {}
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const removeBlog = async (blogId: string) => {
    console.log(blogId);

    // try {
    //   await axiosPrivate.delete("/api/v1/blogs/" + blogId);
    //   toast.success("Xoá bài viết ", toastOption);
    //   onClose();
    // } catch (error: any) {
    //   toast.error(error.message, toastOption);
    // }
  };

  useEffect(() => {
    const pathnameArr = pathname.split("/");
    const getReports = async () => {
      try {
        const res = await axiosPrivate.get(
          reportBlogApiPath + "/blog/" + pathnameArr[pathnameArr.length - 1]
        );

        const formatedReports = res.data.data?.map((report: ReportBlogItem) => ({
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

  const columns: ColumnsType<ReportBlogItem> = [
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
      render: (_, record) => <Button onClick={() => showDrawer(record)}>Detail</Button>
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
          <div
            style={{
              textAlign: "right"
            }}
          >
            <Button danger onClick={() => removeBlog(reportDetail?.blog._id as string)}>
              Xoá bài viết
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-lg ">Chủ đề: {reportDetail?.blog.blogCateId.name}</h1>
          <h1 className="text-lg">Tiêu đề: {reportDetail?.blog.title}</h1>
          <p>
            <span className="font-bold">Lý do báo cáo:</span> {reportDetail?.report.content}
          </p>

          <a href={FE_HOST + "/blogs/" + reportDetail?.blog._id} target="_blank" rel="noreferrer">
            Click để xem chi tiết
          </a>
        </div>
      </Drawer>
      <Table columns={columns} dataSource={reports} />
    </Layout>
  );
};

export default ReportBlog;
