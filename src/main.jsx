import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App.jsx";
import { ApiProvider } from "./APIConfig/APIContext.jsx";
import "./assets/theme/dist/css/tabler.min.css";
import "./assets/theme/dist/js/tabler.min.js";
import "./assets/theme/dist/js/demo.js"
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"

createRoot(document.getElementById("root")).render(
  <ApiProvider>
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      style={{zIndex: 100000}}
    />
    <App />
  </ApiProvider>
);
