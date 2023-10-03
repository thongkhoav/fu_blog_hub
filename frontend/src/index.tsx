import { createRoot } from "react-dom/client";
import "src/assets/scss/index.scss";
import reportWebVitals from "./reportWebVitals";
import AppRoutes from "./routes/routes";
import React from "react";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
    <AppRoutes />
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
