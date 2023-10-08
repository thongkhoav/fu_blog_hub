import { ToastOptions } from "react-toastify";

const toastOption: ToastOptions<{}> | undefined = {
  position: "top-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
};

export default toastOption;
