import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Sidebar.module.css";
import { FiChevronLeft } from "react-icons/fi";
import { CiBoxList } from "react-icons/ci";
import { MdOutlinePending } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdSmsFailed } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { roleIds } from "../utilities/constants";

const Sidebar = ({ handleSidebarClose }) => {
  const roleId = sessionStorage.getItem("roleId")
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    {label: "All", icon: <CiBoxList/>, url: "/all", roles: [...Object.values(roleIds)]},
    {label: "Appr/Pend List", icon: <FaRegListAlt/>, url: "/approval-list", roles: []},
    {label: "Pending", icon: <MdOutlinePending/>, url: "/pending", roles: [
      roleIds.SUPER_ADMIN, roleIds.ADMIN, roleIds.LEGAL, roleIds.RM
    ]},
    {label: "Pen Admin", icon: <MdOutlinePending/>, url: "/penAdmList", roles: [
      roleIds.SUPER_ADMIN, roleIds.ADMIN, roleIds.RM
    ]},
    {label: "Pending Legal", icon: <MdOutlinePending/>, url: "/pendinglegal", roles: [
      roleIds.SUPER_ADMIN, roleIds.ADMIN, roleIds.LEGAL, roleIds.RM
    ]},
    {label: "Rejected", icon: <MdSmsFailed/>, url: "/rejected", roles: [
      roleIds.SUPER_ADMIN, roleIds.ADMIN, roleIds.LEGAL, roleIds.RM
    ]},
    {label: "Approved", icon: <IoCheckmarkDone/>, url: "/approve", roles: [
      roleIds.SUPER_ADMIN, roleIds.ADMIN, roleIds.LEGAL, roleIds.RM
    ]},
  ]

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_close_btn_div}>
        <span className={styles.sidebar_close_btn} onClick={handleSidebarClose}><FiChevronLeft/></span>
      </div>

      <div className={styles.sidebar_tab_list}>
        {tabs.map((tab, index) => {
        const isActive = location.pathname === tab.url
          if(tab.roles.includes(roleId)){
            return (
              <div
              key={index}
              className={`${styles.sidebar_tabs} ${isActive ? styles.sidebar_activeTab : ""}`}
              onClick={() => navigate(tab.url)}
              >
                <span className={styles.sidebar_tab_icon}>{tab.icon}</span>
                <span className={styles.sidebar_tab}>{tab.label}</span>
              </div>
            );
          }

        })}
      </div>
    </div>
  );
};

export default Sidebar;
