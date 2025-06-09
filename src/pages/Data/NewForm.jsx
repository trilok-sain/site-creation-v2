import React, { useState, useRef, useEffect } from "react";
import ReusableModal from "../../utilities/ReusableModal/ReusableModal";
import styles from "./ViewDetails.module.css";
import axios from "axios";
import { useApi } from "../../APIConfig/APIContext";
import { IoIosInformationCircle } from "react-icons/io";

const NewForm = ({
  addNewFormModal,
  setAddNewFormModal,
  handleNewFormModalClose,
  fetchData,
}) => {
  const baseUrl = useApi();
  const firstName = sessionStorage.getItem("firstName");
  const [formData, setFormData] = useState({
    stateName: "",
    districtName: "",
    city: "",
    population: "",
    carPassPerHrs: "",
    bikePassPerHrs: "",
    footfallPerHrs: "",
    llRate: "",
    siteType: "",
    marketName: "",
    frontage: "",
    totalArea: "",
    lgf: "",
    ugf: "",
    groundFloor: "",
    firstFloor: "",
    secondFloor: "",
    thirdFloor: "",
    fourthFloor: "",
    fifthFloor: "",
    basementParking: "",
    frontParking: "",
    googleCoordinates: "",
    remarks: "",
    competitorName: "",
    competitorSale: "",
    brokerName: "",
    brokerMNo: "",
    landlordName: "",
    landlordMNo: "",
    roadWidth: "",
    roadCondition: "",
    capexLandlord: "",
    locationPreference: "",
    powerSupply: "",
    lockinPeriod: "",
    deposit: "",
    propertyCeilHeight: "",
    noCompetitors: "",
    roadTraffic: "",
  });
  const [files, setFiles] = useState([]);
  const [showApiError, setShowApiError] = useState(false);
  const [apiError, setApiError] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("landlord");

  const handleInfoModalOpen = () => setInfoModal(true);
  const handleInfoModalClose = () => setInfoModal(false);

  const stateRef = useRef(null);
  const districtRef = useRef(null);
  const cityRef = useRef(null);
  const populationRef = useRef(null);
  const carPassRef = useRef(null);
  const bikePassRef = useRef(null);
  const footfallRef = useRef(null);
  const llRateRef = useRef(null);
  const siteTypeRef = useRef(null);
  const marketNameRef = useRef(null);
  const frontageRef = useRef(null);
  const totalAreaRef = useRef(null);
  const lgfRef = useRef(null);
  const ugfRef = useRef(null);
  const groundFlrRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourthRef = useRef(null);
  const fifthRef = useRef(null);
  const basementRef = useRef(null);
  const frontRef = useRef(null);
  const gcordinatesRef = useRef(null);
  const remarksRef = useRef(null);
  const compNameRef = useRef(null);
  const compSaleRef = useRef(null);
  const bNameRef = useRef(null);
  const bMobileRef = useRef(null);
  const LNameRef = useRef(null);
  const LMobileRef = useRef(null);
  const rWidthRef = useRef(null);
  const rConditionRef = useRef(null);
  const capexRef = useRef(null);
  const preferenceRef = useRef(null);
  const powerRef = useRef(null);
  const lockinRef = useRef(null);
  const depositRef = useRef(null);
  const ceilHeightRef = useRef(null);
  const noCompRef = useRef(null);
  const roadTrafficRef = useRef(null);

  // ***** FUNCTION TO CHANGE STATE OF FORM *****
  const handleFormDataChange = (event) => {
    const id = event.target.id;
    setFormData((prevValues) => ({
      ...prevValues,
      [id]: event.target.value,
    }));
  };

  // ***** FUNCTION TO SET FILES *****
  const handleFileChange = (e) => {
    const fls = Array.from(e.target.files);
    setFiles([...fls]);
  };

  const handleRadioChange = (event) => {
    setRole(event.target.value);
  };

  // ***** FUNCTION TO SUBMIT EDITED DATA *****
  const newSubmit = () => {
    const totalParking =
      parseFloat(frontRef.current.value) +
      parseFloat(basementRef.current.value);

    if (
      isNaN(parseFloat(totalAreaRef.current.value)) ||
      isNaN(parseFloat(groundFlrRef.current.value)) ||
      isNaN(parseFloat(firstRef.current.value)) ||
      isNaN(parseFloat(secondRef.current.value)) ||
      isNaN(parseFloat(thirdRef.current.value)) ||
      isNaN(parseFloat(fourthRef.current.value)) ||
      isNaN(parseFloat(fifthRef.current.value)) ||
      isNaN(parseFloat(llRateRef.current.value)) ||
      (llRateRef.current.value !== "" &&
        isNaN(parseFloat(llRateRef.current.value))) ||
      isNaN(parseFloat(totalParking)) ||
      isNaN(parseFloat(rWidthRef.current.value)) ||
      isNaN(parseFloat(formData.frontage))
    ) {
      // setShowApiError(true);
      // setApiError("Invalid Data");
      alert("Invalid data")
      return false;
    } else if (totalAreaRef.current.value < 9000) {
      // setShowApiError(true);
      // setApiError("Property Total Area should be minimum 9000 sqft.");
      alert("Property Total Area should be minimum 9000 sqft.")
      return false;
    } else if (
      groundFlrRef.current.value < 3000 ||
      firstRef.current.value < 3000 ||
      secondRef.current.value < 3000 ||
      thirdRef.current.value < 3000 ||
      fourthRef.current.value < 3000 ||
      fifthRef.current.value < 3000
    ) {
      // setShowApiError(true);
      // setApiError("Each floor must be greater than equal to 3000 sqft.");
      alert("Each floor must be greater than equal to 3000 sqft.")
      return false;
    } else if (frontageRef.current.value < 35) {
      // setShowApiError(true);
      // setApiError("Frontage must be greater than equal to 35 ft.");
      alert("Frontage must be greater than equal to 35 ft.")
      return false;
    } else if (
      llRateRef.current.value !== "" &&
      llRateRef.current.value > 100
    ) {
      setShowApiError(true);
      // setApiError("LL Rate must be less than equal to 100 psf.");
      alert("Landlord Rate must be less than equal to 100 psf.")
      return false;
    } else if (totalParking < 2000) {
      setShowApiError(true);
      // setApiError(
      //   "Sum of front and basement parking must be greater than equal to 2000 sqft."
      // );
      alert("Sum of front and basement parking must be greater than equal to 2000 sqft.")
      return false;
    } else if (rWidthRef.current.value < 30) {
      setShowApiError(true);
      setApiError("Road width must be greater than equal to 30 ft.");
      alert("Road width must be greater than equal to 30 ft.")
      return false;
    }

    const formData1 = new FormData();
    formData1.append("State", stateRef.current.value);
    formData1.append("District_Name", districtRef.current.value);
    formData1.append("City", cityRef.current.value);
    formData1.append("Population", populationRef.current.value);
    formData1.append("Car_Pass_Per_HRS", carPassRef.current.value);
    formData1.append("Bike_Pass_Per_HRS", bikePassRef.current.value);
    formData1.append("Footfall_Per_HRS", footfallRef.current.value);
    formData1.append("LL_Rate", llRateRef.current.value);
    formData1.append("Site_Type", siteTypeRef.current.value);
    formData1.append("Market", marketNameRef.current.value);
    formData1.append("Frontage", frontageRef.current.value);
    formData1.append("Total_area", totalAreaRef.current.value);
    formData1.append("Lgf", lgfRef.current.value);
    formData1.append("Ugf", ugfRef.current.value);
    formData1.append("Ground_floor", groundFlrRef.current.value);
    formData1.append("First_Floor", firstRef.current.value);
    formData1.append("Second_Floor", secondRef.current.value);
    formData1.append("Third_floor", thirdRef.current.value);
    formData1.append("Forth_Floor", fourthRef.current.value);
    formData1.append("Fifth_Floor", fifthRef.current.value);
    formData1.append("Basement_Parking", basementRef.current.value);
    formData1.append("Front_Parking", frontRef.current.value);
    formData1.append("Google_Coordinates", gcordinatesRef.current.value);
    formData1.append("Competitors", compNameRef.current.value);
    formData1.append("Competitors_Sale", compSaleRef.current.value);
    formData1.append("Remarks", remarksRef.current.value);
    formData1.append("Broker_Name", formData.brokerName || "NA");
    formData1.append("Broker_M_No", formData.brokerMNo || "NA");
    formData1.append("Landlord_Name", formData.landlordName || "NA");
    formData1.append("Landlord_M_No", formData.landlordMNo || "NA");
    formData1.append("Road_width", rWidthRef.current.value);
    formData1.append("Road_Condition", rConditionRef.current.value);
    formData1.append("SiteId", 0);
    formData1.append("ForUpdate", Boolean(false));
    formData1.append("Createdby", sessionStorage.getItem("id"));
    formData1.append("RM_Name", sessionStorage.getItem("id"));
    formData1.append("PropertyCeilingHeight", ceilHeightRef.current.value);
    formData1.append("Competitors3KMRadius", noCompRef.current.value);
    formData1.append("LocationPreference", preferenceRef.current.value);
    formData1.append("LockinPeriod", lockinRef.current.value);
    formData1.append("Deposit", depositRef.current.value);
    formData1.append("CapexFromLandlord", capexRef.current.ref);
    formData1.append("PowerSupply", powerRef.current.value);
    formData1.append("RoadTrafficPerHour", roadTrafficRef.current.value);
//     Object.keys(formData).forEach((key) => {
//       formData1.append(
//         key,
//         formData[key] || "NA" // Use "NA" if the value is null or undefined
//       );
//     });
//     formData1.append("SiteId", 0);
// formData1.append("ForUpdate", Boolean(false));
// formData1.append("Createdby", sessionStorage.getItem("id"));
// formData1.append("RM_Name", sessionStorage.getItem("id"));
    files.forEach((file) => {
      formData1.append("files", file);
    });

    for (let pair of formData1.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    setLoading(true);
    axios
      .post(`${baseUrl}/api/Site/AddSite`, formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        alert(res.data.message);
        // navigate(previousLocation);
        setAddNewFormModal(false);
        // fetchData();
      })
      .catch((err) => {
        setLoading(false);
        setShowApiError(true);
        setApiError(err?.response?.data?.message || err?.message || "Creation Failed!");
        console.error(err);
      });
  };

  // ***** automatically hide api error after 2 seconds *****
  useEffect(() => {
    if (showApiError) {
      const timer = setTimeout(() => setShowApiError(false), 2000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div>
      {/* ***** SHOW ERROR ***** */}
      {showApiError && <div className="api_error">{apiError}</div>}

      {/* ***** MODAL FORM TO ADD SITE ***** */}
      {addNewFormModal && (
        <ReusableModal
          isModalOpen={addNewFormModal}
          handleModalClose={handleNewFormModalClose}
          width="95vw"
          height="95vh"
          title={"Add Site"}
        >
          <>
            <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px"
            }}
            >
              <label>
                <input
                  type="radio"
                  value="landlord"
                  checked={role === "landlord"}
                  onChange={handleRadioChange}
                />
                Landlord
              </label>
              <label>
                <input
                  type="radio"
                  value="broker"
                  checked={role === "broker"}
                  onChange={handleRadioChange}
                />
                Broker
              </label>
            </div>

            <div className={styles.newform_div}>
              <span className={styles.form_info} onClick={handleInfoModalOpen}>
                <IoIosInformationCircle />
              </span>
              <form className={styles.form}>
                {role === "broker" && (
                  <>
                  <div className={styles.form_group}>
                  <label htmlFor="approvedName">Assigned To:</label>
                  <input
                    type="text"
                    id="approvedName"
                    value={firstName || ""}
                    readOnly
                    style={{ cursor: "not-allowed" }}
                  />
                </div>
                
                <div className={styles.form_group}>
                  <label htmlFor="brokerName">Broker Name:</label>
                  <input
                    type="text"
                    id="brokerName"
                    value={formData.brokerName}
                    onChange={handleFormDataChange}
                    ref={bNameRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="brokerMNo">Broker Mobile No:</label>
                  <input
                    type="text"
                    id="brokerMNo"
                    value={formData.brokerMNo}
                    onChange={handleFormDataChange}
                    ref={bMobileRef}
                  />
                </div>
                  </>
                )}

                {role === "landlord" && (
                  <>
                  <div className={styles.form_group}>
                  <label htmlFor="landlordName">Landlord Name:</label>
                  <input
                    type="text"
                    id="landlordName"
                    value={formData.landlordName ? formData.landlordName : "asdlf"}
                    onChange={handleFormDataChange}
                    ref={LNameRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="landlordMNo">Landlord Mobile No:</label>
                  <input
                    type="text"
                    id="landlordMNo"
                    value={formData.landlordMNo ? formData.landlordMNo : "asdf"}
                    onChange={handleFormDataChange}
                    ref={LMobileRef}
                  />
                </div>
                  </>
                )}

                <div className={styles.form_group}>
                  <label htmlFor="capexLandlord">
                    Capex from Landlord (cost):
                  </label>
                  <input
                    type="text"
                    id="capexLandlord"
                    value={formData.capexLandlord ? formData.capexLandlord : 888}
                    onChange={handleFormDataChange}
                    ref={capexRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="stateName">State Name:</label>
                  <input
                    type="text"
                    id="stateName"
                    value={formData.stateName ? formData.stateName : "delhi"}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={stateRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="districtName">District Name:</label>
                  <input
                    type="text"
                    id="districtName"
                    value={formData.districtName ? formData.districtName : "district"}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={districtRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city ? formData.city : "city"}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={cityRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="locationPreference">
                    Location Preference:
                  </label>
                  <select
                    id="locationPreference"
                    value={formData.locationPreference}
                    onChange={handleFormDataChange}
                    ref={preferenceRef}
                  >
                    <option value="none">Select</option>
                    <option value="high-street">High Street</option>
                    <option value="mall">Mall</option>
                    <option value="residential">Residential</option>
                  </select>
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="population">Population:</label>
                  <input
                    type="text"
                    id="population"
                    value={formData.population ? formData.population : 8888}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={populationRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="powerSupply">Power Supply:</label>
                  <select
                    id="powerSupply"
                    value={formData.powerSupply}
                    onChange={handleFormDataChange}
                    ref={powerRef}
                  >
                    <option value="none">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="carPassPerHrs">Car Pass Per Hrs:</label>
                  <input
                    type="text"
                    id="carPassPerHrs"
                    value={formData.carPassPerHrs ? formData.carPassPerHrs : "89798"}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={carPassRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="bikePassPerHrs">Bike Pass Per Hrs:</label>
                  <input
                    type="text"
                    id="bikePassPerHrs"
                    value={formData.bikePassPerHrs ? formData.bikePassPerHrs : "23452345"}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={bikePassRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="footfallPerHrs">Footfall Per Hrs:</label>
                  <input
                    type="text"
                    id="footfallPerHrs"
                    value={formData.footfallPerHrs ? formData.footfallPerHrs : "234543"}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={footfallRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="llRate">Landlord Rate (psf):</label>
                  <input
                    type="text"
                    id="llRate"
                    value={formData.llRate ? formData.llRate : 99}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={llRateRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="lockinPeriod">Lockin Period:</label>
                  <select
                    id="lockinPeriod"
                    value={formData.lockinPeriod}
                    onChange={handleFormDataChange}
                    ref={lockinRef}
                  >
                    <option value="none">Select</option>
                    <option value="no-lockin">No Lockin Period</option>
                    <option value="1">1yr Lockin Period</option>
                    <option value="1.5">18 Months Lockin Period</option>
                  </select>
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="deposit">Deposit:</label>
                  <input
                    type="text"
                    id="deposit"
                    value={formData.deposit ? formData.deposit : 8888}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={depositRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="siteType">Site Type:</label>
                  <select
                    id="siteType"
                    value={formData.siteType}
                    onChange={handleFormDataChange}
                    ref={siteTypeRef}
                  >
                    <option value="none">Select</option>
                    <option value="RTM">RTM</option>
                    <option value="BTS">BTS</option>
                    <option value="S-BTS">S-BTS</option>
                  </select>
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="marketName">Market Name:</label>
                  <input
                    type="text"
                    id="marketName"
                    value={formData.marketName ? formData.marketName : "asfdj"}
                    onChange={handleFormDataChange}
                    ref={marketNameRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="frontage">Frontage (ft):</label>
                  <input
                    type="text"
                    id="frontage"
                    value={formData.frontage ? formData.frontage : 89898}
                    onChange={handleFormDataChange}
                    ref={frontageRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="totalArea">Total Area (sqft):</label>
                  <input
                    type="text"
                    id="totalArea"
                    value={formData.totalArea ? formData.totalArea : 67897}
                    onChange={handleFormDataChange}
                    ref={totalAreaRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="lgf">LGF:</label>
                  <input
                    type="text"
                    id="lgf"
                    value={formData.lgf || "76576"}
                    onChange={handleFormDataChange}
                    ref={lgfRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="ugf">UGF:</label>
                  <input
                    type="text"
                    id="ugf"
                    value={formData.ugf || "GF"}
                    onChange={handleFormDataChange}
                    ref={ugfRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="propertyCeilHeight">
                    Property Ceil Height (ft):
                  </label>
                  <input
                    type="text"
                    id="propertyCeilHeight"
                    value={formData.propertyCeilHeight || 89}
                    onChange={(e) => handleFormDataChange(e)}
                    ref={ceilHeightRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="groundFloor">Ground Floor (sqft):</label>
                  <input
                    type="text"
                    id="groundFloor"
                    value={formData.groundFloor || 8769}
                    onChange={handleFormDataChange}
                    ref={groundFlrRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="firstFloor">First Floor (sqft):</label>
                  <input
                    type="text"
                    id="firstFloor"
                    value={formData.firstFloor || 8769}
                    onChange={handleFormDataChange}
                    ref={firstRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="secondFloor">Second Floor (sqft):</label>
                  <input
                    type="text"
                    id="secondFloor"
                    value={formData.secondFloor || 8769}
                    onChange={handleFormDataChange}
                    ref={secondRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="thirdFloor">Third Floor (sqft):</label>
                  <input
                    type="text"
                    id="thirdFloor"
                    value={formData.thirdFloor || 8769}
                    onChange={handleFormDataChange}
                    ref={thirdRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="fourthFloor">Fourth Floor (sqft):</label>
                  <input
                    type="text"
                    id="fourthFloor"
                    value={formData.fourthFloor || 8769}
                    onChange={handleFormDataChange}
                    ref={fourthRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="fifthFloor">Fifth Floor (sqft):</label>
                  <input
                    type="text"
                    id="fifthFloor"
                    value={formData.fifthFloor || 8769}
                    onChange={handleFormDataChange}
                    ref={fifthRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="basementParking">
                    Basement Parking (sqft):
                  </label>
                  <input
                    type="text"
                    id="basementParking"
                    value={formData.basementParking || 8769}
                    onChange={handleFormDataChange}
                    ref={basementRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="frontParking">Front Parking (sqft):</label>
                  <input
                    type="text"
                    id="frontParking"
                    value={formData.frontParking || 8769}
                    onChange={handleFormDataChange}
                    ref={frontRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="googleCoordinates">Google Coordinates:</label>
                  <input
                    type="text"
                    id="googleCoordinates"
                    value={formData.googleCoordinates || 8769}
                    onChange={handleFormDataChange}
                    ref={gcordinatesRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="remarks">Remarks:</label>
                  <input
                    type="text"
                    id="remarks"
                    value={formData.remarks || 8769}
                    onChange={handleFormDataChange}
                    ref={remarksRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="noCompetitors">
                    No. of Competitors (in 3km):
                  </label>
                  <input
                    type="text"
                    id="noCompetitors"
                    value={formData.noCompetitors || 8769}
                    onChange={handleFormDataChange}
                    ref={noCompRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="competitorName">Competitor Name:</label>
                  <input
                    type="text"
                    id="competitorName"
                    value={formData.competitorName || 8769}
                    onChange={handleFormDataChange}
                    ref={compNameRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="competitorSale">Competitor Sale:</label>
                  <input
                    type="text"
                    id="competitorSale"
                    value={formData.competitorSale || 8769}
                    onChange={handleFormDataChange}
                    ref={compSaleRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="roadWidth">Road Width (ft):</label>
                  <input
                    type="text"
                    id="roadWidth"
                    value={formData.roadWidth || 8769}
                    onChange={handleFormDataChange}
                    ref={rWidthRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="roadCondition">Road Condition:</label>
                  <input
                    type="text"
                    id="roadCondition"
                    value={formData.roadCondition || 8769}
                    onChange={handleFormDataChange}
                    ref={rConditionRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="roadTraffic">Road Traffic:</label>
                  <input
                    type="text"
                    id="roadTraffic"
                    value={formData.roadTraffic || 8769}
                    onChange={handleFormDataChange}
                    ref={roadTrafficRef}
                  />
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="files">Proofs:</label>
                  <input
                    type="file"
                    id="files"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </form>
              <button
                className={styles.newform_submitbtn}
                onClick={newSubmit}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </>
        </ReusableModal>
      )}

      {/* ***** MODAL TO SHOW FORM INFO ***** */}
      {infoModal && (
        <ReusableModal
          isModalOpen={infoModal}
          handleModalClose={handleInfoModalClose}
          title={"Information"}
          width="50vw"
          height="50vh"
        >
          <div className={styles.tc_modal}>
            <div className={styles.tc_modal_div}>
              <ul>
                <li>Property Total Area should be minimum 9000 sqft.</li>
                <li>Floor wise area not less 3000 sqft.</li>
                <li>Frontage must be greater than equal to 35 ft.</li>
                <li>LL Rate must not be greater than 100 psf.</li>
                <li>
                  Sum of front and basement parking must be greater than equal
                  to 2000 sqft.
                </li>
                <li>Road width must be greater than equal to 30 ft.</li>
              </ul>
            </div>
          </div>
        </ReusableModal>
      )}
    </div>
  );
};

export default NewForm;
