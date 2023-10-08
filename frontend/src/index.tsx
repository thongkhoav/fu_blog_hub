import { createRoot } from "react-dom/client";
import "src/assets/scss/index.scss";
import reportWebVitals from "./reportWebVitals";
import AppRoutes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <>
    <AppRoutes />
    <ToastContainer />
  </>
  // </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <AppRoutes />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
