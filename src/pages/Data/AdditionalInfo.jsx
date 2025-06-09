import { useState } from 'react';
import styles from './ViewDetails.module.css';
import { FaFile, FaFileImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';
import axios from 'axios';
import { useApi } from '../../APIConfig/APIContext';
import { useNavigate } from 'react-router-dom';
import FilesCarouselPublic from '../../components/FilesCarouselPublic';

const proofsList = [
    {
        label: "Proof Of Ownership",
        labelId: "ownershipfile",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },
    {
        label: "Area certificate from registered architect in respect of demised promises",
        labelId: "areaDemisedCert",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },
    {
        label: "Any other documents( familiy settlement deed/Partnership deed/MOA/GPA)",
        labelId: "settlementCert",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },
    {
        label: "Photographs of the LESSOR or Directors",
        labelId: "photoLessorOrDirector",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },

    {
        label: "PAN card of the LESSOR",
        labelId: "panCardLessor",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },

    {
        label: "Approval letter from Authorities for running distribution centre & warehouse",
        labelId: "approvalDistribution",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },

    {
        label: "No objection certificate from the Fire Department and other department for the use of Building as commercial activities",
        labelId: "NOCfireCommercial",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },

    {
        label: "Occupation Certificate",
        labelId: "occupationCert",
        icon: <FaFileImage color="#29c071" />,
        required: false,
    },
    {
      label: "Building use permission certificate",
      labelId: "permissionbuilding",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Sanctioned Building Plan for commercial purpose issued by competent authority.",
      labelId: "sanctionPlanCommercial", 
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Proof of property tax and any other due payment with respect to demised premises",
      labelId: "propertyTaxDueCert",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Non-Encumbrance  certificate",
      labelId: "nonEncumbrance",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    },

    {
      label: "Commercial Area compounding certificate/ Commercial Approved Compounded Map from respective development authority",
      labelId: "compoundCommercialArea",
      icon: <FaFileImage color="#29c071" />,
      required: false,
    }
];

const initialState = {
        ownershipfile: [],
        areaDemisedCert: [],
        settlementCert: [],
        photoLessorOrDirector: [],
        panCardLessor: [],
        approvalDistribution: [],
        NOCfireCommercial: [],
        occupationCert: [],
        permissionbuilding: [],
        sanctionPlanCommercial: [],
        propertyTaxDueCert: [],
        nonEncumbrance: [],
        compoundCommercialArea: [],
}

// change
const sampleAdditionFiles = [
    {
        label: "Proof Of Ownership",
        path: ["/leftView.jfif"]
    },
    {
        label: "Area certificate from registered architect in respect of demised promises",
        path: ["/leftView.jfif"]
    },
    {
        label: "Any other documents( familiy settlement deed/Partnership deed/MOA/GPA)",
        path: ["/leftView.jfif"]
    },
    {
        label: "Photographs of the LESSOR or Directors",
        path: ["/leftView.jfif"]
    },
    {
        label: "PAN card of the LESSOR",
        path: ["/leftView.jfif"]
    },
    {
        label: "Approval letter from Authorities for running distribution centre & warehouse",
        path: ["/leftView.jfif"]
    },

    {
        label: "No objection certificate from the Fire Department and other department for the use of Building as commercial activities",
        path: ["/leftView.jfif"]
    },

    {
        label: "Occupation Certificate",
        path: ["/leftView.jfif"]
    },
    {
        label: "Building use permission certificate",
        path: ["/leftView.jfif"]
    },

    {
        label: "Sanctioned Building Plan for commercial purpose issued by competent authority.",
        path: ["/leftView.jfif"]
    },

    {
        label: "Proof of property tax and any other due payment with respect to demised premises",
        path: ["/leftView.jfif"]
    },

    {
        label: "Non-Encumbrance  certificate",
        path: ["/leftView.jfif"]
    },

    {
        label: "Commercial Area compounding certificate/ Commercial Approved Compounded Map from respective development authority",
        path: ["/leftView.jfif"]
    }
];
// change


const AdditionalInfo = ({ rowData, previousLocation }) => {

    const baseUrl = useApi();
    const [isAccordionOpen, setIsAccordionOpen] = useState({});
    const [currentSampleFiles, setCurrentSampleFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [proofFiles, setProofFiles] = useState(initialState);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleAccordion = (id) => {
        setIsAccordionOpen((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const updatedAdditionSampleFiles = sampleAdditionFiles.map((file) => ({
        ...file,
        isSampleFileAvailable: file.path.some((p) => p !== ""),
    }));

    const handleSampleModalOpen = (label) => {
        const files = updatedAdditionSampleFiles.filter((file) => file.label === label);
        // console.log("selected files", files);
        setCurrentSampleFiles(files);
        setIsSampleModalOpen(true);
    };


    const updatedSampleFiles = sampleAdditionFiles.map((file) => ({
        ...file,
        isSampleFileAvailable: file.path.some((p) => p !== ""),
    }));

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

    const handleAddProofsSubmit = async () => {
        // if (rowData?.site_Type !== "BTS" && notProofFiles) {
        //   alert("Files are mandatory!");
        //   return false;
        // }
    
        // if (proofFiles.buildingFrontFile.length === 0) {
        //   toast.error("Building Front file is mandatory");
        //   return false;
        // } else if (proofFiles.buildingOppositeFile.length === 0) {
        //   toast.error("Building Opposite file is mandatory");
        //   return false;
        // } else if (proofFiles.buildingLeftFile.length === 0) {
        //   toast.error("Building Left file is mandatory");
        //   return false;
        // } else if (proofFiles.buildingRightFile.length === 0) {
        //   toast.error("Building Right file is mandatory");
        //   return false;
        // } else if (proofFiles.competitorFile.length === 0) {
        //   toast.error("Competitor file is mandatory");
        //   return false;
        // } else if (proofFiles.roofTopFile.length === 0) {
        //   toast.error("Roof Top file is mandatory");
        //   return false;
        // } else if (proofFiles.marketFile.length === 0) {
        //   toast.error("Market file is mandatory");
        //   return false;
        // } else if (proofFiles.floorWise.length === 0) {
        //   toast.error("Floor wise file is mandatory");
        //   return false;
        // }
    
        let formData = new FormData();
        formData.append("siteId", String(rowData?.siteID));
        formData.append("createdBy", "v2_source");
    
        proofFiles.ownershipfile.forEach((proof) => {
          formData.append("ownershipfile", proof);
        });
    
        proofFiles.areaDemisedCert.forEach((proof) => {
          formData.append("areaDemisedCert", proof);
        });
    
        proofFiles.settlementCert.forEach((proof) => {
          formData.append("settlementCert", proof);
        });
    
        proofFiles.photoLessorOrDirector.forEach((proof) => {
          formData.append("photoLessorOrDirector", proof);
        });
    
        proofFiles.panCardLessor.forEach((proof) => {
          formData.append("panCardLessor", proof);
        });
    
        proofFiles.approvalDistribution.forEach((proof) => {
          formData.append("approvalDistribution", proof);
        });
    
        proofFiles.NOCfireCommercial.forEach((proof) => {
          formData.append("NOCfireCommercial", proof);
        });
    
        proofFiles.occupationCert.forEach((proof) => {
          formData.append("occupationCert", proof);
        });
         proofFiles.permissionbuilding.forEach((proof) => {
          formData.append("permissionbuilding", proof);
        });
         proofFiles.sanctionPlanCommercial.forEach((proof) => {
          formData.append("sanctionPlanCommercial", proof);
        });
         proofFiles.propertyTaxDueCert.forEach((proof) => {
          formData.append("propertyTaxDueCert", proof);
        });
         proofFiles.nonEncumbrance.forEach((proof) => {
          formData.append("nonEncumbrance", proof);
        });
         proofFiles.compoundCommercialArea.forEach((proof) => {
          formData.append("compoundCommercialArea", proof);
        });
    
        setLoading(true);
        // return
        try {
          await axios
            .post(`${baseUrl}/api/Site/AddAdditionalProof`, formData)
            .then((response) => {
              if (response.status === 200) {
                navigate(previousLocation);
                toast.success(response?.data?.message || "Added proofs!!");
                setLoading(false);
                setProofFiles((prev) => (
                    initialState
                ));
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

    const deleteFileAccordion = (e, type, idx) => {
        const data = proofFiles[type].filter((file, i) => i !== idx);

        setProofFiles((prev) => ({
            ...prev,
            [type]: [...data],
        }));
    };

    return (
        <div className={styles.addproofs_container} style={{ margin: 15, width: 'auto'}}>
            <div style={{ fontSize: 24, fontWeight : 500, marginTop: 18}}>Please upload Documents</div>
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
                                {updatedAdditionSampleFiles[index].isSampleFileAvailable && (
                                    <button
                                        className={styles.view_sample_btn}
                                        style={{ position: "relative", left: 0}}
                                        onClick={() => handleSampleModalOpen(proof.label)}
                                    >
                                        View Sample
                                    </button>
                                )}
                            </label>

                            <div className={styles.file}>
                                <small>
                                    {proofFiles[proof.labelId]?.length === 0
                                        ? "No file selected"
                                        : proofFiles[proof.labelId]?.length === 1
                                            ? proofFiles[proof.labelId][0]?.name
                                            : `${proofFiles[proof.labelId]?.length} files`}
                                </small>

                                <label htmlFor={proof?.labelId}>{proof?.icon}</label>

                                <input
                                    type="file"
                                    id={proof?.labelId}
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
                    marginBottom: 10
                    // rowData?.siteType !== "BTS" && !notProofFiles
                    //   ? "not-allowed"
                    //   : "pointer",
                }}
            >
                Submit
            </button>
            {isSampleModalOpen && (
                <FilesCarouselPublic
                    files={currentSampleFiles}
                    setIsShowProofFilesClicked={setIsSampleModalOpen}
                />
            )}
        </div>
    )
}
export default AdditionalInfo;