import axios from "./axios";
import { useAuth } from "~/utils/helpers";
import { setUserData, getUserData } from "~/utils/helpers";

const useRefreshToken = () => {
  const { setUserGlobal } = useAuth();
  const user = getUserData();

  const refresh = async () => {
    try {
      const response = await axios.post("/api/v1/users/refresh-token", {
        refreshToken: user?.refreshToken || ""
      });
      // const response = await axios.post("/api/v1/users/refresh-token", {
      //   withCredentials: true,
      //   headers: {
      //     Authorization: "Bearer " + user?.refreshToken || ""
      //   }
      // });
      // setAuth(prev => {
      //   console.log(JSON.stringify(prev));
      //   console.log(response.data.accessToken);
      //   return { ...prev, accessToken: response.data.accessToken };
      // });
      setUserData({ ...user, accessToken: response.data.token });
      setUserGlobal((prev: any) => ({ ...prev, accessToken: response.data.token }));
      return response.data.token;
    } catch (error) {
      console.log(error);
    }
  };

  return refresh;
};

export default useRefreshToken;
