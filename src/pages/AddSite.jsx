import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { useApi } from '../APIConfig/APIContext';
import styles from './AddSite.module.css'
import { IoIosInformationCircle } from 'react-icons/io';
import ReusableModal from '../utilities/ReusableModal/ReusableModal';

const AddSite = () => {
    const baseUrl = useApi()
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
    });
    const [files, setFiles] = useState([]);
    const [showApiError, setShowApiError] = useState(false);
    const [apiError, setApiError] = useState("");
    const [infoModal, setInfoModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [optionId, setOptionId] = useState("")
    const [optionsArr, setOptionsArr] = useState([])
    const [selectedRole, setSelectedRole] = useState('landlord');

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
    const bEmailRef = useRef(null);
    const LNameRef = useRef(null);
    const LMobileRef = useRef(null);
    const LEmailRef = useRef(null);
    const rWidthRef = useRef(null);
    const rConditionRef = useRef(null);

    const handleInfoModalOpen = () => setInfoModal(true);
    const handleInfoModalClose = () => setInfoModal(false);

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

    const fetchSelectOptions = async () => {
        await axios.get(`${baseUrl}/api/RMDRPLIST`)
            .then((response) => {
                if (response.status === 200) {
                    setOptionsArr(response?.data?.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const isValid = (value) => {
        if(value === "" || value === null || value === undefined){
            return false;
        }
        return true;
    }

    // ***** FUNCTION TO SUBMIT EDITED DATA *****
    const newSubmit = () => {
        // console.log("frontRef.current.value", optionId);

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
            setShowApiError(true);
            setApiError("Invalid Data");
            return;
        } else if (totalAreaRef.current.value < 9000) {
            setShowApiError(true);
            setApiError("Property Total Area should be minimum 9000 sqft.");
            return false;
        } else if (
            groundFlrRef.current.value < 3000 ||
            firstRef.current.value < 3000 ||
            secondRef.current.value < 3000 ||
            thirdRef.current.value < 3000 ||
            fourthRef.current.value < 3000 ||
            fifthRef.current.value < 3000
        ) {
            setShowApiError(true);
            setApiError("Each floor must be greater than equal to 3000 sqft.");
            return false;
        } else if (frontageRef.current.value < 35) {
            setShowApiError(true);
            setApiError("Frontage must be greater than equal to 35 ft.");
            return false;
        } else if (
            llRateRef.current.value !== "" &&
            llRateRef.current.value > 100
        ) {
            setShowApiError(true);
            setApiError("LL Rate must be less than equal to 100 psf.");
            return false;
        } else if (totalParking < 2000) {
            setShowApiError(true);
            setApiError(
                "Sum of front and basement parking must be greater than equal to 2000 sqft."
            );
            return false;
        } else if (rWidthRef.current.value < 30) {
            setShowApiError(true);
            setApiError("Road width must be greater than equal to 30 ft.");
            return false;
        } else {
            setShowApiError(false);
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
        formData1.append("Broker_Name", isValid(bNameRef.current?.value) ? bNameRef.current?.value : "NA");
        formData1.append("Broker_M_No", isValid(bMobileRef.current?.value) ? bMobileRef.current?.value : "NA");
        formData1.append("Broker_Email", isValid(bEmailRef.current?.value) ? bEmailRef.current?.value : "NA");
        formData1.append("Landlord_Name", isValid(LNameRef.current?.value) ? LNameRef.current?.value : "NA");
        formData1.append("Landlord_M_No", isValid(LMobileRef.current?.value) ? LMobileRef.current?.value : "NA");
        formData1.append("Landlord_Email", isValid(LEmailRef.current?.value) ? LEmailRef.current?.value : "NA");
        formData1.append("Road_width", rWidthRef.current.value);
        formData1.append("Road_Condition", rConditionRef.current.value);
        formData1.append("SiteId", 0);
        formData1.append("ForUpdate", Boolean(false));
        formData1.append("Createdby", "na");
        formData1.append("RM_Name", optionId || "");
        files.forEach((file) => {
            formData1.append("files", file);
        });

        // for (let pair of formData1.entries()) {
        //     console.log(`${pair[0]}: ${pair[1]}`);
        // }

        setLoading(true);
        axios
            .post(`${baseUrl}/api/Site/AddSite`, formData1, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                setLoading(false);
                // console.log(res);
                alert(res.data.message);
                setFormData({
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
                })
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

    useEffect(() => {
        fetchSelectOptions()
    }, [])

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };
    // console.log("selectedRole", selectedRole)

    return (
        <div className={styles.container}>
            {/* ***** SHOW ERROR ***** */}
            {showApiError && <div className="api_error">{apiError}</div>}
            <img className={styles.logo_img} src="v2logo2.jpg" alt="" />
            <h1>New Site Requisition Form</h1>

            <div className={styles.role_div}>
                <div className={styles.role_group}>
                    <label htmlFor="landlord">Landlord</label>
                    <input
                        type="radio"
                        value="landlord"
                        checked={selectedRole === 'landlord'}
                        onChange={handleRoleChange}
                        id='landlord'
                    />
                </div>

                <div className={styles.role_group}>
                    <label htmlFor="broker">Broker</label>
                    <input
                        type="radio"
                        value="broker"
                        checked={selectedRole === 'broker'}
                        onChange={handleRoleChange}
                        id='broker'
                    />
                </div>
            </div>

            <div className={styles.newform_div}>
                <span className={styles.form_info} onClick={handleInfoModalOpen}>
                    <IoIosInformationCircle />
                </span>
                <form className={styles.form}>
                    {selectedRole === "broker" && (
                        <>
                        <div className={styles.form_group}>
                        <label htmlFor="approvedName">Assigned To:</label>
                        <select value={optionId} onChange={e => setOptionId(e.target.value)}>
                            <option value="none">Select</option>
                            {optionsArr.map((item, index) => {
                                return (
                                    <option value={item?.id} key={index}>{item?.firstname}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="brokerName">Broker Name:</label>
                        <input
                            type="text"
                            id="brokerName"
                            value={formData.brokerName || ""}
                            onChange={handleFormDataChange}
                            ref={bNameRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="brokerMNo">Broker Mobile No:</label>
                        <input
                            type="text"
                            id="brokerMNo"
                            value={formData.brokerMNo || ""}
                            onChange={handleFormDataChange}
                            ref={bMobileRef}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="brokerEmail">Broker Email:</label>
                        <input
                            type="text"
                            id="brokerEmail"
                            value={formData.brokerEmail || ""}
                            onChange={handleFormDataChange}
                            ref={bEmailRef}
                        />
                    </div>
                        </>
                    )}

                    {selectedRole === "landlord" && (
                        <>
                        <div className={styles.form_group}>
                        <label htmlFor="landlordName">Landlord Name:</label>
                        <input
                            type="text"
                            id="landlordName"
                            value={formData.landlordName || ""}
                            onChange={handleFormDataChange}
                            ref={LNameRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="landlordMNo">Landlord Mobile No:</label>
                        <input
                            type="text"
                            id="landlordMNo"
                            value={formData.landlordMNo || ""}
                            onChange={handleFormDataChange}
                            ref={LMobileRef}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="landlordEmail">Landlord Email:</label>
                        <input
                            type="text"
                            id="landlordEmail"
                            value={formData.landlordEmail || ""}
                            onChange={handleFormDataChange}
                            ref={LEmailRef}
                        />
                    </div>
                        </>
                    )}

                    <div className={styles.form_group}>
                        <label htmlFor="stateName">State Name:</label>
                        <input
                            type="text"
                            id="stateName"
                            value={formData.stateName}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={stateRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="districtName">District Name:</label>
                        <input
                            type="text"
                            id="districtName"
                            value={formData.districtName}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={districtRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={cityRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="population">Population:</label>
                        <input
                            type="text"
                            id="population"
                            value={formData.population}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={populationRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="carPassPerHrs">Car Pass Per Hrs:</label>
                        <input
                            type="text"
                            id="carPassPerHrs"
                            value={formData.carPassPerHrs}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={carPassRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="bikePassPerHrs">Bike Pass Per Hrs:</label>
                        <input
                            type="text"
                            id="bikePassPerHrs"
                            value={formData.bikePassPerHrs}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={bikePassRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="footfallPerHrs">Footfall Per Hrs:</label>
                        <input
                            type="text"
                            id="footfallPerHrs"
                            value={formData.footfallPerHrs}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={footfallRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="llRate">LL Rate (psf)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="llRate"
                            value={formData.llRate}
                            onChange={(e) => handleFormDataChange(e)}
                            ref={llRateRef}
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
                            value={formData.marketName}
                            onChange={handleFormDataChange}
                            ref={marketNameRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="frontage">Frontage (ft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="frontage"
                            value={formData.frontage}
                            onChange={handleFormDataChange}
                            ref={frontageRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="totalArea">Total Area (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="totalArea"
                            value={formData.totalArea}
                            onChange={handleFormDataChange}
                            ref={totalAreaRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="lgf">LGF:</label>
                        <input
                            type="text"
                            id="lgf"
                            value={formData.lgf}
                            onChange={handleFormDataChange}
                            ref={lgfRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="ugf">UGF:</label>
                        <input
                            type="text"
                            id="ugf"
                            value={formData.ugf}
                            onChange={handleFormDataChange}
                            ref={ugfRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="groundFloor">Ground Floor (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="groundFloor"
                            value={formData.groundFloor}
                            onChange={handleFormDataChange}
                            ref={groundFlrRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="firstFloor">First Floor (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="firstFloor"
                            value={formData.firstFloor}
                            onChange={handleFormDataChange}
                            ref={firstRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="secondFloor">Second Floor (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="secondFloor"
                            value={formData.secondFloor}
                            onChange={handleFormDataChange}
                            ref={secondRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="thirdFloor">Third Floor (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="thirdFloor"
                            value={formData.thirdFloor}
                            onChange={handleFormDataChange}
                            ref={thirdRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="fourthFloor">Fourth Floor (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="fourthFloor"
                            value={formData.fourthFloor}
                            onChange={handleFormDataChange}
                            ref={fourthRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="fifthFloor">Fifth Floor (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="fifthFloor"
                            value={formData.fifthFloor}
                            onChange={handleFormDataChange}
                            ref={fifthRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="basementParking">
                            Basement Parking (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="basementParking"
                            value={formData.basementParking}
                            onChange={handleFormDataChange}
                            ref={basementRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="frontParking">Front Parking (sqft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="frontParking"
                            value={formData.frontParking}
                            onChange={handleFormDataChange}
                            ref={frontRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="googleCoordinates">Google Coordinates:</label>
                        <input
                            type="text"
                            id="googleCoordinates"
                            value={formData.googleCoordinates}
                            onChange={handleFormDataChange}
                            ref={gcordinatesRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="remarks">Remarks:</label>
                        <input
                            type="text"
                            id="remarks"
                            value={formData.remarks}
                            onChange={handleFormDataChange}
                            ref={remarksRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="competitorName">Competitor Name:</label>
                        <input
                            type="text"
                            id="competitorName"
                            value={formData.competitorName}
                            onChange={handleFormDataChange}
                            ref={compNameRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="competitorSale">Competitor Sale:</label>
                        <input
                            type="text"
                            id="competitorSale"
                            value={formData.competitorSale}
                            onChange={handleFormDataChange}
                            ref={compSaleRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="roadWidth">Road Width (ft)
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="roadWidth"
                            value={formData.roadWidth}
                            onChange={handleFormDataChange}
                            ref={rWidthRef}
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="roadCondition">Road Condition:</label>
                        <input
                            type="text"
                            id="roadCondition"
                            value={formData.roadCondition}
                            onChange={handleFormDataChange}
                            ref={rConditionRef}
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
    )
}

export default AddSite