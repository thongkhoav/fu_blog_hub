import { axiosPrivate } from "./axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { getUserData, useAuth } from "~/utils/helpers";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const user = getUserData();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // if access token is expired, response will throw back, use refresh token to get new access token
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response: any) => response,
      async (error: { config: any; response: { status: number } }) => {
        const prevRequest = error?.config;
        // 500 expire
        // 401 user no longer exist
        if (
          (error?.response?.status === 500 || error?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;

          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user]);

  return axiosPrivate;
};

export default useAxiosPrivate;
