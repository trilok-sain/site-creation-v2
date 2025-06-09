import React, { useEffect, useState, useRef } from "react";
import styles from "./ViewDetails.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReusableModal from "../../utilities/ReusableModal/ReusableModal";
import { useApi } from "../../APIConfig/APIContext";
import axios from "axios";
import ReCarousel from "../../utilities/ReusableCarousel/ReCarousel";
import { IoIosInformationCircle } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../utilities/Loader";
import Select from "react-select";
import { FaFile, FaFileImage } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import FilesCarousel from "../../components/FilesCarousel";
import { ImCross } from "react-icons/im";
import FilesCarouselPublic from "../../components/FilesCarouselPublic";
import AdditionalInfo from "./AdditionalInfo";

const ViewDetails = () => {
  const baseUrl = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const roleId = sessionStorage.getItem("roleId");
  const firstName = sessionStorage.getItem("firstName");
  const id = sessionStorage.getItem("id");
  const previousLocation = location.state?.from;
  const rowData = location?.state?.rowData;
  const [rank, setRank] = useState("");
  const [showApiError, setShowApiError] = useState(false);
  const emailid = sessionStorage.getItem("emailid");
  const [apiError, setApiError] = useState("");
  const [isFieldsEditable, setIsFeildseditable] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState({});
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [currentSampleFiles, setCurrentSampleFiles] = useState([]);
  const [formData, setFormData] = useState({
    stateName: rowData?.state,
    districtName: rowData?.district_Name,
    city: rowData?.city,
    population: rowData?.population,
    carPassPerHrs: rowData?.car_Pass_Per_HRS,
    bikePassPerHrs: rowData?.bike_Pass_Per_HRS,
    footfallPerHrs: rowData?.footfall_Per_HRS,
    llRate: rowData?.lL_Rate,
    siteType: rowData?.site_Type,
    marketName: rowData?.market,
    frontage: rowData?.frontage,
    totalArea: rowData?.total_area,
    lgf: rowData?.lgf,
    ugf: rowData?.ugf,
    groundFloor: rowData?.ground_floor,
    firstFloor: rowData?.first_Floor,
    secondFloor: rowData?.second_Floor,
    thirdFloor: rowData?.third_floor,
    fourthFloor: rowData?.forth_Floor,
    fifthFloor: rowData?.fifth_Floor,
    basementParking: rowData?.basement_Parking,
    frontParking: rowData?.front_Parking,
    googleCoordinates: rowData?.google_Coordinates,
    remarks: rowData?.remarks,
    competitorName: rowData?.competitors,
    competitorSale: rowData?.competitors_Sale,
    brokerName: rowData?.broker_Name,
    brokerMNo: rowData?.broker_M_No,
    brokerEmail: rowData.broker_Email,
    landlordName: rowData?.landlord_Name,
    landlordMNo: rowData?.landlord_M_No,
    landlordEmail: rowData?.landlord_Email,
    roadWidth: rowData?.road_Width,
    roadCondition: rowData?.road_Condition,

    // new added fields
    capexLandlord: rowData?.capexFromLandlord,
    locationPreference: rowData?.locationPreference,
    powerSupply: rowData?.powerSupply,
    lockinPeriod: rowData?.lockinPeriod,
    deposit: rowData?.deposit,
    appDeposit: 0,
    propertyCeilHeight: rowData?.propertyCeilingHeight,
    noCompetitors: rowData?.competitors3KMRadius,
    roadTraffic: rowData?.roadTrafficPerHour,

    // - more new fields
    districtPopulation: rowData?.districT_POPULATION,
    cityPopulation: rowData?.citY_POPULATION,
    districtPopulationPerKm: rowData?.distT_POPULATION_PER_KM,
    cityPopulationPerKm: rowData?.citY_POPULATION_PER_KM,
    literactyRate: rowData?.literacY_RATE,
    noOfSchoolIn10Km: rowData?.nO_OF_SCHOOL_WITH_IN_10_KM,
    noOfCollegeUniversityIn10Km:
      rowData?.nO_OF_COLLEGE_UNIVERSITY_WITH_IN_10_KM,
    avgHouseholdIncomeDist: rowData?.avragE_HOUSEHOLD_INCOME_DISTT,
    onOfATMInCity: rowData?.nO_OF_ATM_IN_THIS_CITY,
    noOfBankBranchInCity: rowData?.nO_OF_BANK_BRANCH_IN_CITY,
    noOfIndustriesFactoryInCity: rowData?.nO_OF_INDUSTIRES_FACTORY_IN_CITY,
    unemployeementRateInCity: rowData?.unemployemenT_RATE_IN_CITY,
    distanceFromRailwayStation: rowData?.distancE_FROM_RAILWAYSTATION,
    distanceFromBusTerminal: rowData?.distancE_FROM_BUS_TERMINAL,
    noOf4WheelerPassing: rowData?.nO_OF_4_WHEELER_PASSING,
    noOf2WheelerPassing: rowData?.nO_OF_2_WHEELER_PASSING,
    noOfShoppingMall: rowData?.nO_OF_SHOPPING_MALL,
    onOfMultiplexCinemaInCity: rowData?.nO_OF_MUTIPLEX_CINEMAS_IN_CITY,
    presenceOfFoodCourt: rowData?.presencE_OF_FOOD_COURT,
  });
  const [roadRanking, setRoadRanking] = useState("");
  const [marketRanking, setMarketRanking] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteProofs, setSiteProofs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [stateNamesList, setStateNamesList] = useState([]);
  const [proofFiles, setProofFiles] = useState({
    buildingFrontFile: [],
    buildingOppositeFile: [],
    buildingLeftFile: [],
    buildingRightFile: [],
    floorWise: [],
    competitorFile: [],
    roofTopFile: [],
    marketFile: [],
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

  // let notProofFiles =
  //   proofFiles.buildingFrontFile.length === 0 ||
  //   proofFiles.buildingOppositeFile.length == 0 ||
  //   proofFiles.buildingLeftFile.length === 0 ||
  //   proofFiles.buildingRightFile.length === 0 ||
  //   proofFiles.floorWise.length === 0 ||
  //   proofFiles.competitorFile.length === 0 ||
  //   proofFiles.roofTopFile.length === 0 ||
  //   proofFiles.marketFile.length === 0;

  const notProofFiles =
    !proofFiles.buildingFrontFile.length ||
    !proofFiles.buildingOppositeFile.length ||
    !proofFiles.buildingLeftFile.length ||
    !proofFiles.buildingRightFile.length ||
    !proofFiles.floorWise.length ||
    !proofFiles.competitorFile.length ||
    !proofFiles.roofTopFile.length ||
    !proofFiles.marketFile.length;

  const proofsList = [
    {
      label: "Building Front",
      labelId: "buildingFrontFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Building Opposite",
      labelId: "buildingOppositeFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Building Left",
      labelId: "buildingLeftFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Building Right",
      labelId: "buildingRightFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Competitor",
      labelId: "competitorFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Roof Top",
      labelId: "roofTopFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Market",
      labelId: "marketFile",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Floor Wise",
      labelId: "floorWise",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    // {
    //   label: "Ground Floor",
    //   labelId: "groundFloorFile",
    //   icon: <FaFileImage color="#29c071" />,
    //   required: false,
    // },

    // {
    //   label: "First Floor",
    //   labelId: "firstFloorFile",
    //   icon: <FaFileImage color="#29c071" />,
    //   required: false,
    // },

    // {
    //   label: "Second Floor",
    //   labelId: "secondFloorFile",
    //   icon: <FaFileImage color="#29c071" />,
    //   required: false,
    // },

    // {
    //   label: "Third Floor",
    //   labelId: "thirdFloorFile",
    //   icon: <FaFileImage color="#29c071" />,
    //   required: false,
    // },

    // {
    //   label: "Fourth Floor",
    //   labelId: "fourthFloorFile",
    //   icon: <FaFileImage color="#29c071" />,
    //   required: false,
    // },

    // {
    //   label: "Fifth Floor",
    //   labelId: "fifthFloorFile",
    //   icon: <FaFileImage color="#29c071" />,
    //   required: false,
    // },
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    return window.removeEventListener("resize", handleResize);
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

  // const handleAccordionClick = (e) => {
  //   e.stopPropagation();
  //   const fileElement = e.target.closest(".acc_files");
  //   console.log(fileElement);
  // };

  // const handleAccordionClick = (e, labelId) => {
  //   e.stopPropagation();

  //   if (e.target.closest(`.${styles.accordion_file}`)) {
  //     const fileDiv = e.target.closest(`.${styles.accordion_file}`);
  //     console.log("filediv", fileDiv);
  //     const fileUrl = fileDiv.dataset.fileUrl;
  //     const fileId = fileDiv.dataset.fileId;

  //     console.log("fileurl", fileUrl);
  //     console.log("fileid", fileId);
  //     console.log("dataset", fileDiv.dataset);
  //   }
  // };

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

  const handleStateNameChange = (selectedOption) => {
    // Check if a valid option is selected
    if (selectedOption) {
      const value = selectedOption.value;

      setFormData((prevValues) => {
        return {
          ...prevValues,
          stateName: value,
        };
      });
    } else {
      setFormData((prevValues) => ({
        ...prevValues,
        stateName: "",
      }));
    }
  };

  const handleDistrictNameChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, districtName: value });

    if (value.length >= 2) {
      await axios
        .post(`${baseUrl}/api/site/GetDistrict?param=${value}`)
        .then((res) => {
          if (res.status === 200) {
            // console.log("res", res);
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
          // console.log("district api err:", err);
          setSuggestions([]); // Clear suggestions on error
        });
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 2
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, districtName: suggestion.districtName });
    setSuggestions([]);
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "50% !important", // Set your desired width here
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10, // Ensure dropdown stays above other elements
    }),
  };

  useEffect(() => {
    if (rowData?.siteProofs) {
      setSiteProofs(rowData?.siteProofs);
    }
  }, [rowData]);

  const [isGroundFloorInvalid, setIsGroundFloorInvalid] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

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
  const capexRef = useRef(null);
  const preferenceRef = useRef(null);
  const powerRef = useRef(null);
  const lockinRef = useRef(null);
  const depositRef = useRef(null);
  const ceilHeightRef = useRef(null);
  const noCompRef = useRef(null);
  const roadTrafficRef = useRef(null);
  // new refs
  const districtPopulationRef = useRef(null);
  const cityPopulationRef = useRef(null);
  const districtPopulationPerKmRef = useRef(null);
  const cityPopulationPerKmRef = useRef(null);
  const literactyRateRef = useRef(null);
  const noOfSchoolIn10KmRef = useRef(null);
  const noOfCollegeUniversityIn10KmRef = useRef(null);
  const avgHouseholdIncomeDistRef = useRef(null);
  const onOfATMInCityRef = useRef(null);
  const noOfBankBranchInCityRef = useRef(null);
  const noOfIndustriesFactoryInCityRef = useRef(null);
  const unemployeementRateInCityRef = useRef(null);
  const distanceFromRailwayStationRef = useRef(null);
  const distanceFromBusTerminalRef = useRef(null);
  const noOf4WheelerPassingRef = useRef(null);
  const noOf2WheelerPassingRef = useRef(null);
  const noOfShoppingMallRef = useRef(null);
  const onOfMultiplexCinemaInCityRef = useRef(null);
  const presenceOfFoodCourtRef = useRef(null);

  // ***** MODALS AND CAROUSELS STATES *****
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [addProofsModal, setAddProofsModal] = useState(false);
  const [viewRemarksModal, setViewRemarksModal] = useState(false);
  const [tcModal, setTCModal] = useState(false);
  const [viewProofsCarousel, setViewProofsCarousel] = useState(false);
  const [isAdditioinal, setAdditional] = useState(false)//change

  const [addProofs, setAddProofs] = useState([]);
  const [approveFormData, setApproveFormData] = useState({
    zone: parseInt(roleId) === 1 || parseInt(roleId) === 3 ? rowData?.zone : "",
    v2rate:
      parseInt(roleId) === 1 || parseInt(roleId) === 3 ? rowData?.v2_Rate : "",
    rank: parseInt(roleId) === 1 || parseInt(roleId) === 3 ? rowData?.rank : "",
    approveRemarks:
      parseInt(roleId) === 1 || parseInt(roleId) === 3
        ? rowData?.actionremarks
        : "",
  });
  const [rejectRemarks, setRejectRemarks] = useState("");

  // ***** FUNCTION TO CALCULATE RANK *****
  const calculateRank = () => {
    let rankSum = 0;

    // ***** LL RATE *****
    formData.llRate < 35
      ? (rankSum += 10)
      : formData.llRate > 35 && formData.llRate < 50
      ? (rankSum += 7)
      : formData.llRate > 50 && formData.llRate < 70
      ? (rankSum += 6.5)
      : (rankSum += 5);

    // ***** FRONTAGE *****
    formData.frontage > 100
      ? (rankSum += 8)
      : formData.frontage > 60 && formData.frontage < 100
      ? (rankSum += 6)
      : formData.frontage > 45 && formData.frontage < 60
      ? (rankSum += 4.5)
      : formData.frontage > 30 && formData.frontage < 45
      ? (rankSum += 2.5)
      : 0;

    // ***** BASEMENT AND FRONT PARKING *****
    formData.basementParking > 0 && formData.frontParking > 0
      ? (rankSum += 7)
      : (formData.basementParking === 0 && formData.frontParking > 0) ||
        (formData.basementParking > 0 && formData.frontParking === 0)
      ? (rankSum += 5)
      : (rankSum += 3.5);

    // ***** PROPERTY CEILING HEIGHT*****
    if (formData.propertyCeilHeight < 8) {
      rankSum += 3;
    } else if (formData.propertyCeilHeight < 9) {
      rankSum += 4;
    } else if (formData.propertyCeilHeight < 10) {
      rankSum += 5;
    }

    // ***** ROAD WIDTH*****
    formData.roadWidth > 80
      ? (rankSum += 8)
      : formData.roadWidth > 50 && formData.roadWidth < 80
      ? (rankSum = +6.5)
      : formData.roadWidth > 30 && formData.roadWidth < 50
      ? (rankSum += 5)
      : (rankSum += 4);

    // ***** GROUND FLOOR *****
    formData.groundFloor > 6000
      ? (rankSum += 8)
      : formData.groundFloor < 4000 && formData.groundFloor > 6000
      ? (rankSum += 7)
      : formData.groundFloor > 3000 && formData.groundFloor < 4000
      ? (rankSum += 5)
      : (rankSum += 3);

    // ***** POPULATION *****
    formData.population > 0 ? (rankSum += 5) : (rankSum += 0);

    // ***** NUMBER OF COMPETITORS *****
    formData.noCompetitors > 4
      ? (rankSum += 7)
      : formData.noCompetitors > 2 && formData.noCompetitors < 4
      ? (rankSum += 5)
      : formData.noCompetitors === 1
      ? (rankSum += 4)
      : (rankSum += 3);

    // ***** LOCATION PREFERENCE *****
    if (
      formData.locationPreference === "high-street" ||
      formData.locationPreference === "mall"
    ) {
      rankSum += 4.5;
    } else if (formData.locationPreference === "residential") {
      rankSum += 4;
    }

    // ***** LOCKIN PERIOD*****
    formData.lockinPeriod === "no-lockin"
      ? (rankSum += 6)
      : formData.lockinPeriod === "1"
      ? (rankSum += 5)
      : formData.lockinPeriod
      ? (rankSum += 4.5)
      : (rankSum += 0);

    // ***** DEPOSIT *****
    formData.appDeposit === 2
      ? (rankSum += 6)
      : formData.appDeposit > 2
      ? (rankSum += 4)
      : formData.appDeposit > 6
      ? (rankSum += 2)
      : (rankSum += 0);

    // ***** CAPEX FROM LANDLORD *****
    formData.capexLandlord > 300
      ? (rankSum += 6)
      : formData.capexLandlord > 200 && formData.capexLandlord < 300
      ? (rankSum += 4.5)
      : formData.capexLandlord > 100 && formData.capexLandlord < 200
      ? (rankSum += 3.5)
      : (rankSum += 2);

    // ***** SITE TYPE *****
    formData.siteType === "RTM"
      ? (rankSum += 6)
      : formData.siteType === "S-BTS"
      ? (rankSum += 5)
      : formData.siteType === "BTS"
      ? (rankSum += 4)
      : (rankSum += 0);

    // ***** POWER SUPPLY *****
    formData.powerSupply === "yes"
      ? (rankSum += 5)
      : formData.powerSupply === "no"
      ? (rankSum += 2.5)
      : (rankSum += 0);

    // ***** ROAD TRAFFIC *****
    formData.roadTraffic > 0 ? (rankSum += 5) : (rankSum += 0);

    // ***** ROAD RANKING *****
    roadRanking === "main-road"
      ? (rankSum += 7)
      : roadRanking === "main-road2"
      ? (rankSum += 5)
      : roadRanking === "main-road3"
      ? (rankSum += 4)
      : roadRanking === "connecting-road"
      ? (rankSum += 2)
      : (rankSum += 0);

    // ***** MARKET RANKING *****
    marketRanking === "main-market"
      ? (rankSum += 7)
      : marketRanking === "near-market"
      ? (rankSum += 5)
      : marketRanking === "out-ranking"
      ? (rankSum += 3)
      : (rankSum += 0);

    // ***** SOURCE OF INCOME *****
    incomeSource === "option1"
      ? (rankSum += 7)
      : incomeSource === "option2"
      ? (rankSum += 5)
      : incomeSource === "option3"
      ? (rankSum += 4)
      : (rankSum += 0);

    // ***** CALCULATE SITE RANK *****
    rankSum > 70
      ? setRank("A")
      : rankSum > 20 && rankSum < 70
      ? setRank("B")
      : setRank("C");
  };

  // ***** MODALS AND CAROUSELS UPDATE FUNCTIONS *****
  const handleApproveModalOpen = () => setApproveModal(true);
  const handleApproveModalClose = () => {
    setApproveModal(false);
    setApproveFormData({
      rank: "",
      zone: "",
      v2rate: "",
      approveRemarks: "",
    });
  };
  const handleRejectModalOpen = () => setRejectModal(true);
  const handleRejectModalClose = () => {
    setRejectModal(false);
    setRejectRemarks("");
  };
  const handleAddProofsModalOpen = () => setAddProofsModal(true);
  const handleAddProofsModalClose = () => {
    setAddProofsModal(false);
    setAddProofs([]);
  };
  const handleTCModalOpen = () => setTCModal(true);
  const handleTCModalClose = () => setTCModal(false);
  const handleViewRemarksModalOpen = () => setViewRemarksModal(true);
  const handleViewRemarksModalClose = () => setViewRemarksModal(false);
 const handleViewProofsCarouselOpen = (value = false) =>{ 
    setViewProofsCarousel(true)
    setAdditional(value)
  };
  const handleViewProofsCarouselClose = () => {
     setAdditional(false)
    setViewProofsCarousel(false)
  };

  // ***** FUNCTION TO CHECK IF VALUE IS INVALID *****
  const checkFieldValidity = (val) => {
    return val === "" || val === null || val === undefined;
  };

  // ***** FUNCTION TO CHANGE STATE OF FORM *****
  const handleFormDataChange = (event) => {
    const id = event.target.id;
    setFormData((prevValues) => ({
      ...prevValues,
      [id]: event.target.value,
    }));
    calculateRank();
  };

  // ***** FUNCTION TO CHANGE START FOR ADDPROOFS MODAL INPUTS *****
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

  // ***** FUNCTION TO CHANGE INPUTS VALUES FOR APPROVE FORM *****
  const handleApproveFormChange = (e) => {
    setApproveFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // ***** FUNCTION TO TOGGLE EDIT FOR FORM FIELDS *****
  const toggleFieldsEdit = () => setIsFeildseditable(!isFieldsEditable);

  const handleApproveRejectFormSubmit = async (type) => {
    if (type === true) {
      if (
        checkFieldValidity(approveFormData.zone) ||
        checkFieldValidity(approveFormData.v2rate) ||
        checkFieldValidity(approveFormData.approveRemarks) ||
        checkFieldValidity(rank)
      ) {
        toast.error("All fields are mandatory!");
        return false;
      }

     
      const formData1 = new FormData();

      formData1.append("SiteId", String(rowData?.siteID));
      formData1.append("ZONE", approveFormData.zone);
      formData1.append("V2_RATE", approveFormData.v2rate);
      formData1.append("RANK", rank);
      formData1.append("Remarks", approveFormData.approveRemarks);
      formData1.append("TYPE", type);
      formData1.append("actionperformby", firstName);
      formData1.append("RoleId", roleId);
      formData1.append("PropertyCeilingHeight", formData.propertyCeilHeight);
      formData1.append("Competitors3KMRadius", formData.noCompetitors);
      formData1.append("LocationPreference", formData.locationPreference);
      formData1.append("LockinPeriod", formData.lockinPeriod);
      formData1.append("Deposit", formData.deposit);
      formData1.append("CapexFromLandlord", formData.capexLandlord);
      formData1.append("PowerSupply", formData.powerSupply);
      formData1.append("RoadTrafficPerHour", formData.roadTraffic);
      formData1.append("UserId", id)

      await axios
        .post(`${baseUrl}/api/Site/UpdateSiteStatusSuperAdmin`, formData1)
        .then((response) => {
          if (response.status === 200) {
            toast.success(response?.data?.message || "Approved successfully!!");
            navigate(previousLocation);
            setFormData({
              rank: "",
              v2rate: "",
              zone: "",
              approveRemarks: "",
            });
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || "Failed to approve site!"
          );
        });
    } else if (type === false) {
      if (checkFieldValidity(rejectRemarks)) {
        toast.error("Remarks is mandatory!");
        return false;
      }

      const formData = new FormData();

      // formData.append("SiteId", String(rowData?.siteID));
      formData.append("Remarks", rejectRemarks);
      formData.append("TYPE", type);
      formData.append("actionperformby", sessionStorage.getItem("firstname"));
      formData.append("SiteId", String(rowData?.siteID));
      formData.append("RoleId", roleId);
      formData.append("UserId", id)

      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      await axios
        .post(`${baseUrl}/api/Site/UpdateSiteStatusSuperAdmin`, formData)
        .then((response) => {
          if (response.status === 200) {
            toast.success(response?.data?.message || "Rejected successfully!");
            navigate(previousLocation);
            setRejectRemarks("");
          }
        })
        .catch((err) => {
          console.log("error", err);
          toast.error(err?.response?.data?.message || "Failed to reject site!");
        });
    }
  };

  // ***** FUNCTION TO SUBMIT FILES *****
  const handleAddProofsSubmit = async () => {
    if (rowData?.site_Type !== "BTS" && notProofFiles) {
      alert("Files are mandatory!");
      return false;
    }

    if (proofFiles.buildingFrontFile.length === 0) {
      toast.error("Building Front file is mandatory");
      return false;
    } else if (proofFiles.buildingOppositeFile.length === 0) {
      toast.error("Building Opposite file is mandatory");
      return false;
    } else if (proofFiles.buildingLeftFile.length === 0) {
      toast.error("Building Left file is mandatory");
      return false;
    } else if (proofFiles.buildingRightFile.length === 0) {
      toast.error("Building Right file is mandatory");
      return false;
    } else if (proofFiles.competitorFile.length === 0) {
      toast.error("Competitor file is mandatory");
      return false;
    } else if (proofFiles.roofTopFile.length === 0) {
      toast.error("Roof Top file is mandatory");
      return false;
    } else if (proofFiles.marketFile.length === 0) {
      toast.error("Market file is mandatory");
      return false;
    } else if (proofFiles.floorWise.length === 0) {
      toast.error("Floor wise file is mandatory");
      return false;
    }

    let formData = new FormData();
    formData.append("siteId", String(rowData?.siteID));
    formData.append("createdBy", "v2_source");

    proofFiles.buildingFrontFile.forEach((proof) => {
      formData.append("BuildingFront", proof);
    });

    proofFiles.buildingOppositeFile.forEach((proof) => {
      formData.append("BuildingOpposite", proof);
    });

    proofFiles.buildingLeftFile.forEach((proof) => {
      formData.append("BuildingLeft", proof);
    });

    proofFiles.buildingRightFile.forEach((proof) => {
      formData.append("BuildingRight", proof);
    });

    proofFiles.competitorFile.forEach((proof) => {
      formData.append("Competitor", proof);
    });

    proofFiles.roofTopFile.forEach((proof) => {
      formData.append("RoofTypeAreaDensity", proof);
    });

    proofFiles.marketFile.forEach((proof) => {
      formData.append("MarketPhoto", proof);
    });

    proofFiles.floorWise.forEach((proof) => {
      formData.append("FloorWise", proof);
    });

    setLoading(true);
    // return
    try {
      await axios
        .post(`${baseUrl}/api/Site/AddProofNew`, formData)
        .then((response) => {
          if (response.status === 200) {
            navigate(previousLocation);
            toast.success(response?.data?.message || "Added proofs!!");
            setLoading(false);
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
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || err?.message || "Failed to submit!!"
          );
          setLoading(false);
        });
      // navigate('/')
    } catch (error) {
      console.error("error in submitting add proof: ", error?.stack);
      toast.error(
        err?.response?.data?.message || "Error in submitting proofs!!"
      );
    }
  };

  const handleNumberFieldsValidation = (e) => {
    if (!isFieldsEditable) return;

    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Home",
      "End",
    ];

    const key = e.key;
    const input = e.currentTarget;
    const { value, selectionStart, selectionEnd } = input;

    // Allow control keys
    if (allowedKeys.includes(key)) return;

    // Allow digits
    if (/^\d$/.test(key)) return;

    // Simulate new value after key press
    const newValue =
      value.substring(0, selectionStart) + key + value.substring(selectionEnd);

    // Allow only one dot
    if (key === ".") {
      if (newValue.split(".").length > 2) {
        e.preventDefault();
      }
      return;
    }

    // Allow only one '%' and only at the end
    if (key === "%") {
      if (newValue.includes("%") && selectionStart !== value.length) {
        e.preventDefault();
      }
      return;
    }

    // Block everything else
    e.preventDefault();
  };

  const validateField = (ref, fieldName, minValue, errorMessage) => {
    const value = ref.current.value.trim();
    if (
      value === "" ||
      (minValue !== undefined && parseFloat(value) < minValue)
    ) {
      setInvalidFields((prev) => ({ ...prev, [fieldName]: true }));
      ref.current.focus();
      toast.error(errorMessage);
      return false;
    }
    setInvalidFields((prev) => ({ ...prev, [fieldName]: false }));
    return true;
  };

  // ***** FUNCTION TO SUBMIT EDITED DATA *****
  const newSubmit = () => {
    const totalParking =
      parseFloat(frontRef.current.value) +
      parseFloat(basementRef.current.value);

    // if (stateRef.current.value === "" || districtRef.current.value === "" || cityRef.current.value === "" || populationRef.current.value === "" || bikePassRef.current.value === "" || carPassRef.current.value === "" || marketNameRef.current.value === "" || gcordinatesRef.current.value === "") {
    //   toast.error("All starred fields are mandatory!")
    // }

    // llrate, totalParking,
    if (totalParking < 2000) {
      toast.error(
        "Sum of front and basement parking must be greater than or equal to 2000 sqft."
      );
      return false;
    }

    if (stateRef.current.value === "") {
      toast.error("State is mandatory");
      return false;
    } else if (districtRef.current.value === "") {
      toast.error("district is mandatory");
      return false;
    } else if (cityRef.current.value === "") {
      toast.error("city is mandatory");
      return false;
    } else if (populationRef.current.value === 0) {
      toast.error("population is mandatory");
      return false;
    } else if (carPassRef.current.value === 0) {
      toast.error("car pass per hrs is mandatory");
      return false;
    } else if (bikePassRef.current.value === 0) {
      toast.error("bike pass per hrs is mandatory");
      return false;
    } else if (footfallRef.current.value === 0) {
      toast.error("footfall per hrs is mandatory");
      return false;
    } else if (rWidthRef.current.value < 30) {
      toast.error("road width must be 30ft.");
      return false;
    } else if (llRateRef.current.value > 100) {
      toast.error("Landlord rate must be less than 100psf.");
      return false;
    } else if (marketNameRef.current.value === "") {
      toast.error("market name is mandatory");
      return false;
    } else if (frontageRef.current.value < 35) {
      toast.error("frontage must be greater than 35ft.");
      return false;
    } else if (totalAreaRef.current.value < 9000) {
      toast.error("total area must be greater than 9000sqft.");
      return false;
    } else if (
      (groundFlrRef.current.value &&
        groundFlrRef.current.value !== "0" &&
        groundFlrRef.current.value < 3000) ||
      (firstRef.current.value &&
        firstRef.current.value !== "0" &&
        firstRef.current.value < 3000) ||
      (secondRef.current.value &&
        secondRef.current.value !== "0" &&
        secondRef.current.value < 3000) ||
      (thirdRef.current.value &&
        thirdRef.current.value !== "0" &&
        thirdRef.current.value < 3000) ||
      (fourthRef.current.value &&
        fourthRef.current.value !== "0" &&
        fourthRef.current.value < 3000) ||
      (fifthRef.current.value &&
        fifthRef.current.value !== "0" &&
        fifthRef.current.value < 3000)
    ) {
      toast.error("floors must be greater than 3000sqft.");
      return false;
    } else if (gcordinatesRef.current.value === "") {
      toast.error("google coordinates are mandatory");
      return false;
    }
    // return

    // if (
    //   isNaN(parseFloat(totalAreaRef.current.value)) ||
    //   isNaN(parseFloat(groundFlrRef.current.value)) ||
    //   isNaN(parseFloat(frontageRef.current.value)) ||
    //   (llRateRef.current.value !== "" && isNaN(parseFloat(llRateRef.current.value))) ||
    //   isNaN(parseFloat(totalParking)) ||
    //   isNaN(parseFloat(rWidthRef.current.value))
    // ) {
    //   toast.error("Please check if total area, ground floor, frontage, landlord rate, total parking or road width are null.")
    //   return false;
    // } else if (totalAreaRef.current.value < 9000) {
    //   toast.error("Property Total Area should be minimum 9000 sqft.")
    //   return false;
    // } else if (
    //   groundFlrRef.current.value < 3000 ||
    //   (firstRef.current.value && firstRef.current.value !== "0" && firstRef.current.value < 3000) ||
    //   (secondRef.current.value && secondRef.current.value !== "0" && secondRef.current.value < 3000) ||
    //   (thirdRef.current.value && thirdRef.current.value !== "0" && thirdRef.current.value < 3000) ||
    //   (fourthRef.current.value && fourthRef.current.value !== "0" && fourthRef.current.value < 3000) ||
    //   (fifthRef.current.value && fifthRef.current.value !== "0" && fifthRef.current.value < 3000)
    // ) {
    //   toast.error("Floor must be greater than 3000 sqft when provided.")
    //   return false;
    // } else if (frontageRef.current.value < 35) {
    //   toast.error("Frontage must be greater than or equal to 35 ft.")
    //   return false;
    // } else if (
    //   llRateRef.current.value !== "" && llRateRef.current.value > 100
    // ) {
    //   toast.error("Landlord Rate must be less than or equal to 100 psf.")
    //   return false;
    // } else if (totalParking < 2000) {
    //   toast.error("Sum of front and basement parking must be greater than or equal to 2000 sqft.")
    //   return false;
    // } else if (rWidthRef.current.value < 30) {
    //   toast.error("Road width must be greater than or equal to 30 ft.")
    //   return false;
    // }
    // return;

    const handleNumberFieldsValidation = (e) => {
      if (!isFieldsEditable) return;

      const allowedKeys = [
        "Backspace",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Home",
        "End",
      ];

      const inputValue = e.currentTarget.value;
      const key = e.key;

      // Allow control keys
      if (allowedKeys.includes(key)) return;

      // Allow only one dot
      if (key === "." && inputValue.includes(".")) {
        e.preventDefault();
        return;
      }

      // Allow only one '%' and only at the end
      if (key === "%") {
        if (
          inputValue.includes("%") ||
          e.currentTarget.selectionStart !== inputValue.length
        ) {
          e.preventDefault();
        }
        return;
      }

      // Allow digits
      if (/^\d$/.test(key)) return;

      // Block everything else
      e.preventDefault();
    };

    const formData1 = new FormData();
    formData1.append("State", formData.stateName);
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
    formData1.append("Broker_Name", bNameRef.current.value);
    formData1.append("Broker_M_No", bMobileRef.current.value);
    formData1.append('Borker_Email',bEmailRef.current.value)
    formData1.append("Landlord_Name", LNameRef.current.value);
    formData1.append("Landlord_M_No", LMobileRef.current.value);
    formData1.append("Landlord_Email", LEmailRef.current.value);
    formData1.append("Road_width", rWidthRef.current.value);
    formData1.append("Road_Condition", rConditionRef.current.value);
    formData1.append("SiteId", rowData?.siteID);
    formData1.append("ForUpdate", Boolean(true));
    formData1.append("UpdatedBy", sessionStorage.getItem("firstname"));
    formData1.append("PropertyCeilingHeight", ceilHeightRef.current.value);
    formData1.append("Competitors3KMRadius", noCompRef.current.value);
    formData1.append("LocationPreference", preferenceRef.current.value);
    formData1.append("LockinPeriod", lockinRef.current.value);
    formData1.append("Deposit", depositRef.current.value);
    formData1.append("CapexFromLandlord", capexRef.current.value);
    formData1.append("PowerSupply", powerRef.current.value);
    formData1.append("RoadTrafficPerHour", roadTrafficRef.current.value);
    // new adds
    formData1.append(
      "DISTRICT_POPULATION",
      districtPopulationRef.current.value
    );
    formData1.append("CITY_POPULATION", cityPopulationRef.current.value);
    formData1.append(
      "DISTT_POPULATION_PER_KM",
      districtPopulationPerKmRef.current.value
    );
    formData1.append(
      "CITY_POPULATION_PER_KM",
      cityPopulationPerKmRef.current.value
    );
    formData1.append("LITERACY_RATE", literactyRateRef.current.value);
    formData1.append(
      "NO_OF_SCHOOL_WITH_IN_10_KM",
      noOfSchoolIn10KmRef.current.value
    );
    formData1.append(
      "NO_OF_COLLEGE_UNIVERSITY_WITH_IN_10_KM",
      noOfCollegeUniversityIn10KmRef.current.value
    );
    formData1.append(
      "AVRAGE_HOUSEHOLD_INCOME_DISTT",
      avgHouseholdIncomeDistRef.current.value
    );
    formData1.append("NO_OF_ATM_IN_THIS_CITY", onOfATMInCityRef.current.value);
    formData1.append(
      "NO_OF_BANK_BRANCH_IN_CITY",
      noOfBankBranchInCityRef.current.value
    );
    formData1.append(
      "NO_OF_INDUSTIRES_FACTORY_IN_CITY",
      noOfIndustriesFactoryInCityRef.current.value
    );
    formData1.append(
      "UNEMPLOYEMENT_RATE_IN_CITY",
      unemployeementRateInCityRef.current.value
    );
    formData1.append(
      "DISTANCE_FROM_RAILWAYSTATION",
      distanceFromRailwayStationRef.current.value
    );
    formData1.append(
      "DISTANCE_FROM_BUS_TERMINAL",
      distanceFromBusTerminalRef.current.value
    );
    formData1.append(
      "NO_OF_4_WHEELER_PASSING",
      noOf4WheelerPassingRef.current.value
    );
    formData1.append(
      "NO_OF_2_WHEELER_PASSING",
      noOf2WheelerPassingRef.current.value
    );
    formData1.append("NO_OF_SHOPPING_MALL", noOfShoppingMallRef.current.value);
    formData1.append(
      "NO_OF_MUTIPLEX_CINEMAS_IN_CITY",
      onOfMultiplexCinemaInCityRef.current.value
    );
    formData1.append(
      "PRESENCE_OF_FOOD_COURT",
      presenceOfFoodCourtRef.current.value
    );

    setLoading(true);
    axios
      // .post(`${baseUrl}/api/Site/AddSite`, formData1, {
      .post(`${baseUrl}/api/Site/AddSiteNew`, formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(res?.data?.message || "Inserted successfully!");
        navigate(previousLocation);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to submit!"
        );
        setLoading(false);
      });
  };

  const [newData, setNewData] = useState({});
  const fetchData = async () => {
    setLoading(true);
    await axios
      .get(
        `${baseUrl}/api/BrokerSiteCreation/GetSiteDataNew?roleId=${parseInt(
          roleId
        )}&userId=${parseInt(id)}&username=${emailid}`
      )
      .then((response) => {
        setLoading(false);
        const res = response?.data?.data.filter(
          (row) => parseInt(row?.siteID) === parseInt(rowData?.siteID)
        );
        setSiteProofs([...res[0]?.siteProofs]);
        setNewData(res[0]);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (roleId && id) {
      fetchData();
    }
  }, []);

  // ***** automatically hide api error after 2 seconds *****
  useEffect(() => {
    if (showApiError) {
      const timer = setTimeout(() => setShowApiError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    calculateRank();
  }, []);

  return (
    <div className={styles.container}>
      {loading && <Loader />}

      {/* ***** SHOW ERROR ***** */}
      {showApiError && <div className="api_error">{apiError}</div>}

      {/* ***** BUTTONS DIV ***** */}
      <div className={styles.btns_div}>
        {(rowData?.status === "PENDING" && roleId == 2|| 
          (rowData?.adminStatus === "PENDING" && roleId == 1) ||
          (rowData?.superAdminStatus === "PENDING" && roleId == 3)) && (
          <span
            className={`${styles.btns} ${styles.btn_primary}`}
            onClick={handleApproveModalOpen}
          >
            Approve
          </span>
        )}

        {(rowData?.status === "PENDING" && roleId == 2||
          (rowData?.adminStatus === "PENDING" && roleId == 1) ||
          (rowData?.superAdminStatus === "PENDING" && roleId == 3)) && (
          <span
            className={`${styles.btns} ${styles.btn_danger}`}
            onClick={handleRejectModalOpen}
          >
            Reject
          </span>
        )}

        <span
          className={`${styles.btns} ${styles.btn_secondary}`}
          onClick={() => handleViewProofsCarouselOpen(false)}
        >
          View Proofs
        </span>

        {rowData?.status === "APPROVED" &&
          <span
          className={`${styles.btns} ${styles.btn_secondary}`}
          onClick={() => handleViewProofsCarouselOpen(true)} 
        >
          View Documents
        </span>}

        {rowData?.status !== "PENDING" && (
          <span
            className={`${styles.btns} ${styles.btn_secondary}`}
            onClick={handleViewRemarksModalOpen}
          >
            View Remarks
          </span>
        )}

        {/* {rowData?.status === "PENDING" && (
        )} */}
        {((rowData?.status === "APPROVED"  ) && ["4","5"].includes(roleId) ||  
          rowData?.status === "PENDING" && roleId == 2||
          (rowData?.adminStatus === "PENDING" && roleId == 1) ||
          (rowData?.superAdminStatus === "PENDING" && roleId == 3)) && (
          <span
            className={`${styles.btns} ${styles.btn_primary}`}
            onClick={handleAddProofsModalOpen}
          >
            {(rowData?.status === "APPROVED" ||  rowData?.adminStatus === "APPROVED") && ["4","5"].includes(roleId) ? "Add Documents" : "Add Proofs"}
          </span>
        )}

        {( (rowData?.status === "PENDING" &&  ["4","5"].includes(roleId)) || //EDIT FORM WHEN STATUS PENDING
          (rowData?.status === "PENDING" && roleId == 2) ||
          (rowData?.adminStatus === "PENDING" && roleId == 1) ||
          (rowData?.superAdminStatus === "PENDING" && roleId == 3)) ? (
          !isFieldsEditable ? (
            <span
              className={`${styles.btns} ${styles.btn_primary}`}
              onClick={toggleFieldsEdit}
            >
              Edit
            </span>
          ) : (
            <>
              <button
                className={`${styles.btns} ${styles.btn_primary}`}
                onClick={newSubmit}
                disabled={loading}
              >
                Submit
              </button>
              <span
                className={`${styles.btns} ${styles.btn_danger}`}
                onClick={toggleFieldsEdit}
              >
                Cancel
              </span>
            </>
          )
        ) : (
          <></>
        )}

        <button
          className={`${styles.btns} ${styles.btn_primary}`}
          style={{
            backgroundColor: "#0d6efd",
          }}
          onClick={handleTCModalOpen}
        >
          <IoIosInformationCircle size={18} className="me-1" />
          info
        </button>
      </div>

      {/* ***** FORM DIV ***** */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          {/* <button
            className="btn btn-primary"
            type="button"
            style={{ backgroundColor: "rgb(13, 110, 253)" }}
            // onClick={fetchGeoLocation}
          >
            Fetch Location
          </button> */}
        </div>
        <div className={styles.form_div}>
          <form className={styles.form}>
            <div className={styles.form_group}>
              <label htmlFor="stateName">RM Name:ss</label>
              <input readOnly value={rowData?.rmByName} />
            </div>

            <div
              className={`${styles.form_group}`}
              style={{ position: "relative" }}
            >
              <label htmlFor="stateName">
                State Name:
                <span style={{ color: "red" }}>*</span>
              </label>
              {isFieldsEditable ? (
                <>
                  <Select
                    name="stateName"
                    value={stateOptions.find(
                      (option) => option.value === formData.stateName
                    )}
                    onChange={handleStateNameChange}
                    options={stateOptions}
                    isClearable
                    placeholder="Select State"
                    styles={{ customStyles }}
                    ref={stateRef}
                  />
                </>
              ) : (
                <input
                  readOnly={!isFieldsEditable}
                  type="text"
                  id="stateName"
                  value={
                    isFieldsEditable ? formData.stateName : rowData?.state || ""
                  }
                  className={isFieldsEditable ? "" : styles.highlighted}
                />
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="districtName">
                District Name:
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="districtName"
                value={
                  isFieldsEditable
                    ? formData.districtName
                    : rowData?.district_Name || ""
                }
                // onChange={handleFormDataChange}
                onChange={handleDistrictNameChange}
                ref={districtRef}
                className={isFieldsEditable ? "" : styles.highlighted}
              />
              {suggestions.length > 0 && (
                <ul
                  className="list-group"
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    backgroundColor: "white",
                    maxHeight: "15rem",
                    overflow: "auto",
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: "pointer" }}
                    >
                      {suggestion.districtName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="city">
                City:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="city"
                value={isFieldsEditable ? formData.city : rowData?.city || ""}
                onChange={handleFormDataChange}
                ref={cityRef}
                className={isFieldsEditable ? "" : styles.highlighted}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="population">
                Population:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="population"
                value={
                  isFieldsEditable
                    ? formData.population
                    : rowData?.population || ""
                }
                onChange={handleFormDataChange}
                ref={populationRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="carPassPerHrs">
                Car Pass Per Hrs:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                readOnly={!isFieldsEditable}
                type="text"
                id="carPassPerHrs"
                value={
                  isFieldsEditable
                    ? formData.carPassPerHrs
                    : rowData?.car_Pass_Per_HRS || ""
                }
                onChange={handleFormDataChange}
                ref={carPassRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="bikePassPerHrs">
                Bike Pass Per Hrs:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="bikePassPerHrs"
                value={
                  isFieldsEditable
                    ? formData.bikePassPerHrs
                    : rowData?.bike_Pass_Per_HRS || ""
                }
                onChange={handleFormDataChange}
                ref={bikePassRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="footfallPerHrs">
                Footfall Per Hrs:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="footfallPerHrs"
                value={
                  isFieldsEditable
                    ? formData.footfallPerHrs
                    : rowData?.footfall_Per_HRS || ""
                }
                onChange={handleFormDataChange}
                ref={footfallRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="roadWidth">
                Road Width (ft):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="roadWidth"
                value={
                  isFieldsEditable
                    ? formData.roadWidth
                    : rowData?.road_Width || ""
                }
                onChange={handleFormDataChange}
                ref={rWidthRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="roadCondition">Road Condition:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="roadCondition"
                value={
                  isFieldsEditable
                    ? formData.roadCondition
                    : rowData?.road_Condition || ""
                }
                onChange={handleFormDataChange}
                ref={rConditionRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="llRate">
                Landlord Rate (psf):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="llRate"
                value={
                  isFieldsEditable ? formData.llRate : rowData?.lL_Rate || ""
                }
                onChange={handleFormDataChange}
                ref={llRateRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={isFieldsEditable ? "" : styles.highlighted}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="siteType">Site Type:</label>
              {!isFieldsEditable ? (
                <input
                  // disabled={!isFieldsEditable}
                  readOnly
                  type="text"
                  id="llRate"
                  value={rowData?.site_Type || ""}
                  className={isFieldsEditable ? "" : styles.highlighted}
                />
              ) : (
                <select
                  id="siteType"
                  readOnly={!isFieldsEditable}
                  value={
                    isFieldsEditable
                      ? formData.siteType
                      : rowData?.site_Type || ""
                  }
                  onChange={handleFormDataChange}
                  ref={siteTypeRef}
                >
                  <option value="none">Select</option>
                  <option value="RTM">RTM</option>
                  <option value="BTS">BTS</option>
                  <option value="S-BTS">S-BTS</option>
                </select>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="marketName">
                Market Name:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="marketName"
                value={
                  isFieldsEditable ? formData.marketName : rowData?.market || ""
                }
                onChange={handleFormDataChange}
                ref={marketNameRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="frontage">
                Frontage (ft):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="frontage"
                value={
                  isFieldsEditable ? formData.frontage : rowData?.frontage || ""
                }
                onChange={handleFormDataChange}
                ref={frontageRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={isFieldsEditable ? "" : styles.highlighted}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="propertyCeilHeight">
                Property Ceil Height (ft)
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="propertyCeilHeight"
                value={
                  isFieldsEditable
                    ? formData.propertyCeilHeight
                    : rowData?.propertyCeilingHeight || ""
                }
                onChange={handleFormDataChange}
                ref={ceilHeightRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="totalArea">
                Total Area (sqft):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="totalArea"
                value={
                  isFieldsEditable
                    ? formData.totalArea
                    : rowData?.total_area || ""
                }
                onChange={handleFormDataChange}
                ref={totalAreaRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={isFieldsEditable ? "" : styles.highlighted}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="lgf">LGF:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="lgf"
                value={isFieldsEditable ? formData.lgf : rowData?.lgf || ""}
                onChange={handleFormDataChange}
                ref={lgfRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="ugf">UGF:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="ugf"
                value={isFieldsEditable ? formData.ugf : rowData?.ugf || ""}
                onChange={handleFormDataChange}
                ref={ugfRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="groundFloor">
                Ground Floor (sqft):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="groundFloor"
                value={
                  isFieldsEditable
                    ? formData.groundFloor
                    : rowData?.ground_floor || ""
                }
                onChange={handleFormDataChange}
                ref={groundFlrRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable || rowData?.ground_floor === ""
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="firstFloor">First Floor (sqft):</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="firstFloor"
                value={
                  isFieldsEditable
                    ? formData.firstFloor
                    : rowData?.first_Floor || ""
                }
                onChange={handleFormDataChange}
                ref={firstRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.first_Floor === "" ||
                  rowData?.first_Floor === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="secondFloor">Second Floor (sqft):</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="secondFloor"
                value={
                  isFieldsEditable
                    ? formData.secondFloor
                    : rowData?.second_Floor || ""
                }
                onChange={handleFormDataChange}
                ref={secondRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.second_Floor === "" ||
                  rowData?.second_Floor === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="thirdFloor">Third Floor (sqft):</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="thirdFloor"
                value={
                  isFieldsEditable
                    ? formData.thirdFloor
                    : rowData?.third_floor || ""
                }
                onChange={handleFormDataChange}
                ref={thirdRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.third_floor === "" ||
                  rowData?.third_floor === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="fourthFloor">Fourth Floor (sqft):</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="fourthFloor"
                value={
                  isFieldsEditable
                    ? formData.fourthFloor
                    : rowData?.forth_Floor || ""
                }
                onChange={handleFormDataChange}
                ref={fourthRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.forth_Floor === "" ||
                  rowData?.forth_Floor === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="fifthFloor">Fifth Floor (sqft):</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="fifthFloor"
                value={
                  isFieldsEditable
                    ? formData.fifthFloor
                    : rowData?.fifth_Floor || ""
                }
                onChange={handleFormDataChange}
                ref={fifthRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.fifth_Floor === "" ||
                  rowData?.fifth_Floor === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="basementParking">
                Basement Parking (sqft):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="basementParking"
                value={
                  isFieldsEditable
                    ? formData.basementParking
                    : rowData?.basement_Parking || ""
                }
                onChange={handleFormDataChange}
                ref={basementRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.basement_Parking === "" ||
                  rowData?.basement_Parking === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="frontParking">
                Front Parking (sqft):<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="frontParking"
                value={
                  isFieldsEditable
                    ? formData.frontParking
                    : rowData?.front_Parking || ""
                }
                onChange={handleFormDataChange}
                ref={frontRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
                className={
                  isFieldsEditable ||
                  rowData?.front_Parking === "" ||
                  rowData?.front_Parking === null
                    ? ""
                    : styles.highlighted
                }
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="googleCoordinates">
                Google Coordinates:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="googleCoordinates"
                value={
                  isFieldsEditable
                    ? formData.googleCoordinates
                    : rowData?.google_Coordinates || ""
                }
                onChange={handleFormDataChange}
                ref={gcordinatesRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="remarks">Remarks:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="remarks"
                value={
                  isFieldsEditable ? formData.remarks : rowData?.remarks || ""
                }
                onChange={handleFormDataChange}
                ref={remarksRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noCompetitors">No of Competitors</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="noCompetitors"
                value={
                  isFieldsEditable
                    ? formData.noCompetitors
                    : rowData?.competitors3KMRadius || ""
                }
                onChange={handleFormDataChange}
                ref={noCompRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="competitorName">Competitor Name:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="competitorName"
                value={
                  isFieldsEditable
                    ? formData.competitorName
                    : rowData?.competitors || ""
                }
                onChange={handleFormDataChange}
                ref={compNameRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="competitorSale">Competitor Sale:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="competitorSale"
                value={
                  isFieldsEditable
                    ? formData.competitorSale
                    : rowData?.competitors_Sale || ""
                }
                onChange={handleFormDataChange}
                ref={compSaleRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="brokerName">Broker Name:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="brokerName"
                value={
                  isFieldsEditable
                    ? formData.brokerName
                    : rowData?.broker_Name || ""
                }
                onChange={handleFormDataChange}
                ref={bNameRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="brokerMNo">Broker Mobile No:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="brokerMNo"
                value={
                  isFieldsEditable
                    ? formData.brokerMNo
                    : rowData?.broker_M_No || ""
                }
                onChange={handleFormDataChange}
                ref={bMobileRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="brokerEmail">Broker Email:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="email"
                id="brokerEmail"
                value={
                  isFieldsEditable
                    ? formData.brokerEmail
                    : rowData?.broker_Email || ""
                }
                onChange={handleFormDataChange}
                ref={bEmailRef}
                // onInput={(e) => {
                //   e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                // }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="landlordName">Landlord Name:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="landlordName"
                value={
                  isFieldsEditable
                    ? formData.landlordName
                    : rowData?.landlord_Name || ""
                }
                onChange={handleFormDataChange}
                ref={LNameRef}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="landlordMNo">Landlord Mobile No:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="landlordMNo"
                value={
                  isFieldsEditable
                    ? formData.landlordMNo
                    : rowData?.landlord_M_No || ""
                }
                onChange={handleFormDataChange}
                ref={LMobileRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="landlordEmail">Landlord Email:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="email"
                id="landlordEmail"
                value={
                  isFieldsEditable
                    ? formData.landlordEmail
                    : rowData?.landlord_Email || ""
                }
                onChange={handleFormDataChange}
                ref={LEmailRef}
                // onInput={(e) => {
                //   e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                // }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="capexLandlord">Capex from Landlord (cost):</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="capexLandlord"
                value={
                  isFieldsEditable
                    ? formData.capexLandlord
                    : rowData?.capexFromLandlord || ""
                }
                onChange={handleFormDataChange}
                ref={capexRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="locationPreference">Location Preference:</label>
              {!isFieldsEditable ? (
                <input
                  // disabled={!isFieldsEditable}
                  readOnly
                  type="text"
                  id="locationPreference"
                  value={rowData?.locationPreference || ""}
                />
              ) : (
                <select
                  id="locationPreference"
                  readOnly={!isFieldsEditable}
                  value={
                    isFieldsEditable
                      ? formData.locationPreference
                      : rowData?.locationPreference || ""
                  }
                  onChange={handleFormDataChange}
                  ref={preferenceRef}
                >
                  <option value="none">Select</option>
                  <option value="high-street">High Street</option>
                  <option value="mall">Mall</option>
                  <option value="residential">Residential</option>
                </select>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="powerSupply">Power Supply:</label>
              {!isFieldsEditable ? (
                <input
                  readOnly={!isFieldsEditable}
                  type="text"
                  id="powerSupply"
                  value={rowData?.powerSupply || ""}
                />
              ) : (
                <select
                  id="powerSupply"
                  onChange={handleFormDataChange}
                  ref={powerRef}
                >
                  <option value="none">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="lockinPeriod">Lockin Period:</label>
              {!isFieldsEditable ? (
                <input
                  readOnly
                  type="text"
                  id="lockinPeriod"
                  value={rowData?.lockinPeriod || ""}
                />
              ) : (
                <select
                  id="lockinPeriod"
                  readOnly={!isFieldsEditable}
                  value={
                    isFieldsEditable
                      ? formData.lockinPeriod
                      : rowData?.lockinPeriod || ""
                  }
                  onChange={handleFormDataChange}
                  ref={lockinRef}
                >
                  <option value="none">Select</option>
                  <option value="no-lockin">No Lockin Period</option>
                  <option value="1">1yr Lockin Period</option>
                  <option value="1.5">18 Months Lockin Period</option>
                </select>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="deposit">Deposit (months)</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="deposit"
                value={
                  isFieldsEditable ? formData.deposit : rowData?.deposit || ""
                }
                onChange={handleFormDataChange}
                ref={depositRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="roadTraffic">Road Traffic:</label>
              <input
                // disabled={!isFieldsEditable}
                readOnly={!isFieldsEditable}
                type="text"
                id="roadTraffic"
                value={
                  isFieldsEditable
                    ? formData.roadTraffic
                    : rowData?.roadTrafficPerHour || ""
                }
                onChange={handleFormDataChange}
                ref={roadTrafficRef}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                }}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="districtPopulation">District Population:</label>
              <input
                readOnly={!isFieldsEditable}
                type="text"
                id="districtPopulation"
                value={
                  isFieldsEditable
                    ? formData.districtPopulation
                    : rowData?.districT_POPULATION || ""
                }
                onChange={handleFormDataChange}
                ref={districtPopulationRef}
                pattern="^\d*\.?\d*%?$"
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="cityPopulation">City Population:</label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="cityPopulation"
                value={
                  isFieldsEditable
                    ? formData.cityPopulation
                    : rowData?.citY_POPULATION || ""
                }
                onChange={handleFormDataChange}
                ref={cityPopulationRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="districtPopulationPerKm">
                Distt Population Per Km:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="districtPopulationPerKm"
                value={
                  isFieldsEditable
                    ? formData.districtPopulationPerKm
                    : rowData?.distT_POPULATION_PER_KM || ""
                }
                onChange={handleFormDataChange}
                ref={districtPopulationPerKmRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="cityPopulationPerKm">
                City Population Per Km:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="cityPopulationPerKm"
                value={
                  isFieldsEditable
                    ? formData.cityPopulationPerKm
                    : rowData?.citY_POPULATION_PER_KM || ""
                }
                onChange={handleFormDataChange}
                ref={cityPopulationPerKmRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="literactyRate">Literacy Rate:</label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="literactyRate"
                value={
                  isFieldsEditable
                    ? formData.literactyRate
                    : rowData?.literacY_RATE || ""
                }
                onChange={handleFormDataChange}
                ref={literactyRateRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOfSchoolIn10Km">
                No. of School Within 10km:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOfSchoolIn10Km"
                value={
                  isFieldsEditable
                    ? formData.noOfSchoolIn10Km
                    : rowData?.nO_OF_SCHOOL_WITH_IN_10_KM || ""
                }
                onChange={handleFormDataChange}
                ref={noOfSchoolIn10KmRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOfCollegeUniversityIn10Km">
                No. of College/University Within 10km:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOfCollegeUniversityIn10Km"
                value={
                  isFieldsEditable
                    ? formData.noOfCollegeUniversityIn10Km
                    : rowData?.nO_OF_COLLEGE_UNIVERSITY_WITH_IN_10_KM || ""
                }
                onChange={handleFormDataChange}
                ref={noOfCollegeUniversityIn10KmRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="avgHouseholdIncomeDist">
                Average Household Income District:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="avgHouseholdIncomeDist"
                value={
                  isFieldsEditable
                    ? formData.avgHouseholdIncomeDist
                    : rowData?.avragE_HOUSEHOLD_INCOME_DISTT || ""
                }
                onChange={handleFormDataChange}
                ref={avgHouseholdIncomeDistRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="onOfATMInCity">No. of ATM in City:</label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="onOfATMInCity"
                value={
                  isFieldsEditable
                    ? formData.onOfATMInCity
                    : rowData?.nO_OF_ATM_IN_THIS_CITY || ""
                }
                onChange={handleFormDataChange}
                ref={onOfATMInCityRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOfBankBranchInCity">
                No. of Bank Branch in City:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOfBankBranchInCity"
                value={
                  isFieldsEditable
                    ? formData.noOfBankBranchInCity
                    : rowData?.nO_OF_BANK_BRANCH_IN_CITY || ""
                }
                onChange={handleFormDataChange}
                ref={noOfBankBranchInCityRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOfIndustriesFactoryInCity">
                No. of Industries/Factory in City:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOfIndustriesFactoryInCity"
                value={
                  isFieldsEditable
                    ? formData.noOfIndustriesFactoryInCity
                    : rowData?.nO_OF_INDUSTIRES_FACTORY_IN_CITY || ""
                }
                onChange={handleFormDataChange}
                ref={noOfIndustriesFactoryInCityRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="unemployeementRateInCity">
                Unemployment Rate in City:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="unemployeementRateInCity"
                value={
                  isFieldsEditable
                    ? formData.unemployeementRateInCity
                    : rowData?.unemployemenT_RATE_IN_CITY || ""
                }
                onChange={handleFormDataChange}
                ref={unemployeementRateInCityRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="distanceFromRailwayStation">
                Distance From Railway Station:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="distanceFromRailwayStation"
                value={
                  isFieldsEditable
                    ? formData.distanceFromRailwayStation
                    : rowData?.distancE_FROM_RAILWAYSTATION || ""
                }
                onChange={handleFormDataChange}
                ref={distanceFromRailwayStationRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="distanceFromBusTerminal">
                Distance From Bus Terminal:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="distanceFromBusTerminal"
                value={
                  isFieldsEditable
                    ? formData.distanceFromBusTerminal
                    : rowData?.distancE_FROM_BUS_TERMINAL || ""
                }
                onChange={handleFormDataChange}
                ref={distanceFromBusTerminalRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOf4WheelerPassing">
                No. of 4 Wheeler Passing:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOf4WheelerPassing"
                value={
                  isFieldsEditable
                    ? formData.noOf4WheelerPassing
                    : rowData?.nO_OF_4_WHEELER_PASSING || ""
                }
                onChange={handleFormDataChange}
                ref={noOf4WheelerPassingRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOf2WheelerPassing">
                No. of 2 Wheeler Passing:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOf2WheelerPassing"
                value={
                  isFieldsEditable
                    ? formData.noOf2WheelerPassing
                    : rowData?.nO_OF_2_WHEELER_PASSING || ""
                }
                onChange={handleFormDataChange}
                ref={noOf2WheelerPassingRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="noOfShoppingMall">No. of Shopping Mall:</label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="noOfShoppingMall"
                value={
                  isFieldsEditable
                    ? formData.noOfShoppingMall
                    : rowData?.nO_OF_SHOPPING_MALL || ""
                }
                onChange={handleFormDataChange}
                ref={noOfShoppingMallRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="onOfMultiplexCinemaInCity">
                No. of Multiplex Cinema In City:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="onOfMultiplexCinemaInCity"
                value={
                  isFieldsEditable
                    ? formData.onOfMultiplexCinemaInCity
                    : rowData?.nO_OF_MUTIPLEX_CINEMAS_IN_CITY || ""
                }
                onChange={handleFormDataChange}
                ref={onOfMultiplexCinemaInCityRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="presenceOfFoodCourt">
                Presence of Food Court:
              </label>
              <input
                pattern="^\d*\.?\d*%?$"
                readOnly={!isFieldsEditable}
                type="text"
                id="presenceOfFoodCourt"
                value={
                  isFieldsEditable
                    ? formData.presenceOfFoodCourt
                    : rowData?.presencE_OF_FOOD_COURT || ""
                }
                onChange={handleFormDataChange}
                ref={presenceOfFoodCourtRef}
                onKeyDown={handleNumberFieldsValidation}
              />
            </div>
          </form>
        </div>
      </div>

      {/* ***** MODALS AND CAROUSELS ***** */}

      {/* ***** APPROVE MODAL ***** */}
      {approveModal && (
        <ReusableModal
          isModalOpen={approveModal}
          handleModalClose={handleApproveModalClose}
          title={"Approve Form"}
          height="50vh"
          width="50vw"
          titleColor="#0d6efd"
        >
          <form className={styles.approve_form}>
            <div className={styles.approve_form_div}>
              <label htmlFor="zone">Zone</label>
              <input
                type="text"
                id="zone"
                value={approveFormData.zone}
                onChange={handleApproveFormChange}
              />
            </div>

            <div className={styles.approve_form_div}>
              <label htmlFor="v2rate">V2-Rate</label>
              <input
                type="text"
                id="v2rate"
                value={approveFormData.v2rate}
                onChange={handleApproveFormChange}
              />
            </div>

            <div className={styles.approve_form_div}>
              <label htmlFor="rank">Rank</label>
              <input type="text" id="rank" value={rank || ""} disabled />
            </div>
            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
              style={{
                backgroundColor: "#0d6efd",
              }}
            >
              Calculate rank
            </button>

            <div className="collapse" id="collapseExample">
              <div className="card card-body">
                <div className={styles.form_div_rank}>
                  <div className={styles.form_group}>
                    <label htmlFor="llRate1">Landlord Rate (psf):</label>
                    <input
                      type="text"
                      id="llRate1"
                      value={formData.llRate}
                      onChange={handleFormDataChange}
                      ref={llRateRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="appDeposit">Deposit (months)</label>
                    <input
                      type="text"
                      id="appDeposit"
                      defaultValue={formData.appDeposit}
                      onChange={handleFormDataChange}
                      // ref={depositRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="basementParking1">
                      Basement Parking (sqft):
                    </label>
                    <input
                      type="text"
                      id="basementParking1"
                      value={formData.basementParking}
                      onChange={handleFormDataChange}
                      ref={basementRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="frontParking1">Front Parking (sqft):</label>
                    <input
                      type="text"
                      id="frontParking1"
                      value={formData.frontParking}
                      onChange={handleFormDataChange}
                      ref={frontRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="siteType1">Site Type:</label>
                    <select
                      id="siteType1"
                      readOnly={!isFieldsEditable}
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
                    <label htmlFor="frontage1">Frontage (ft):</label>
                    <input
                      type="text"
                      id="frontage1"
                      value={formData.frontage}
                      onChange={handleFormDataChange}
                      ref={frontageRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="groundFloor1">Ground Floor (sqft):</label>
                    <input
                      type="text"
                      id="groundFloor1"
                      value={formData.groundFloor}
                      onChange={handleFormDataChange}
                      ref={groundFlrRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="population1">Population:</label>
                    <input
                      type="text"
                      id="population1"
                      value={formData.population}
                      onChange={handleFormDataChange}
                      ref={populationRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="propertyCeilHeight1">
                      Property Ceil Height (ft)
                    </label>
                    <input
                      ref={ceilHeightRef}
                      type="text"
                      id="propertyCeilHeight1"
                      value={formData.propertyCeilHeight}
                      onChange={handleFormDataChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="noCompetitors1">No of Competitors</label>
                    <input
                      type="text"
                      id="noCompetitors1"
                      value={formData.noCompetitors}
                      onChange={handleFormDataChange}
                      ref={noCompRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="capexLandlord1">
                      Capex from Landlord (cost):
                    </label>
                    <input
                      type="text"
                      id="capexLandlord1"
                      value={formData.capexLandlord}
                      onChange={handleFormDataChange}
                      ref={capexRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="locationPreference1">
                      Location Preference:
                    </label>
                    <select
                      id="locationPreference1"
                      readOnly={!isFieldsEditable}
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
                    <label htmlFor="powerSupply1">Power Supply:</label>
                    <select
                      id="powerSupply1"
                      onChange={handleFormDataChange}
                      ref={powerRef}
                    >
                      <option value="none">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="lockinPeriod1">Lockin Period:</label>
                    <select
                      id="lockinPeriod1"
                      readOnly={!isFieldsEditable}
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
                    <label htmlFor="roadWidth1">Road Width (ft):</label>
                    <input
                      type="text"
                      id="roadWidth1"
                      value={formData.roadWidth}
                      onChange={handleFormDataChange}
                      ref={rWidthRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="roadTraffic1">Road Traffic:</label>
                    <input
                      type="text"
                      id="roadTraffic1"
                      value={formData.roadTraffic}
                      onChange={handleFormDataChange}
                      ref={roadTrafficRef}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric and non-decimal characters
                      }}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="roadRanking">Road Ranking</label>
                    <select
                      id="roadRanking"
                      value={roadRanking}
                      onChange={(e) => setRoadRanking(e.target.value)}
                    >
                      <option value="none">Select</option>
                      <option value="main-road">Main Road</option>
                      <option value="main-road2">Main Road-2</option>
                      <option value="main-road3">Main Road-3</option>
                      <option value="connecting-road">Connecting Road</option>
                    </select>
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="marketRanking">Market Ranking</label>
                    <select
                      id="marketRanking"
                      value={marketRanking}
                      onChange={(e) => setMarketRanking(e.target.value)}
                    >
                      <option value="none">Select</option>
                      <option value="main-market">Main Market</option>
                      <option value="near-market">Near Market</option>
                      <option value="out-market">Out of Market</option>
                    </select>
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="incomeSource">Source of Income</label>
                    <select
                      id="incomeSource"
                      value={incomeSource}
                      onChange={(e) => setIncomeSource(e.target.value)}
                    >
                      <option value="none">Select</option>
                      <option value="option1">
                        Salaried, business, factories area, Agriculture
                      </option>
                      <option value="options2">
                        Salaried, Agriculture, Factories
                      </option>
                      <option value="option3">Salaried, Agriculture</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.approve_form_div}>
              <label htmlFor="approveRemarks">Remarks</label>
              <textarea
                name=""
                id="approveRemarks"
                cols="25"
                rows="2"
                value={approveFormData.approveRemarks}
                onChange={handleApproveFormChange}
              ></textarea>
            </div>

            <button
              type="button"
              className={styles.approve_form_submit}
              onClick={() => handleApproveRejectFormSubmit(true)}
            >
              Submit
            </button>
          </form>
        </ReusableModal>
      )}

      {/* ***** REJECT MODAL ***** */}
      {rejectModal && (
        <ReusableModal
          isModalOpen={rejectModal}
          handleModalClose={handleRejectModalClose}
          titleColor="#0d6efd"
          title={"Remarks"}
        >
          <form className={styles.reject_form}>
            <div className={styles.reject_form_div}>
              {/* <label htmlFor="rejectRemarks">Remarks</label> */}
              <textarea
                id="rejectRemarks"
                cols="45"
                rows="3"
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
              ></textarea>
            </div>

            <button
              type="button"
              className={styles.reject_form_submit}
              onClick={() => handleApproveRejectFormSubmit(false)}
            >
              Submit
            </button>
          </form>
        </ReusableModal>
      )}

      {/* ***** REJECT MODAL ***** */}
      {viewRemarksModal && (
        <ReusableModal
          isModalOpen={viewRemarksModal}
          handleModalClose={handleViewRemarksModalClose}
          titleColor="#0d6efd"
          // title={"Remarks"}
        >
          <form className={styles.reject_form}>
            <div className={styles.reject_form_div}>
              <label htmlFor="rejectRemarks">Remarks</label>
              <textarea
                cols="45"
                rows="3"
                disabled
                readOnly
                style={{ cursor: "not-allowed", resize: "none" }}
                value={
                  rowData?.actionremarks
                    ? rowData?.actionremarks
                    : rowData?.remarks
                }
              ></textarea>
            </div>
          </form>
        </ReusableModal>
      )}

      {/* ***** ADD PROOFS MODAL ***** */}
      {addProofsModal && (
        <ReusableModal
          isModalOpen={addProofsModal}
          handleModalClose={handleAddProofsModalClose}
          width="50vw"
          height={isMobile ? "80vh" : "90vh"}
        >
          {rowData?.status === "APPROVED" && ["4","5"].includes(roleId) ?  <AdditionalInfo {...{ rowData, previousLocation }} />:
          <div className={styles.addproofs_container}>
            <div className={styles.files_main_container}>
              {proofsList.map((proof, index) => {
                return (
                  <div
                    className={styles.file_container}
                    key={index}
                    style={{
                      marginBottom:
                        // proofFiles[proof.labelId]?.length > 0 ? "8rem" : "",
                        isAccordionOpen[proof.labelId] &&
                        proofFiles[proof.labelId]?.length > 0
                          ? "8rem"
                          : "0rem",
                    }}
                    onClick={() => toggleAccordion(proof.labelId)}
                  >
                    <label>
                      {proof.label}
                      {proof.required && (
                        <span className={styles.required}>*</span>
                      )}
                    </label>

                    {updatedSampleFiles[index].isSampleFileAvailable && (
                      <button
                        className={styles.view_sample_btn}
                        onClick={() => handleSampleModalOpen(proof.label)}
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
                          : `${proofFiles[proof.labelId].length} files`}
                      </small>

                      <label htmlFor={proof.labelId}>{proof.icon}</label>

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
                          {proofFiles[proof.labelId].map((file, idx) => {
                            const fileURL = URL.createObjectURL(file);
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
                                ) : file.type.includes("video") ? (
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
                                    deleteFileAccordion(e, proof.labelId, idx);
                                  }}
                                >
                                  {/* <MdDelete /> */}
                                  <ImCross />
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.addProofs_submit_btn}
              onClick={handleAddProofsSubmit}
              // disabled={rowData?.siteType !== "BTS" && !notProofFiles}
              style={{
                cursor: "pointer",
                // rowData?.siteType !== "BTS" && !notProofFiles
                //   ? "not-allowed"
                //   : "pointer",
              }}
            >
              Submit
            </button>
          </div>}
        </ReusableModal>
      )}

      {/* ***** TC MODAL ***** */}
      {tcModal && (
        <ReusableModal
          isModalOpen={tcModal}
          handleModalClose={handleTCModalClose}
          width="60vw"
          height="60vh"
          title={"Information"}
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

      {/* ***** VIEW PROOFS CAROUSEL ***** */}
      {viewProofsCarousel && (
        <ReCarousel
          handleCloseCarousel={handleViewProofsCarouselClose}
          apiFiles={siteProofs}
          siteID={rowData?.siteID}
          isAdditioinal={isAdditioinal}
        />
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

export default ViewDetails;
