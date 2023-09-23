import { AxiosResponse } from "axios";

interface ResLoginApi extends AxiosResponse {
  data: {
    access_token: string;
  };
}
