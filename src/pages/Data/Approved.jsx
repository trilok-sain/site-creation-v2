import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Data.module.css";
import { MdCancel } from "react-icons/md";
import { useApi } from "../../APIConfig/APIContext";
import Loader from "../../utilities/Loader";
import axios from "axios";
import isNullOrEmpty from "../../utilities/checkValue";
import formattedDate from "../../utilities/formattedDate";
import formattedTime from "../../utilities/formattedTime";
import { FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useLocation, useNavigate } from "react-router-dom";
import NewForm from "./NewForm";
import NewForm2 from "./NewForm2";
import subtractDates from "../../utilities/subtractDates";
import ReusableModal from "../../utilities/ReusableModal/ReusableModal";
import NewAddSite from "../NewAddSite";
import { allowIds } from "../../utilities/constants";

const Approved = () => {
  const baseUrl = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsDataArr, setOptionsDataArr] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState();
   const emailid = sessionStorage.getItem("emailid");
  const roleId = sessionStorage.getItem("roleId");
  const id = sessionStorage.getItem("id");
  const [addNewFormModal, setAddNewFormModal] = useState(false);
  const searchRef = useRef(null);
  const searchVal = sessionStorage.getItem("searchValAppr");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const date = new Date();
  const isoString = date.toISOString();
  const todayDate = formattedDate(isoString);

  // ***** MODAL UPDATE FUNCTION *****
  const handleNewFormModalOpen = () => setAddNewFormModal(true);
  const handleNewFormModalClose = () => setAddNewFormModal(false);

  const headings = [
    "s no.",
    allowIds.includes(roleId) && "rm name",
    "state",
    "district",
    "city",
    "rank",
    "frontage",
    "ll rate",
    "total area",
    "parking",
     "broker name",
    "created on",
    "aging (days)",
    "action",
  ].filter(Boolean);
  const subHeadings = ["basement parking", "front parking", "status", "view"];

  // function to fetch site creation data
  const fetchData = async () => {
    setLoading(true);

    await axios
      .get(
        `${baseUrl}/api/BrokerSiteCreation/GetSiteDataNew?roleId=${parseInt(
          roleId
        )}&userId=${parseInt(id)}&username=${emailid}`
      )
      .then((response) => {
        // console.log("api data:", response)

        if (response.status === 200) {
          setLoading(false);
          setTableData(response?.data?.data);
          setSelectedOptionId(
            Array(
              response?.data?.data.filter((row) => {
                return row?.status === "PENDING";
              })
            ).length
          ).fill("none");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("api err:", err);
      });
  };

  // function to post selected status to assign to user
  const fetchRoutingStatusList = async (e, siteID) => {
    await axios.post(
      `${baseUrl}/api/UpdateRMName/Update_Assignedto?siteid=${siteID}&Assigned_ID=${e.target.value}`
    );
  };

  // function to fetch select options
  const fetchSelectOptions = () => {
    axios
      .get(`${baseUrl}/api/RMDRPLIST`)
      .then((response) => {
        let html = `<option value = "none">Select</option>`;
        const options = response?.data?.data;
        let tempArr = [];

        if (options && options.length > 0) {
          options.forEach((option) => {
            html += `<option value="${option.id}" class="options" v-id="${option.id}">${option.firstname}</option>`;
            tempArr.push([option.id, option.firstname]);
          });
        }
        setOptionsDataArr(tempArr);
      })
      .catch((err) => {
        if (err && err.respoonse && err.response.data.Message) {
          console.log(err.response.data.Message);
        }
      });
  };

  useEffect(() => {
    const data = tableData.filter((row) => {
      // if (roleId == 1 || roleId == 3 || roleId == 4 || roleId == 5) {
        return (
          row.status?.includes("APPROVED") ||
          row.adminStatus?.includes("APPROVED")
          // row?.superAdminStatus?.includes("APPROVED")
        );
      // } else if (roleId == 2) {
      //   return row?.status?.includes("APPROVED");
      // } 
    });

    setApprovedData([...data]);
  }, [tableData]);

  // filter rejected data from tableData
  useEffect(() => {
    // filter data based on search and into a variable
    let data = approvedData.filter((row) => {
      const searchString = search.toLowerCase();
      const matchedOption = optionsDataArr.find(
        (option) => option[0].toString() === row?.rM_Name
      );
      const optionName = matchedOption ? matchedOption[1]?.toLowerCase() : "";

      return (
        row?.rM_Name?.toLowerCase()?.includes(searchString) ||
        row?.rank?.toLowerCase()?.includes(searchString) ||
        optionName?.toLowerCase()?.includes(searchString) ||
        row?.broker_Name?.toLowerCase()?.includes(searchString) ||
        row?.createdOn?.toLowerCase()?.includes(searchString) ||
        row?.state?.toLowerCase()?.includes(searchString) ||
        row?.district_Name?.toLowerCase()?.includes(searchString) ||
        row?.city?.toLowerCase()?.includes(searchString) ||
        row?.lL_Rate?.toLowerCase()?.includes(searchString) ||
        row?.frontage?.toLowerCase()?.includes(searchString) ||
        row?.total_area?.toString()?.toLowerCase()?.includes(searchString) ||
        row?.basement_Parking
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchString) ||
        row?.front_Parking?.toString()?.toLowerCase()?.includes(searchString) ||
        row?.status?.toLowerCase()?.includes(searchString)
      );
    });

    setFilteredData([...data]);
  }, [search, approvedData]);

  // function to export data
  const handleExportData = () => {
    exportData;
    // console.log("expdta", exportData)

    if (exportData.length > 0) {
      const headers = [
        "S No", //1
        "REC DATE", //2
        "AGING", //3
        "RM NAME", //4
        "ZONE",
        "STATE", //5
        "DISTRICT NAME", //6
        "CITY", //7
        "DISTRICT/CITY POPULATION",
        "MARKET NAME",
        "STATUS", //8
        "CAR PASS PER HRS", //9
        "BIKE PASS PER HRS", //10
        "RANK", //17
        "SITE TYPE", //12
        "LL RATE", //13
        "V2 RATE", //14
        "FRONTAGE", //15
        "CEILING", //16
        "TOTAL AREA", //18
        "BASEMENT PARKING", //19
        "FRONT PARKING", //20
        "UGF", //21
        "LGF", //22
        "GROUND FLOOR", //23
        "FIRST FLOOR", //24
        "SECOND FLOOR", //25
        "THIRD FLOOR", //26
        "FOURTH FLOOR", //27
        "FIFTH FLOOR", //28
        "GOOGLE COORDINATES", //29
        "REMARKS", //30
        "COMPETITOR SALE", //31
        "ACTION PERFORMED BY", //11
        "ACTION PERFORMED ON",
        "ADDRESS",
        "PROCESS AGING",
        "UPDATED BY",
        "UPDATED ON",
        "ADMIN APPROVED BY",
        "ADMIN APPROVED ON",
        "SUPERADMIN APPROVED BY",
        "SUPERADMIN APPROVED ON",
        "BROKER NAME",
        "BROKER MOBILE NO",
         'BROKER EMAIL',
        "LANDLORD NAME",
        "LANDLORD MOBILE NO",
        "LANDLORD EMAIL"
      ];

      const rowData = exportData.map((row, index) => [
        `${index + 1}`,
        formattedDate(row?.createdOn),
        subtractDates(todayDate, row?.createdOn),
        row?.rmByName || "",
        row.zone || "",
        row?.state || "",
        row?.district_Name || "",
        row?.city || "",
        row.population || "",
        row.market || "",
        row?.status,
        row?.car_Pass_Per_HRS || "",
        row?.bike_Pass_Per_HRS || "",
        row?.rank || "",
        row?.site_Type || "",
        row?.lL_Rate || "",
        row?.v2_Rate || "",
        row?.frontage || "",
        row?.propertyCeilingHeight || "",
        row?.total_area || "",
        row?.basement_Parking || "",
        row?.front_Parking || "",
        row?.ugf || "",
        row?.lgf || "",
        row?.ground_floor || "",
        row?.first_Floor || "",
        row?.second_Floor || "",
        row?.third_floor || "",
        row?.forth_Floor || "",
        row?.fifth_Floor || "",
        row?.google_Coordinates || "",
        row?.remarks || "",
        row?.competitors_Sale || "",
        row?.actionperformedby || "",
        row?.actionperformedon || "",
        row.address || "",
        row?.process_ageing || "",
        row?.updatedBy || "",
        row?.updatedOn || "",
        row?.adminActionPerformedBy || "",
        row?.adminActionPerformedOn || "",
        row?.superAdminActionPerformedBy || "",
        row?.superAdminActionPerformedOn || "",
        row?.broker_Name || "",
        row?.broker_M_No || "",
        row?.broker_Email || "",
        row?.landlord_Name || "",
        row?.landlord_M_No || "",
        row?.landlord_Email || "",
      ]);

      const exportDataFormatted = [headers, ...rowData];

      const worksheet = XLSX.utils.aoa_to_sheet(exportDataFormatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(
        workbook,
        `Export_Approved_Sites_${new Date().toISOString()}.xlsx`
      );
    } else {
      alert("No data to export");
    }
  };

  // function to go to view details page
  const dataViewHandler = (row, assignedName) => {
    navigate(`/view-details/${row?.siteID}`, {
      state: { from: location.pathname, rowData: row, name: assignedName },
    });
  };

  useEffect(() => {
    fetchSelectOptions();
    fetchData();
  }, []);

  useEffect(() => {
    const approvedData = tableData.filter((row) => {
      if (roleId == 1) {
        return (
          row.status?.includes("APPROVED") ||
          row.adminStatus?.includes("APPROVED") ||
          row?.superAdminStatus?.includes("APPROVED")
        );
      } else if (roleId == 2) {
        return row?.status?.includes("APPROVED");
      } else if (roleId == 3) {
        return (
          row.status?.includes("APPROVED") ||
          row.adminStatus?.includes("APPROVED") ||
          row?.superAdminStatus?.includes("APPROVED")
        );
      }
    });
    setExportData(approvedData);
  }, [approvedData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (search) {
          sessionStorage.setItem("searchValAppr", search);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [search]);

  useEffect(() => {
    if (searchVal !== "" && searchVal !== undefined && searchVal !== null) {
      setSearch(searchVal);
    }
  }, [searchVal]);

  const handleFilterTable = () => {
    if (fromDate && toDate) {
      const filtered = approvedData.filter((item) => {
        return (
          fromDate &&
          toDate &&
          fromDate <= item?.createdOn &&
          toDate >= item?.createdOn
        );
      });
      setFilteredData(filtered);
      console.log("filtered", filtered);
    } else {
      alert("From and To Date are mandatory to filter!");
    }
  };

  return (
    <div className={styles.container}>
      {/* show loader */}
      {loading && <Loader />}

      {/* search div */}
      <div className={styles.search_div}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.search_input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          ref={searchRef}
        />
        {search && (
          <MdCancel
            className={styles.search_cancel}
            onClick={() => setSearch("")}
          />
        )}
      </div>

      {/* table data div */}
      <div className={styles.table_data_div}>
        {/* buttons and details */}
        <div className={styles.table_btns_div}>
          <span
            style={{
              display: "flex",
              gap: "7px",
              alignItems: "center",
              order: 2,
            }}
          >
            <span
              className={styles.table_btns}
              onClick={handleExportData}
              style={{ order: 1 }}
            >
              Export Data
            </span>

            <span
              className={styles.table_btns}
              onClick={handleNewFormModalOpen}
              style={{ order: 2 }}
            >
              Add New
            </span>
          </span>

          <span
            style={{
              display: "flex",
              gap: "7px",
              alignItems: "center",
              order: 1,
            }}
          >
            <span className={styles.table_data_info}>
              <b>Total Data:</b> {filteredData.length}
            </span>

            <span style={{ fontSize: "1rem", order: 3 }}>
              <b>User:-</b> {sessionStorage.getItem("firstName")}
            </span>
          </span>
          <span className={styles.filter_data} style={{ order: 4 }}>
            <b>Select date:</b>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <span className={styles.table_btns} onClick={handleFilterTable}>
              Filter
            </span>
          </span>
        </div>

        {/* table div */}
        <div className={styles.table_div}>
          {/* table */}
          <table className={styles.table}>
            <thead>
              <tr>
                {headings.map((heading, index) => {
                  if (heading === "parking" || heading === "action") {
                    return (
                      <th colSpan={2} key={index}>
                        {heading}
                      </th>
                    );
                  } else {
                    return (
                      <th rowSpan={2} key={index}>
                        {heading}
                      </th>
                    );
                  }
                })}
              </tr>
              <tr>
                {subHeadings.map((subhead, subindex) => {
                  return <th key={`sub-${subindex}`}>{subhead}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {allowIds.includes(roleId) && (
                      <td>
                        {row?.status === "PENDING" ? (
                          <select
                            onChange={(e) =>
                              fetchRoutingStatusList(e, row?.siteID)
                            }
                          >
                            <option value="none">Select</option>
                            {optionsDataArr.map((option, index) => {
                              return (
                                <option
                                  value={option[0]}
                                  key={index}
                                  selected={
                                    parseInt(row?.rM_Name) === option[0]
                                      ? true
                                      : false
                                  }
                                >
                                  {option[1]}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <select disabled>
                            <option value="none">Select</option>
                            {optionsDataArr.map((option, index) => {
                              return (
                                <option
                                  key={index}
                                  selected={
                                    parseInt(row?.rM_Name) === option[0]
                                      ? true
                                      : false
                                  }
                                >
                                  {option[1]}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </td>
                       )}
                      
                        <td>{isNullOrEmpty(row?.state) ? null : row?.state}</td>
                        <td>
                          {isNullOrEmpty(row?.district_Name)
                            ? null
                            : row?.district_Name}
                        </td>
                        <td>{isNullOrEmpty(row?.city) ? null : row?.city}</td>

                      <td>{isNullOrEmpty(row?.rank) ? null : row?.rank}</td>
                      
                      <td>
                        {isNullOrEmpty(row?.lL_Rate) ? null : row?.lL_Rate}
                      </td>
                      <td>
                        {isNullOrEmpty(row?.frontage) ? null : row?.frontage}
                      </td>
                      <td>
                        {isNullOrEmpty(row?.total_area)
                          ? null
                          : row?.total_area}
                      </td>

                      <td>
                        {isNullOrEmpty(row?.basement_Parking)
                          ? null
                          : row?.basement_Parking}
                      </td>
                      <td>
                        {isNullOrEmpty(row?.front_Parking)
                          ? null
                          : row?.front_Parking}
                      </td>
                      
                      <td>
                        {isNullOrEmpty(row?.rank) ? null : row?.broker_Name}
                      </td>
                      <td>
                        {isNullOrEmpty(row?.createdOn)
                          ? null
                          : formattedDate(row?.createdOn)}
                      </td>
                      <td>
                        {row?.createdOn === null &&
                        row?.superAdminActionPerformedOn === null
                          ? ""
                          : row?.superAdminActionPerformedOn === null
                          ? subtractDates(todayDate, row?.createdOn)
                          : subtractDates(
                              row?.superAdminActionPerformedOn,
                              row?.createdOn
                            )}
                      </td>
                      
                      <td
                        style={{
                          color:
                            row?.status === "APPROVED" ||
                            row?.adminStatus === "APPROVED" ||
                            row?.superAdminStatus === "APPROVED"
                              ? "green"
                              : row?.status === "REJECTED" ||
                                row?.adminStatus === "REJECTED" ||
                                row?.superAdminStatus === "REJECTED"
                              ? "red"
                              : row?.status === "PENDING" ||
                                row?.adminStatus === "PENDING" ||
                                row?.superAdminStatus === "PENDING"
                              ? "#ffc107"
                              : "",
                        }}
                      >
                        {isNullOrEmpty(row?.status) ? null : row?.status}
                      </td>
                      <td>
                        <FaEye
                          cursor={"pointer"}
                          onClick={() =>
                            dataViewHandler(row, selectedOptionId[index])
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={headings.length}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* {addNewFormModal && (
        <ReusableModal
          isModalOpen={addNewFormModal}
          handleModalClose={handleNewFormModalClose}
          width="95vw"
          height="95vh"
        >

          <NewAddSite customStyle={{ height: "calc(100vh - 11rem)" }} />
        </ReusableModal>)} */}
      {/* ***** FORM TO ADD NEW SITE ***** */}
      <NewForm2
        addNewFormModal={addNewFormModal}
        setAddNewFormModal={setAddNewFormModal}
        handleNewFormModalClose={handleNewFormModalClose}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Approved;
