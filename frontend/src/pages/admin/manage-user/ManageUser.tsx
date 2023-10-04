import { useState } from "react";
import "./manage-user.scss";

interface User {
  id: string;
  account: string;
  banned: boolean;
}

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  return <div className="h-[2000px]">user list both banned and active</div>;
};

export default ManageUser;
