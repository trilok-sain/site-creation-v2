import React, { useEffect, useState } from "react";
import { useApi } from "../../APIConfig/APIContext";
import mime from "mime";
import styles from "./Recarousel.module.css";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaFile,
  FaPlayCircle,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";

const ReCarousel = ({
  handleCloseCarousel,
  apiFiles = [],
  localFiles = [],
  siteID,
  isAdditioinal
}) => {
  const baseUrl = useApi();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragItemIndex, setDragItemIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);

const filterDoc = (file) => isAdditioinal ?  file.filePath.includes("additional") : !file.filePath.includes("additional")

  const [combinedFiles, setCombinedFiles] = useState([
    ...(apiFiles || []).filter(filterDoc).map((file) => ({
      ...file,
      source: "api",
      checked: true,
    })),
    ...(localFiles || []).filter(filterDoc).map((file) => ({
      ...file,
      source: "local",
      checked: true,
    })),
  ]);

  console.log({ combinedFiles , isAdditioinal});
  

  const checkedFiles = combinedFiles.filter((file) => file.checked);
  //   console.log("checkedfiles", checkedFiles)
  //   console.log("combinedfiles", combinedFiles)
  // console.log("combinedfiles", combinedFiles)

  const handleIncrement = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === checkedFiles.length - 1 ? 0 : prevIndex + 1
      );
      setTransitioning(false);
    }, 200); // Match the animation duration
  };

  const handleDecrement = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? checkedFiles.length - 1 : prevIndex - 1
      );
      setTransitioning(false);
    }, 200);
  };

  const handleToggleFileChecked = (e, index) => {
    // console.log(e)
    e.stopPropagation();
    // const _currentIndex = currentIndex;
    setCombinedFiles((prevFiles) =>
      prevFiles.map((file, i) =>
        i === index ? { ...file, checked: !file.checked } : file
      )
    );
  };

  const handleDragStart = (index) => {
    setDragItemIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragDrop = async (index) => {
    // console.log("file on drop", combinedFiles)
    if (dragItemIndex !== null && dragItemIndex !== index) {
      const updatedArr = [...combinedFiles];
      const [draggedItem] = updatedArr.splice(dragItemIndex, 1);
      updatedArr.splice(index, 0, draggedItem);
      setCombinedFiles(updatedArr);
      setDragItemIndex(null);

      const ids = updatedArr.map((file) => file.siteProofId);
      const proofOrder = ids.join(",");
      // console.log("proofsorder", proofOrder)

      setLoading(true);
      await axios
        .post(
          `${baseUrl}/api/Site/ChangeProof?siteid=${parseInt(
            siteID
          )}&ids=${proofOrder}`
        )
        .then((response) => {
          console.log("response", response);
          setLoading(false);
        })
        .catch((err) => {
          console.log("drag err", err);
          setLoading(false);
        });
    }
  };

  const handleSlideClick = (index) => {
    const checkedIndex = checkedFiles.findIndex(
      (file) => file === combinedFiles[index]
    );
    if (checkedIndex !== -1) {
      setCurrentIndex(checkedIndex);
    }
  };

  const handleDeleteFile = async (file) => {
    const confirm = window.confirm("Are you sure want to delete the proof?");
    if (!confirm) return;

    setLoading(true);
    axios
      .post(`${baseUrl}/api/Site/DeleteProof?id=${parseInt(file?.siteProofId)}`)
      .then((response) => {
        if (response.status === 200) {
          // navigate(`/view-details/${siteID}`)
          window.location.reload();
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("delete err", err);
        toast.error(err?.response?.data?.message || "Unable to delete proof!");
        setLoading(false);
      });
  };

  useEffect(() => {
    // console.log(combinedFiles.filter((file) => file.checked).length);
    const currentActiveFiles =
      combinedFiles.filter((file) => file.checked).length - 1;
    const imageToSHow =
      currentActiveFiles == 0
        ? 0
        : currentActiveFiles < currentIndex
        ? currentActiveFiles
        : currentIndex;
    // console.log(imageToSHow)
    setCurrentIndex(imageToSHow);
  }, [combinedFiles]);

  return (
    <div className={styles.carousel_overlay}>
      {loading && <Loader />}

      <div className={styles.carousel}>
        <div className={styles.carousel_header}>
          <span onClick={handleCloseCarousel}>&times;</span>
        </div>

        <div className={styles.carousel_body}>
          <div className={styles.carousel_slide}>
            {combinedFiles.length > 0 &&
              combinedFiles.map((file, index) => (
                <div
                  key={index}
                  className={styles.file_item_div}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDragDrop(index)}
                >
                  {file.source === "api" &&
                    (mime.getType(file?.filePath)?.startsWith("image/") ? (
                      <img
                        src={`${baseUrl}/${file.filePath}`}
                        alt={"No image"}
                        onClick={() => handleSlideClick(index)}
                      />
                    ) : mime.getType(file.filePath)?.startsWith("video/") ? (
                      <>
                        <video
                          src={`${baseUrl}/${file.filePath}`}
                          onClick={() => handleSlideClick(index)}
                        />
                        <span className={styles.video_icon}>
                          <FaPlayCircle />
                        </span>
                      </>
                    ) : (
                      <span
                        className={styles.slide_file_icon}
                        onClick={() => handleSlideClick(index)}
                      >
                        <FaFile />
                      </span>
                    ))}
                  <input
                    type="checkbox"
                    checked={file.checked}
                    onChange={(e) => handleToggleFileChecked(e, index)}
                  />
                  <span onClick={() => handleDeleteFile(file)}>
                    <MdDelete color="red" />
                  </span>
                </div>
              ))}
          </div>

          <div className={styles.carousel_main}>
            <div className={`${styles.carousel_main_left}`}>
              <span
                className={styles.carousel_main_btn}
                onClick={handleDecrement}
              >
                <FaArrowCircleLeft />
              </span>
            </div>
            <div className={styles.carousel_main_div}>
              <div
                className={`${styles.carousel_main_file} ${
                  transitioning ? styles["slide-out"] : styles["slide-in"]
                }`}
              >
                {combinedFiles
                  .filter((file) => file.checked)
                  .slice(currentIndex, currentIndex + 1)
                  .map(
                    (file, index) =>
                      file.source === "api" &&
                      (mime.getType(file.filePath)?.startsWith("image/") ? (
                        <>
                          <a
                            href={`${baseUrl}/${file.filePath}`}
                            download="download"
                            target="_blank"
                          >
                            Download
                          </a>
                          <img
                            src={`${baseUrl}/${file.filePath}`}
                            alt={"No image"}
                            key={index}
                          />
                        </>
                      ) : mime.getType(file.filePath)?.startsWith("video/") ? (
                        <>
                          <a
                            href={`${baseUrl}/${file.filePath}`}
                            download
                            target="_blank"
                          >
                            Download
                          </a>
                          <video
                            src={`${baseUrl}/${file.filePath}`}
                            controls
                            key={index}
                          />
                        </>
                      ) : (
                        <div key={index} className={styles.carousel_main_file}>
                          <>
                            <a
                              href={`${baseUrl}/${file.filePath}`}
                              download
                              target="_blank"
                            >
                              Download
                            </a>
                            <p>No preview</p>
                          </>
                        </div>
                      ))
                  )}
              </div>
            </div>
            <div className={styles.carousel_main_right}>
              <span
                className={styles.carousel_main_btn}
                onClick={handleIncrement}
              >
                <FaArrowCircleRight />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReCarousel;
