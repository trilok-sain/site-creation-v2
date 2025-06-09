import React from "react";
import styles from "../styles/Navbar.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowGoBackFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const Navbar = ({ isSidebarOpen, handleSidebarOpen, isNotLandlordOrBroker }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteId } = useParams();

  const previousLocation = location.state?.from;
  const allDataPath = location.pathname === "/all";
  const pendingDataPath = location.pathname === "/pending";
  const approveDataPath = location.pathname === "/approve";
  const rejectedDataPath = location.pathname === "/rejected";
  const viewDetailsPath = location.pathname === `/view-details/${siteId}`;
  let heading;

  allDataPath
    ? (heading = "TAT REPORT")
    : pendingDataPath
      ? (heading = "TAT REPORT - Pending")
      : approveDataPath
        ? (heading = "TAT REPORT - Approved")
        : rejectedDataPath
          ? (heading = "TAT REPORT - Rejected")
          : "";

  const handleGoBackBtn = () => {
    // if (viewDetailsPath) navigate(previousLocation);
    navigate(previousLocation)
  };

  const handleLogoutBtn = () => {
    navigate("/login", { replace: true });
    sessionStorage.clear("");
  };

  return (
    <nav className={styles.navbar}>
      {!isSidebarOpen && isNotLandlordOrBroker && (
        <div className={styles.hamburger_div}>
          <span
            className={`${styles.hamburger_span} ${styles.nav_btns}`}
            onClick={handleSidebarOpen}
          >
            <RxHamburgerMenu />
          </span>
        </div>
      )}

      <div className={styles.heading}>{heading}</div>

      <div className={styles.menu}>
        {viewDetailsPath && (
          <span className={`${styles.back_span} ${styles.nav_btns}`}>
            <RiArrowGoBackFill onClick={handleGoBackBtn} />
          </span>
        )}
        <span className={`${styles.logout_span} ${styles.nav_btns}`}>
          <BiLogOut onClick={handleLogoutBtn} />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
