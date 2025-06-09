import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Layout.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import checkValue from "../utilities/checkValue";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = sessionStorage.getItem("login");
   const roleId = sessionStorage.getItem("roleId")

  // function to open sidebar
  const handleSidebarOpen = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  // navigate user to login page if unauthorized
  useEffect(() => {
    if (checkValue(token)) navigate("/login", { replace: true });
  }, []);

  window.onload = function () {
    window.scrollTo(0, 0);
  };

  const isNotLandlordOrBroker = !["4","5"].includes(roleId)

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.layout_sidebar} ${
          isSidebarOpen && isNotLandlordOrBroker ? styles.sidebar_open : styles.sidebar_closed
        }`}
      >
        <Sidebar handleSidebarClose={handleSidebarClose} />
      </div>

      <div
        className={`${styles.layout_main} ${
          isSidebarOpen && isNotLandlordOrBroker ? styles.main_width_sidebar : styles.main_full_width
        }`}
      >
        <div className={styles.layout_navbar}>
          <Navbar
            isSidebarOpen={isSidebarOpen}
            handleSidebarOpen={handleSidebarOpen}
            isNotLandlordOrBroker={isNotLandlordOrBroker}
          />
        </div>

        <div className={styles.layout_content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
