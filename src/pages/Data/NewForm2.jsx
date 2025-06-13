import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoIosInformationCircle } from "react-icons/io";
import { useApi } from "../../APIConfig/APIContext";
import ReusableModal from "../../utilities/ReusableModal/ReusableModal";
import styles from "./ViewDetails.module.css";
import { toast } from "react-toastify";
import Select from "react-select";
import { FaFileImage } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FilesCarousel from "../../components/FilesCarousel";
import { FaFile } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import FilesCarouselPublic from "../../components/FilesCarouselPublic";
import { roleIds } from "../../utilities/constants";

const NewForm2 = ({
  addNewFormModal,
  setAddNewFormModal,
  handleNewFormModalClose,
  fetchData,
}) => {
  const baseUrl = useApi();
  const [currentPage, setCurrentPage] = useState(1);
  const firstName = sessionStorage.getItem("firstName");
  const id = sessionStorage.getItem("id");
  const loginUserEmail = sessionStorage.getItem("emailid");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [address, setAddress] = useState({ state: "", city: "", district: "" });
  const [optionsArr, setOptionsArr] = useState([]);
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
    Broker_Email: "",
    Landlord_Email: ""
  });
  const [files, setFiles] = useState([]);
  const [showApiError, setShowApiError] = useState(false);
  const [apiError, setApiError] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const roleId = sessionStorage.getItem("roleId");
  const [suggestions, setSuggestions] = useState([]);
  const [stateNamesList, setStateNamesList] = useState([]);
  const isReadOnly = ["4", "5"].includes(roleId);
  const isLandlord = roleId == roleIds.LANDLORD;
  const isBroker = roleId == roleIds.BROKER
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
    setValue,
    getValues,
    control,
    watch,
  } = useForm({
    defaultValues: {
      brokerEmail: isBroker ? loginUserEmail : "",
      landlordEmail: isLandlord ? loginUserEmail : "",
      roleType: isLandlord ? "landlord" : "broker",
      brokerName: isBroker ? firstName : "",
      landlordName: isLandlord ? firstName : ""
    }
  });
  let siteType = watch("siteType");

  const roleType = watch("roleType");

  const [proofFiles, setProofFiles] = useState({
    buildingFrontFile: [],
    buildingOppositeFile: [],
    buildingLeftFile: [],
    buildingRightFile: [],
    competitorFile: [],
    roofTopFile: [],
    marketFile: [],
    floorWise: [],
    // groundFloorFile: [],
    // firstFloorFile: [],
    // secondFloorFile: [],
    // thirdFloorFile: [],
    // fourthFloorFile: [],
    // fifthFloorFile: [],
  });
  const [showProofFiles, setShowProofFiles] = useState([]);
  const [isShowProofFilesClicked, setIsShowProofFilesClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [isAccordionOpen, setIsAccordionOpen] = useState({});
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [currentSampleFiles, setCurrentSampleFiles] = useState([]);
  // const [roleType, setRoleType] = useState(roleId === "4" ? "broker" : roleId === "5" ? "landlord" : "");

  const proofsList = [
    {
      label: "Building Front",
      labelId: "buildingFrontFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Building Opposite",
      labelId: "buildingOppositeFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Building Left",
      labelId: "buildingLeftFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Building Right",
      labelId: "buildingRightFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Competitor",
      labelId: "competitorFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Roof Top",
      labelId: "roofTopFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Market",
      labelId: "marketFile",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },

    {
      label: "Floor Wise",
      labelId: "floorWise",
      icon: <FaFileImage color="#29c071" />,
      required: true,
    },
  ];

  const sampleFiles = [
    {
      label: "Building Front",
      path: [""],
    },
    {
      label: "Building Opposite",
      path: [""],
    },
    {
      label: "Building Left",
      path: ["/leftView.jfif"],
    },
    {
      label: "Building Right",
      path: ["/rightView.jfif"],
    },
    {
      label: "Competitor",
      path: [
        "/competitorFile1.mp4",
        "/competitorFile2.jfif",
        "/competitorFile3.jfif",
        "/competitorFile4.jfif",
      ],
    },
    {
      label: "Roof Top",
      path: ["/roofTop.mp4"],
    },
    {
      label: "Market",
      path: ["/market.mp4"],
    },
    {
      label: "Floor Wise",
      path: [
        "/floorSample1.jfif",
        "/floorSample2.jfif",
        "/floorSample3.jfif",
        "/floorSample4.jfif",
        "/floorSample5.jfif",
      ],
    },
  ];

  const updatedSampleFiles = sampleFiles.map((file) => ({
    ...file,
    isSampleFileAvailable: file.path.some((p) => p !== ""),
  }));

  const handleSampleModalOpen = (label) => {
    const files = sampleFiles.filter((file) => file.label === label);
    // console.log("selected files", files);
    setCurrentSampleFiles(files);
    setIsSampleModalOpen(true);
  };

  const toggleAccordion = (id) => {
    setIsAccordionOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteFileAccordion = (e, type, idx) => {
    const data = proofFiles[type].filter((file, i) => i !== idx);

    setProofFiles((prev) => ({
      ...prev,
      [type]: [...data],
    }));
  };

  const handleProofsInputChange = (e) => {
    const files = e.target.files;
    const id = e.target.id;

    if (files) {
      setProofFiles((prev) => ({
        ...prev,
        [id]: [...Array.from(files)],
      }));
    }

    setIsAccordionOpen((prev) => ({
      ...prev,
      [id]: files.length > 0, // True if files exist
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    return window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      await axios
        .get(`${baseUrl}/api/RMDRPLIST`)
        .then((response) => {
          if (response.status === 200) {
            setOptionsArr(response?.data?.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchSelectOptions();
  }, []);




  const openFileInScreen = (e, labelId, url, idx) => {
    // const files = Object.values(proofFiles).flat();
    // setShowProofFiles([...files]);

    // if (showProofFiles.length > 0) setIsShowProofFilesClicked(true);

    const allFiles = Object.values(proofFiles).flat();
    const clickedFile = proofFiles[labelId][idx];
    const reorderedFiles = [
      clickedFile,
      ...allFiles.filter((file) => file !== clickedFile),
    ];
    setShowProofFiles(reorderedFiles);

    if (showProofFiles.length > 0) setIsShowProofFilesClicked(true);
  };

  const getStatesListApi = async () => {
    await axios
      .get(`${baseUrl}/api/Site/GetState`)
      .then((response) => {
        if (response.status === 200) {
          setStateNamesList(response.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStatesListApi();
  }, []);

  const stateOptions = stateNamesList.map((state) => ({
    label: state?.stateName,
    value: state?.stateName,
  }));

  const handleDistrictChange = async (e) => {
    const value = e.target.value;
    setValue("districtName", value);

    if (value.length >= 2) {
      await axios
        .post(`${baseUrl}/api/site/GetDistrict?param=${value}`)
        .then((res) => {
          if (res.status === 200) {
            console.log("res", res);
            const data = res?.data?.data || [];
            if (data.length > 0) {
              const filteredSuggestions = data.filter((district) =>
                district?.districtName
                  .toLowerCase()
                  .includes(value.toLowerCase())
              );
              // Set suggestions only if there are matches; otherwise, clear them
              if (filteredSuggestions.length > 0) {
                setSuggestions([...filteredSuggestions]);
              } else {
                setSuggestions([]);
              }
            } else {
              setSuggestions([]);
            }
          }
        })
        .catch((err) => {
          console.log("district api err:", err);
          setSuggestions([]); // Clear suggestions on error
        });
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 2
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValue("districtName", suggestion.districtName);
    setSuggestions([]);
  };

  const handleInfoModalOpen = () => setInfoModal(true);
  const handleInfoModalClose = () => setInfoModal(false);

  // const handleRadioChange = (event) => {
  //   setRoleType(event.target.value);
  // };

  const fetchGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, handleError);
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const success = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
    await fetchAddress(latitude, longitude);
  };

  const handleError = () => {
    setError("Unable to fetch your location");
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      const apicity =
        data.address?.city || data.address?.town || data.address?.village;
      const apistate = data.address?.state;
      const apidistrict = data.address?.county || data.address?.suburb;

      if (apicity && apistate && apidistrict) {
        setAddress({ city: apicity, state: apistate, district: apidistrict });
      }
    } catch (err) {
      setError("Error fetching address information.");
      console.error(err);
    }
  };

  function formSUbmitHandler(data) {
    const { basementParking, frontParking } = data;
    let bParking = parseInt(basementParking);
    let fParking = parseInt(frontParking);
    const totalSum = (bParking || 0) + (fParking || 0);
    if (totalSum < 2000) {
      setError("TotalError", {
        type: "error",
        message:
          "Sum of basement and front parking must be greater than 2000sqft",
      });
      return false;
    }

    if (data?.siteType !== "BTS" && proofFiles.buildingFrontFile.length === 0) {
      toast.error("Building Front file is mandatory");
      return false;
    } else if (
      data?.siteType !== "BTS" &&
      proofFiles.buildingOppositeFile.length === 0
    ) {
      toast.error("Building Opposite file is mandatory");
      return false;
    } else if (
      data?.siteType !== "BTS" &&
      proofFiles.buildingLeftFile.length === 0
    ) {
      toast.error("Building Left file is mandatory");
      return false;
    } else if (
      data?.siteType !== "BTS" &&
      proofFiles.buildingRightFile.length === 0
    ) {
      toast.error("Building Right file is mandatory");
      return false;
    } else if (
      data?.siteType !== "BTS" &&
      proofFiles.competitorFile.length === 0
    ) {
      toast.error("Competitor file is mandatory");
      return false;
    } else if (
      data?.siteType !== "BTS" &&
      proofFiles.roofTopFile.length === 0
    ) {
      toast.error("Roof Top file is mandatory");
      return false;
    } else if (data?.siteType !== "BTS" && proofFiles.marketFile.length === 0) {
      toast.error("Market file is mandatory");
      return false;
    } else if (data?.siteType !== "BTS" && proofFiles.floorWise.length === 0) {
      toast.error("Floow wise file is mandatory");
      return false;
    }

    const selectedState = JSON.parse(sessionStorage.getItem("selectedState"));

    const formData1 = new FormData();


    const fieldsToAppend = [
      // { field: "State", value: data?.stateName.label },
      { field: "isLandlord", value: data?.roleType === "landlord" },
      { field: "State", value: selectedState?.label },
      { field: "District_Name", value: data?.districtName },
      { field: "City", value: data?.city },
      { field: "Population", value: data?.population || 0 },
      { field: "Car_Pass_Per_HRS", value: data?.carPassPerHrs },
      { field: "Bike_Pass_Per_HRS", value: data?.bikePassPerHrs },
      { field: "Footfall_Per_HRS", value: data?.footfallPerHrs },
      { field: "LL_Rate", value: data?.llRate || 0 },
      { field: "Site_Type", value: data?.siteType },
      { field: "Market", value: data?.marketName },
      { field: "Frontage", value: data?.frontage || 0 },
      { field: "Total_area", value: data?.totalArea || 0 },
      { field: "Lgf", value: data?.lgf },
      { field: "Ugf", value: data?.ugf },
      { field: "Ground_floor", value: data?.groundFloor || 0 },
      { field: "First_Floor", value: data?.firstFloor || 0 },
      { field: "Second_Floor", value: data?.secondFloor || 0 },
      { field: "Third_floor", value: data?.thirdFloor || 0 },
      { field: "Forth_Floor", value: data?.fourthFloor || 0 },
      { field: "Fifth_Floor", value: data?.fifthFloor || 0 },
      { field: "Basement_Parking", value: data?.basementParking || 0 },
      { field: "Front_Parking", value: data?.frontParking || 0 },
      { field: "Google_Coordinates", value: data?.googleCoordinates },
      { field: "Competitors", value: data?.competitorName },
      { field: "Competitors_Sale", value: data?.competitorSale || 0 },
      { field: "Remarks", value: data?.remarks },
      { field: "Broker_Name", value: data?.brokerName || "NA" },
      { field: "Broker_M_No", value: data?.brokerMNo || "NA" },
      { field: "Landlord_Name", value: data?.landlordName || "NA" },
      { field: "Landlord_M_No", value: data?.landlordMNo || "NA" },
      { field: "Road_width", value: data?.roadWidth || 0 },
      { field: "Road_Condition", value: data?.roadCondition },
      { field: "SiteId", value: 0 },
      { field: "ForUpdate", value: false },
      { field: "Createdby", value: sessionStorage.getItem("id") || ""},
      { field: "RM_Name", value: [roleIds.BROKER, roleIds.LANDLORD].includes(roleId) ? data.approvedName || "": id || "" },
      // { field: "Createdby", value: data.approvedName || "" },
      // { field: "RM_Name", value: data.approvedName || "" },
      { field: "PropertyCeilingHeight", value: data.propertyCeilHeight || 0 },
      { field: "Competitors3KMRadius", value: data.noCompetitors || 0 },
      { field: "LocationPreference", value: data.locationPreference || "" },
      { field: "LockinPeriod", value: data.lockinPeriod || "" },
      { field: "Deposit", value: data.deposit || 0 },
      { field: "CapexFromLandlord", value: data.capexLandlord || 0 },
      { field: "PowerSupply", value: data.powerSupply || "" },
      { field: "RoadTrafficPerHour", value: data.roadTraffic || 0 },
      { field: "DISTRICT_POPULATION", value: data.districtPopulation || 0 },
      { field: "CITY_POPULATION", value: data.cityPopulation || 0 },
      { field: "Broker_Email", value: data?.brokerEmail || "" },
      { field: "Landlord_Email", value: data?.landlordEmail || "" },
      {
        field: "DISTT_POPULATION_PER_KM",
        value: data.districtPopulationPerKm || 0,
      },
      {
        field: "CITY_POPULATION_PER_KM",
        value: data.cityPopulationPerKm || 0,
      },
      { field: "LITERACY_RATE", value: data.literactyRate || 0 },
      {
        field: "NO_OF_SCHOOL_WITH_IN_10_KM",
        value: data.noOfSchoolIn10Km || 0,
      },
      {
        field: "NO_OF_COLLEGE_UNIVERSITY_WITH_IN_10_KM",
        value: data.noOfCollegeUniversityIn10Km || 0,
      },
      {
        field: "AVRAGE_HOUSEHOLD_INCOME_DISTT",
        value: data.avgHouseholdIncomeDist || 0,
      },
      { field: "NO_OF_ATM_IN_THIS_CITY", value: data.onOfATMInCity || 0 },
      {
        field: "NO_OF_BANK_BRANCH_IN_CITY",
        value: data.noOfBankBranchInCity || 0,
      },
      {
        field: "NO_OF_INDUSTIRES_FACTORY_IN_CITY",
        value: data.noOfIndustriesFactoryInCity || 0,
      },
      {
        field: "UNEMPLOYEMENT_RATE_IN_CITY",
        value: data.unemployeementRateInCity || 0,
      },
      {
        field: "DISTANCE_FROM_RAILWAYSTATION",
        value: data.distanceFromRailwayStation || 0,
      },
      {
        field: "DISTANCE_FROM_BUS_TERMINAL",
        value: data.distanceFromBusTerminal || 0,
      },
      {
        field: "NO_OF_4_WHEELER_PASSING",
        value: data.noOf4WheelerPassing || 0,
      },
      {
        field: "NO_OF_2_WHEELER_PASSING",
        value: data.noOf2WheelerPassing || 0,
      },
      { field: "NO_OF_SHOPPING_MALL", value: data.noOfShoppingMall || 0 },
      {
        field: "NO_OF_MUTIPLEX_CINEMAS_IN_CITY",
        value: data.onOfMultiplexCinemaInCity || 0,
      },
      {
        field: "PRESENCE_OF_FOOD_COURT",
        value: data.presenceOfFoodCourt || 0,
      },
      // { field: "Rank", value: rank }
    ];

    // Append fields to FormData
    fieldsToAppend.forEach(({ field, value }) => {
      formData1.append(field, value);
    });

    proofFiles.buildingFrontFile.forEach((proof) => {
      formData1.append("BuildingFront", proof);
    });

    proofFiles.buildingOppositeFile.forEach((proof) => {
      formData1.append("BuildingOpposite", proof);
    });

    proofFiles.buildingLeftFile.forEach((proof) => {
      formData1.append("BuildingLeft", proof);
    });

    proofFiles.buildingRightFile.forEach((proof) => {
      formData1.append("BuildingRight", proof);
    });

    proofFiles.competitorFile.forEach((proof) => {
      formData1.append("Competitor", proof);
    });

    proofFiles.roofTopFile.forEach((proof) => {
      formData1.append("RoofTypeAreaDensity", proof);
    });

    proofFiles.marketFile.forEach((proof) => {
      formData1.append("MarketPhoto", proof);
    });

    proofFiles.floorWise.forEach((proof) => {
      formData1.append("FloorWise", proof);
    });

    // const dataFiles = [...data.files];
    // console.log(dataFiles)
    // return

    // Append files
    // if (dataFiles.length > 0) {
    //   dataFiles.forEach((file) => {
    //     formData1.append("files", file);
    //   });
    // }
    // return
    setLoading(true);
    axios
      .post(`${baseUrl}/api/Site/AddSiteNew`, formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(res?.message || "Inserted successfully!");
        setProofFiles((prev) => ({
          buildingFrontFile: [],
          buildingOppositeFile: [],
          buildingLeftFile: [],
          buildingRightFile: [],
          competitorFile: [],
          roofTopFile: [],
          marketFile: [],
          floorWise: [],
        }));
        setAddNewFormModal(false);
        fetchData();
        reset();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message || "Creation failed!");
        console.error(err);
      });
  }

  const handleValueChange = () => {
    clearErrors("TotalError");
  };

  // ***** automatically hide api error after 2 seconds *****
  useEffect(() => {
    if (showApiError) {
      const timer = setTimeout(() => setShowApiError(false), 2000);
      return () => clearTimeout(timer);
    }
  });

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setValue(
        "googleCoordinates",
        location.latitude + ", " + location.longitude
      );
    }
  }, [location]);

  useEffect(() => {
    setValue("stateName", address.state);
    setValue("city", address.city);
    setValue("districtName", address.district);
  }, [address]);

  const nextPageHandler = () => {
    setCurrentPage(2);
  };

  const IsLandlord = roleType === "landlord";

  const isDisplayBrokerAndLandlord = !["broker", "landlord"].includes(roleType);

  console.log({ errors, roleType });


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
            <div className={styles.newform_div}>
              <span className={styles.form_info} onClick={handleInfoModalOpen}>
                {/* <IoIosInformationCircle /> */}
                <button
                  className={`${styles.btns} ${styles.btn_primary}`}
                  style={{
                    backgroundColor: "#0d6efd",
                  }}
                >
                  <IoIosInformationCircle size={18} className="me-1" />
                  info
                </button>
              </span>
              <form
                className={styles.form}
                onSubmit={handleSubmit(
                  currentPage === 1 ? nextPageHandler : formSUbmitHandler
                )}
              >
                <div className="row">
                  {errors.TotalError && (
                    <p role="alert" style={{ color: "red" }}>
                      {errors.TotalError.message}
                    </p>
                  )}

                  <div className="mb-3 mt-n5 w-100 justify-content-start d-flex">
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{
                        backgroundColor: "rgb(13, 110, 253)",
                        visibility: "hidden",
                      }}
                      onClick={fetchGeoLocation}
                    >
                      Fetch Location
                    </button>
                  </div>

                  {currentPage === 1 && (
                    <>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "20px",
                          marginBottom: 5
                        }}
                      >
                        <label className="form-label">
                          <input
                            type="radio"
                            value="landlord"
                            {...register("roleType", { value: !isReadOnly, message: 'Please select a roletype' })}
                            // checked={roleType === "landlord"}
                            // onChange={handleRadioChange}
                            style={{ marginRight: 3 }}
                            disabled={isReadOnly}
                          />
                          Landlord
                        </label>
                        <label className="form-label">
                          <input
                            type="radio"
                            value="broker"
                            {...register("roleType", { required: { value: !isReadOnly, message: 'Please select a roletype' } })}
                            // checked={roleType === "broker"}
                            // onChange={handleRadioChange}
                            style={{ marginRight: 3 }}
                            disabled={isReadOnly}
                          />
                          Broker
                        </label>
                        {errors.stateName && (
                          <div className="invalid-feedback">
                            {errors.stateName.message}
                          </div>
                        )}
                      </div>
                      {["1", "2", "3"].includes(roleId) && <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="approvedName">
                          Assigned To:
                        </label>
                        <input
                          className={`form-control`}
                          {...register("approvedName")}
                          type="text"
                          value={firstName}
                          disabled
                        />
                      </div>}

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="stateName">
                          State Name:
                          <span style={{ color: "red" }}>*</span>
                        </label>

                        <Controller
                          name="stateName"
                          control={control}
                          rules={{ required: "State is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="stateName"
                              className={`p-0 form-control ${errors.stateName ? "is-invalid" : ""
                                }`}
                              options={stateOptions}
                              isClearable
                              placeholder="Select State"
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                sessionStorage.setItem(
                                  "selectedState",
                                  JSON.stringify(selectedOption)
                                );
                              }}
                            />
                          )}
                        />
                        {errors.stateName && (
                          <div className="invalid-feedback">
                            {errors.stateName.message}
                          </div>
                        )}
                      </div>

                      <div
                        className="mb-3 col-12 col-sm-4 col-md-2"
                        style={{ position: "relative " }}
                      >
                        <label className="form-label" htmlFor="districtName">
                          District Name:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.districtName ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="districtName"
                          {...register("districtName", {
                            required: true,
                            onChange: (e) => handleDistrictChange(e), // Ensure this is set
                          })}
                          value={watch("districtName", "")} // Ensure this reflects the latest value
                        />
                        {suggestions.length > 0 && (
                          <ul
                            className="list-group"
                            style={{
                              position: "absolute",
                              zIndex: 1,
                              top: "100%",
                              left: 0,
                              right: 0,
                              maxHeight: "150px",
                              overflowY: "auto",
                              backgroundColor: "white",
                              // width: "20%"
                            }}
                          >
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="list-group-item"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {suggestion.districtName}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="city">
                          City:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.city ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="city"
                          {...register("city", {
                            required: true,
                          })}
                        />
                      </div>

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="population">
                          Population:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.population ? "is-invalid" : ""
                          }`}
                          type="text"
                          id="population"
                          {...register("population", {
                            required: true,
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="carPassPerHrs">
                          Car Pass Per Hrs:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.carPassPerHrs ? "is-invalid" : ""
                          }`}
                          type="text"
                          id="carPassPerHrs"
                          {...register("carPassPerHrs", {
                            required: true,
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="bikePassPerHrs">
                          Bike Pass Per Hrs:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.bikePassPerHrs ? "is-invalid" : ""
                          }`}
                          type="text"
                          id="bikePassPerHrs"
                          {...register("bikePassPerHrs", {
                            required: true,
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="footfallPerHrs">
                          Footfall Per Hrs:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.footfallPerHrs ? "is-invalid" : ""
                          }`}
                          type="text"
                          id="footfallPerHrs"
                          {...register("footfallPerHrs", {
                            required: true,
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      </div> */}

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="roadWidth">
                          Road Width (ft)
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.roadWidth ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="roadWidth"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("roadWidth", {
                            required: true,
                            // valueAsNumber: true,
                            validate: (value) =>
                              Number(value) > 0 || "Value must be number",
                          })}
                        />
                        {errors.roadWidth && (
                          <p role="alert" className="invalid-feedback">
                            {errors.roadWidth.message}
                          </p>
                        )}
                      </div>

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="roadCondition">
                          Road Condition:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="roadCondition"
                          {...register("roadCondition")}
                        />
                      </div> */}

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="llRate">
                          Landlord Rate (psf)
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.llRate ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="llRate"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("llRate", {
                            required: true,
                            // valueAsNumber: true,
                            max:
                              {
                                value: 100,
                                message: "must be less than 100psf",
                                validate: (value) => Number(value) > 0,
                              } || "value must be number",
                          })}
                        />
                        {errors.llRate && (
                          <p role="alert" className="invalid-feedback">
                            {errors.llRate.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="siteType">
                          Site Type:
                        </label>
                        <select
                          className="form-select"
                          id="siteType"
                          {...register("siteType")}
                        // value={formData.siteType}
                        // onChange={handleFormDataChange}
                        // ref={siteTypeRef}
                        >
                          <option value="none">Select</option>
                          <option value="RTM">RTM</option>
                          <option value="BTS">BTS</option>
                          <option value="S-BTS">S-BTS</option>
                        </select>
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="marketName">
                          Market Name:
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.marketName ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="marketName"
                          {...register("marketName", {
                            required: true,
                          })}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="frontage">
                          Frontage (ft)
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.frontage ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="frontage"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("frontage", {
                            required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 35,
                              message: "Frontage must be minimum 35ft",
                            },
                            validate: (value) =>
                              Number(value) > 0 || "Value must be number",
                          })}
                        />
                        {errors.frontage && (
                          <p role="alert" className="invalid-feedback">
                            {errors.frontage.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="propertyCeilHeight"
                        >
                          Property Ceiling Height (ft)
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="propertyCeilHeight"
                          {...register("propertyCeilHeight", {
                            valueAsNumber: true,
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="totalArea">
                          Total Area (sqft)
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.totalArea ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="totalArea"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("totalArea", {
                            required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 9000,
                              message: "Total Area must be minimum 9000sqft",
                            },
                            validate: (value) =>
                              Number(value) > 0 || "Value must be number",
                          })}
                        />
                        {errors.totalArea && (
                          <p role="alert" className="invalid-feedback">
                            {errors.totalArea.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="lgf">
                          LGF:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="lgf"
                          {...register("lgf")}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="ugf">
                          UGF:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="ugf"
                          {...register("ugf")}
                        // value={formData.ugf}
                        // onChange={handleFormDataChange}
                        // ref={ugfRef}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="groundFloor">
                          Ground Floor (sqft)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.groundFloor ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="groundFloor"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("groundFloor", {
                            // required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 3000,
                              message: "Floor must be minimum 3000sqft",
                            },
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors.groundFloor && (
                          <p role="alert" className="invalid-feedback">
                            {errors.groundFloor.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="firstFloor">
                          First Floor (sqft)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.firstFloor ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="firstFloor"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                          {...register("firstFloor", {
                            // required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 3000,
                              message: "Floor must be minimum 3000sqft",
                            },
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors.firstFloor && (
                          <p role="alert" className="invalid-feedback">
                            {errors.firstFloor.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="secondFloor">
                          Second Floor (sqft)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.secondFloor ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="secondFloor"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                          {...register("secondFloor", {
                            // required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 3000,
                              message: "Floor must be minimum 3000sqft",
                            },
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors.secondFloor && (
                          <p role="alert" className="invalid-feedback">
                            {errors.secondFloor.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="thirdFloor">
                          Third Floor (sqft)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.thirdFloor ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="thirdFloor"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                          {...register("thirdFloor", {
                            // required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 3000,
                              message: "Floor must be minimum 3000sqft",
                            },
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors.thirdFloor && (
                          <p role="alert" className="invalid-feedback">
                            {errors.thirdFloor.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="fourthFloor">
                          Fourth Floor (sqft)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.fourthFloor ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="fourthFloor"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                          {...register("fourthFloor", {
                            // required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 3000,
                              message: "Floor must be minimum 3000sqft",
                            },
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors.fourthFloor && (
                          <p role="alert" className="invalid-feedback">
                            {errors.fourthFloor.message}
                          </p>
                        )}
                      </div>

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="fifthFloor">
                          Fifth Floor (sqft)
                        </label>
                        <input
                          className={`form-control ${
                            errors.fifthFloor ? "is-invalid" : ""
                          }`}
                          type="text"
                          id="fifthFloor"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                          {...register("fifthFloor", {
                            // required: true,
                            // valueAsNumber: true,
                            min: {
                              value: 3000,
                              message: "Floor must be minimum 3000sqft",
                            },
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors.fifthFloor && (
                          <p role="alert" className="invalid-feedback">
                            {errors.fifthFloor.message}
                          </p>
                        )}
                      </div> */}

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="basementParking">
                          Basement Parking (sqft)
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          className={`form-control ${errors.TotalError ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="basementParking"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("basementParking", {
                            // required: true,
                            // valueAsNumber: true,
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                          onChange={(e) => handleValueChange(e)}
                        />
                        {errors.basementParking && (
                          <p role="alert" className="invalid-feedback">
                            {errors.basementParking.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="frontParking">
                          Front Parking (sqft)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.TotalError ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="frontParking"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("frontParking", {
                            // required: true,
                            // valueAsNumber: true,
                            validate: (value) => {
                              // Only check if value is entered
                              if (value && Number(value) <= 0) {
                                return "Value must be a positive number";
                              }
                              return true;
                            },
                          })}
                          onChange={(e) => handleValueChange(e)}
                        />
                        {errors.frontParking && (
                          <p role="alert" className="invalid-feedback">
                            {errors.frontParking.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="googleCoordinates"
                        >
                          Google Coordinates:
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.googleCoordinates ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="googleCoordinates"
                          {...register("googleCoordinates", {
                            // required: true,
                          })}
                          onChange={(e) =>
                            fetchAddress(...e.target.value.split(", "))
                          }
                        // value={formData.googleCoordinates}
                        // onChange={handleFormDataChange}
                        // ref={gcordinatesRef}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="remarks">
                          Remarks:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="remarks"
                          {...register("remarks")}
                        // value={formData.remarks}
                        // onChange={handleFormDataChange}
                        // ref={remarksRef}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="noCompetitors">
                          No. of Competitors (in 3km)
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noCompetitors"
                          {...register("noCompetitors", {
                            valueAsNumber: true,
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // Remove non-numeric and non-decimal characters
                          }}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="competitorName">
                          Competitor Name:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="competitorName"
                          {...register("competitorName")}
                        />
                      </div>

                      <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="competitorSale">
                          Competitor Sale:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="competitorSale"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          {...register("competitorSale")}
                        />
                      </div>

                      {(!IsLandlord) && (<><div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="brokerName">
                          Broker Name:
                        </label>
                        <input
                          className={`form-control`}
                          {...register("brokerName")}
                          type="text"
                          // type="text"
                          id="brokerName"
                        // value={formData.brokerName || ""}
                        // onChange={handleFormDataChange}
                        // ref={bNameRef}
                        />
                      </div>

                        <div className="mb-3 col-12 col-sm-4 col-md-2">
                          <label className="form-label" htmlFor="brokerMNo">
                            Broker Mobile No:
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className={`form-control ${errors.brokerMNo ? "is-invalid" : ""
                              }`}
                            type="text"
                            id="brokerMNo"
                            {...register("brokerMNo", {
                              required: true,
                              validate: {
                                validMobileNumber: (value) =>
                                  value === "" ||
                                  /^[0-9]{10}$/.test(value) ||
                                  "Broker mobile number must be 10 digits",
                              },
                              onChange: (e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ); // Remove non-numeric characters
                              },
                            })}
                          />
                          {errors.brokerMNo && (
                            <p className="text-danger">
                              {errors.brokerMNo.message}
                            </p>
                          )}
                        </div>
                        {/* Broker Email id  */}
                        <div className="mb-3 col-12 col-sm-4 col-md-2">
                          <label
                            className="form-label"
                            htmlFor="brokerEmail"
                          >
                            Broker Email Id:
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className={`form-control ${errors.brokerEmail ? "is-invalid" : ""
                              }`}
                            type="text"
                            id="brokerEmail"
                            {...register("brokerEmail", {
                              required: true,
                              validate: {
                                validEmailId: (value) =>
                                  value === "" ||
                                  /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(value) ||
                                  "Broker Email id must be valid",
                              }
                            })}
                            readOnly={isReadOnly}
                          // value={!IsLandlord || loginUserEmail }
                          />
                          {errors.brokerEmail && (
                            <p className="text-danger">
                              {errors.brokerEmail.message}
                            </p>
                          )}
                        </div>
                      {roleId == 4 && <div className="mb-3 col-12 col-sm-4 col-md-2">
                          <label
                            className="form-label"
                            htmlFor="approvedName"
                          >
                            Assigned To:
                          </label>
                          <select
                            id="approvedName"
                            {...register("approvedName", {
                              required: "Approver required",
                            })}
                            className={`form-select ${errors.approvedName ? "is-invalid" : ""
                              }`}
                            // value={[]} 
                            // onChange={e => setOptionId(e.target.value)}
                          >
                            <option value="">Select</option>
                            {optionsArr.map((item, index) => {
                              return (
                                <option value={item?.id} key={index}>
                                  {item?.firstname}
                                </option>
                              );
                            })}
                          </select>
                          {errors.approvedName && (
                            <p
                              role="alert"
                              className="invalid-feedback"
                            >
                              {errors.approvedName.message}
                            </p>
                          )}
                        </div>}
                      </>)}

                      {(IsLandlord) && (<><div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="landlordName">
                          Landlord Name:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="landlordName"
                          {...register("landlordName")}
                        // value={formData.landlordName || ""}
                        // onChange={handleFormDataChange}
                        // ref={LNameRef}
                        />
                      </div>

                        <div className="mb-3 col-12 col-sm-4 col-md-2">
                          <label className="form-label" htmlFor="landlordMNo">
                            Landlord Mobile No:
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className={`form-control ${errors.landlordMNo ? "is-invalid" : ""
                              }`}
                            type="text"
                            id="landlordMNo"
                            {...register("landlordMNo", {
                              required: true,
                              validate: {
                                // Apply validation if the value is not empty
                                validMobileNumber: (value) =>
                                  value === "" ||
                                  /^[0-9]{10}$/.test(value) ||
                                  "Landlord mobile number must be 10 digits",
                              },
                              onChange: (e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ); // Remove non-numeric characters
                              },
                            })}
                          />
                          {errors.landlordMNo && (
                            <p className="text-danger">
                              {errors.landlordMNo.message}
                            </p>
                          )}
                        </div>
                        {/* Landlord Email id */}
                        <div className="mb-3 col-12 col-sm-4 col-md-2">
                          <label className="form-label" htmlFor="landlordEmail">
                            Landlord Email Id:
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className={`form-control ${errors.landlordEmail ? "is-invalid" : ""
                              }`}
                            type="text"
                            id="landlordEmail"
                            {...register("landlordEmail", {
                              required: true,
                              validate: {
                                // Apply validation if the value is not empty
                                validEmail: (value) =>
                                  value === "" ||
                                  /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(value) ||
                                  "Landlord email must be valid",
                              },
                              // onChange: (e) => {
                              //   e.target.value =
                              //     e.target.value.replace(
                              //       /[^0-9]/g,
                              //       ""
                              //     ); // Remove non-numeric characters
                              // },
                            })}
                            readOnly={isReadOnly}
                          />
                          {errors.landlordEmail && (
                            <p className="text-danger">
                              {errors.landlordEmail.message}
                            </p>
                          )}
                        </div>
                      </>)}

                      {/* new added fields */}
                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="districtPopulation"
                        >
                          District Population:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="districtPopulation"
                          {...register("districtPopulation")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="cityPopulation">
                          City Population:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="cityPopulation"
                          {...register("cityPopulation")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="districtPopulationPerKm"
                        >
                          Distt Population Per Km:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="districtPopulationPerKm"
                          {...register("districtPopulationPerKm")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="cityPopulationPerKm"
                        >
                          City Population Per Km:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="cityPopulationPerKm"
                          {...register("cityPopulationPerKm")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="literactyRate">
                          Literacy Rate:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="literactyRate"
                          {...register("literactyRate")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOfSchoolIn10Km"
                        >
                          No. of School Within 10km:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOfSchoolIn10Km"
                          {...register("noOfSchoolIn10Km")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOfCollegeUniversityIn10Km"
                        >
                          No. of College/University Within 10km:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOfCollegeUniversityIn10Km"
                          {...register("noOfCollegeUniversityIn10Km")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="avgHouseholdIncomeDist"
                        >
                          Average Household Income District:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="avgHouseholdIncomeDist"
                          {...register("avgHouseholdIncomeDist")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label className="form-label" htmlFor="onOfATMInCity">
                          No. of ATM in City:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="onOfATMInCity"
                          {...register("onOfATMInCity")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOfBankBranchInCity"
                        >
                          No. of Bank Branch in City:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOfBankBranchInCity"
                          {...register("noOfBankBranchInCity")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOfIndustriesFactoryInCity"
                        >
                          No. of Industries/Factory in City:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOfIndustriesFactoryInCity"
                          {...register("noOfIndustriesFactoryInCity")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="unemployeementRateInCity"
                        >
                          Unemployeement Rate in City:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="unemployeementRateInCity"
                          {...register("unemployeementRateInCity")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="distanceFromRailwayStation"
                        >
                          Distance From Railway Stattion:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="distanceFromRailwayStation"
                          {...register("distanceFromRailwayStation")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="distanceFromBusTerminal"
                        >
                          Distance From Bus Terminal:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="distanceFromBusTerminal"
                          {...register("distanceFromBusTerminal")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOf4WheelerPassing"
                        >
                          No. of 4 Wheeler Passing:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOf4WheelerPassing"
                          {...register("noOf4WheelerPassing")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOf2WheelerPassing"
                        >
                          No. of 2 Wheeler Passing:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOf2WheelerPassing"
                          {...register("noOf2WheelerPassing")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="noOfShoppingMall"
                        >
                          No. of Shopping Mall:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="noOfShoppingMall"
                          {...register("noOfShoppingMall")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="onOfMultiplexCinemaInCity"
                        >
                          No. of Multiplex Cinema In City:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="onOfMultiplexCinemaInCity"
                          {...register("onOfMultiplexCinemaInCity")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}

                      {/* <div className="mb-3 col-12 col-sm-4 col-md-2">
                        <label
                          className="form-label"
                          htmlFor="presenceOfFoodCourt"
                        >
                          Presence of Food Court:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="presenceOfFoodCourt"
                          {...register("presenceOfFoodCourt")}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Remove invalid characters live
                            value = value.replace(/[^0-9.%]/g, ""); // Keep only digits, dot, percent

                            // Allow only one dot
                            const parts = value.split(".");
                            if (parts.length > 2) {
                              value = parts[0] + "." + parts.slice(1).join("");
                            }

                            // Allow only one % at the end
                            value = value.replace(/%/g, ""); // Remove all %
                            if (e.target.value.endsWith("%")) {
                              value += "%";
                            }

                            e.target.value = value;
                          }}
                          pattern="^\d*\.?\d*%?$"
                        />
                      </div> */}
                    </>
                  )}

                  {currentPage === 2 && (
                    <div
                      style={{
                        width: "80vw",
                        // maxHeight: "40vh !important",
                        flexGrow: 1,
                        // width: "100%",
                        // height: "calc(100% - 4rem)",
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "auto !important",
                        padding: "1rem 2rem",
                        marginBottom: "-5rem",
                        maxHeight: "25rem",
                      }}
                    >
                      <div
                        className={styles.addproofs_container}
                        style={{
                          marginTop: "-3rem",
                        }}
                      >
                        <div className={styles.files_main_container}>
                          {proofsList.map((proof, index) => {
                            return (
                              <div
                                className={styles.file_container}
                                key={index}
                                style={{
                                  marginBottom:
                                    isAccordionOpen[proof.labelId] &&
                                      proofFiles[proof.labelId]?.length > 0
                                      ? "8rem"
                                      : "0rem",
                                }}
                                onClick={() => toggleAccordion(proof.labelId)}
                              >
                                <label>
                                  {proof.label}
                                  {siteType !== "BTS" && proof.required && (
                                    <span className={styles.required}>*</span>
                                  )}
                                </label>

                                {updatedSampleFiles[index]
                                  .isSampleFileAvailable && (
                                    <button
                                      type="button"
                                      className={styles.view_sample_btn}
                                      onClick={() =>
                                        handleSampleModalOpen(proof.label)
                                      }
                                    >
                                      View Sample
                                    </button>
                                  )}

                                <div className={styles.file}>
                                  <small>
                                    {proofFiles[proof.labelId].length === 0
                                      ? "No file selected"
                                      : proofFiles[proof.labelId].length === 1
                                        ? proofFiles[proof.labelId][0].name
                                        : `${proofFiles[proof.labelId].length
                                        } files`}
                                  </small>

                                  <label htmlFor={proof.labelId}>
                                    {proof.icon}
                                  </label>

                                  <input
                                    type="file"
                                    id={proof.labelId}
                                    onChange={handleProofsInputChange}
                                    multiple
                                  />
                                </div>

                                {/* Accordion to show selected files */}
                                {isAccordionOpen[proof.labelId] &&
                                  proofFiles[proof.labelId]?.length > 0 && (
                                    <div
                                      className={styles.accordion}
                                      // onClick={handleAccordionClick}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {proofFiles[proof.labelId].map(
                                        (file, idx) => {
                                          const fileURL =
                                            URL.createObjectURL(file);
                                          return (
                                            <div
                                              key={idx}
                                              className={styles.accordion_file}
                                              onClick={(e) =>
                                                openFileInScreen(
                                                  e,
                                                  proof.labelId,
                                                  fileURL,
                                                  idx
                                                )
                                              }
                                            >
                                              {file.type.includes("image") ? (
                                                <img
                                                  src={fileURL}
                                                  alt={file.name}
                                                  width="40"
                                                  height="40"
                                                  className="acc_files"
                                                />
                                              ) : file.type.includes(
                                                "video"
                                              ) ? (
                                                <video
                                                  width="40"
                                                  height="40"
                                                  src={fileURL}
                                                  className="acc_files"
                                                />
                                              ) : (
                                                <FaFile
                                                  fontSize={"1.5rem"}
                                                  className="acc_files"
                                                  title="No preview available"
                                                />
                                              )}

                                              <span
                                                className={styles.delete_icon}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  deleteFileAccordion(
                                                    e,
                                                    proof.labelId,
                                                    idx
                                                  );
                                                }}
                                              >
                                                {/* <MdDelete /> */}
                                                <ImCross />
                                              </span>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    // onClick={newSubmit}
                    // disabled={loading}
                    // type='button'
                    // onClick={handleFormDataSubmit}
                    style={{ backgroundColor: "#0d6efd" }}
                    disabled={loading}
                  >
                    {currentPage === 1 ? "Next" : "Submit"}
                  </button>
                </div>
              </form>

              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#0d6efd",
                    display: currentPage === 1 ? "none" : "",
                  }}
                  onClick={() => setCurrentPage(1)}
                >
                  Previous
                </button>
              </div>
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

      {isShowProofFilesClicked && (
        <FilesCarousel
          files={showProofFiles}
          setIsShowProofFilesClicked={setIsShowProofFilesClicked}
        />
      )}

      {isSampleModalOpen && (
        <FilesCarouselPublic
          files={currentSampleFiles}
          setIsShowProofFilesClicked={setIsSampleModalOpen}
        />
      )}
    </div>
  );
};

export default NewForm2;
