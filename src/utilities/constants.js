import { FaFileImage } from "react-icons/fa";

// admin and super admin role ids
export const allowIds = ["1", "2", 1, 2]

export const status = {

    //  PENDING_FROM_RM : "PENDING_FROM_RM",
     PENDING_FROM_ADMIN : "PENDING_FROM_ADMIN",
     PENDING_FROM_LEGAL :"PENDING_FROM_LEGAL",
     APPROVED :"APPROVED",
     REJECTED : "REJECTED",
     PENDING: "PENDING",
     SHORTLISTED: "SHORTLISTED",
     PASSED : 'PASSED'

}

export const statuColor = {
    AMBER: "ffc107",
    GREEN: "green",
    RED: "red"
}

export const stateNames = [
    "ANDAMAN & NICOBAR ISLANDS",
    "ANDHRA PRADESH",
    "ARUNACHAL PRADESH",
    "ASSAM",
    "BIHAR",
    "CHANDIGARH",
    "CHHATTISGARH",
    "DADRA & NAGAR HAVELI",
    "DELHI",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL PRADESH",
    "JAMMU AND KASHMIR",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "LADAKH",
    "LAKSHADWEEP",
    "MADHYA PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUDUCHERRY",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTAR PRADESH",
    "UTTARAKHAND",
    "WEST BENGAL",
];

const districtNames = [
    "SRI POTTI SRIRAMULU NELLORE",
    "DR. B.R. AMBEDKAR KONASEEMA",
    "ALLURI SITHARAMA RAJU",
    "NORTH AND MIDDLE ANDAMAN",
    "KARBI ANGLONG",
];

export const proofsList = [
    {
        label: "Building Front",
        labelId: "buildingFrontFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Building Opposite",
        labelId: "buildingOppositeFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Building Left",
        labelId: "buildingLeftFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Building Right",
        labelId: "buildingRightFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Competitor",
        labelId: "competitorFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Roof Top",
        labelId: "roofTopFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Market",
        labelId: "marketFile",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },

    {
        label: "Floor Wise",
        labelId: "floorWise",
        // icon: <FaFileImage color="#29c071" />,
        required: true,
    },
];

export const sampleFiles = [
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

export const formDataField = {
    state: "State",
    district: "District_Name",
    city: "City",
    population: "Population",
    carPassPerHrs: "Car_Pass_Per_HRS",
    bikePassPerHrs: "Bike_Pass_Per_HRS",
    footFAllPerHrs: "Footfall_Per_HRS",
    LLRate: "LL_Rate",
    siteType: "Site_Type",
    market: "Market",
    frontage: "Frontage",
    totalArea: "Total_area",
    lgf: "Lgf",
    ugf: "Ugf",
    groundFloor: "Ground_floor",
    firstFloor: "First_Floor",
    secondFloor: "Second_Floor",
    thirdFloor: "Third_floor",
    forthFloor: "Forth_Floor",
    fifthFloor: "Fifth_Floor",
    basementParking: "Basement_Parking",
    frontParking: "Front_Parking",
    googleCoordinates: "Google_Coordinates",
    Ccompetitors: "Competitors",
    competitorsSale: "Competitors_Sale",
    remarks: "Remarks",
    brokerName: "Broker_Name",
    brokerMNo: "Broker_M_No",
    landlordName: "Landlord_Name",
    landlordMNo: "Landlord_M_No",
    roadWidth: "Road_width",
    roadCondition: "Road_Condition",
    siteId: "SiteId",
    forUpdate: "ForUpdate",
    createdBy: "Createdby",
    rmName: "RM_Name",
    propertyCeilingHeight: "PropertyCeilingHeight",
    competitors3KMRadius: "Competitors3KMRadius",
    locationPreference: "LocationPreference",
    lockinPeriod: "LockinPeriod",
    deposit: "Deposit",
    capexFromLandlord: "CapexFromLandlord",
    powerSupply: "PowerSupply",
    roadTrafficPerHour: "RoadTrafficPerHour",
    districtPopulation: "DISTRICT_POPULATION",
    cityPopulation: "CITY_POPULATION",
    brokerEmail: "Broker_Email",
    landlordEmail: "Landlord_Email",
    disttPopulationPerKM: "DISTT_POPULATION_PER_KM",
    cityPopulaitonPerKM: "CITY_POPULATION_PER_KM",
    literacyRate: "LITERACY_RATE",
    noOfSchoolWithIn10Km: "NO_OF_SCHOOL_WITH_IN_10_KM",
    noOfCollegeUniversityWithIn10Km: "NO_OF_COLLEGE_UNIVERSITY_WITH_IN_10_KM",
    averarageHouseholdIncomeDistt: "AVRAGE_HOUSEHOLD_INCOME_DISTT",
    noOfAtmInThisCity: "NO_OF_ATM_IN_THIS_CITY",
    noOfBankBranchInCity: "NO_OF_BANK_BRANCH_IN_CITY",
    noOfIndustriesFactoryInCiry: "NO_OF_INDUSTIRES_FACTORY_IN_CITY",
    unemploymentRateInCity: "UNEMPLOYEMENT_RATE_IN_CITY",
    distanceFromRailwaystation: "DISTANCE_FROM_RAILWAYSTATION",
    distanceFromBusTerminal: "DISTANCE_FROM_BUS_TERMINAL",
    noOf4WheelerPassing: "NO_OF_4_WHEELER_PASSING",
    noOf2WheelerPassing: "NO_OF_2_WHEELER_PASSING",
    noOfShoppingMall: "NO_OF_SHOPPING_MALL",
    noOfMultiplexCinemasInCity: "NO_OF_MUTIPLEX_CINEMAS_IN_CITY",
    presenceOfFoodCourt: "PRESENCE_OF_FOOD_COURT",
}

export const roleIds = {
    ADMIN: "1",
    RM: "2",
    SUPER_ADMIN: "3",
    BROKER: "4",
    LANDLORD: "5",
    LEGAL: "6"
}
