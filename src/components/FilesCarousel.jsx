import React, { useEffect, useState } from "react";
import styles from "./FilesCarousel.module.css";
import { FaFile } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const FilesCarousel = ({ files = [], setIsShowProofFilesClicked }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // State for the current file index

  // Show next file
  const showNextFile = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length); // Loop back to first file if at the end
  };

  // Show previous file
  const showPreviousFile = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + files.length) % files.length
    ); // Loop to last file if at the beginning
  };

  const file = files[currentIndex]; // Get the file based on the current index
  const fileUrl = URL.createObjectURL(file);

  useEffect(() => {
    function handleKeyPress(e) {
      if (e.key === "ArrowRight") {
        // ----- move to next file if right arrow is pressed
        showNextFile();
      } else if (e.key === "ArrowLeft") {
        // ----- move to previous file if left arrow is pressed
        showPreviousFile();
      } else if (e.key === "Escape") {
        // ----- close carousel if esc key is pressed
        setIsShowProofFilesClicked(false);
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [files.length]);

  return (
    <div className={styles.files_overlay}>
      <div
        className={styles.carousel_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span
          className={styles.close_button}
          onClick={() => setIsShowProofFilesClicked(false)}
          style={{ zIndex: 1 }}
        >
          <MdClose size={30} />
        </span>
        {/* Previous Button */}
        <button
          className={styles.navigation_button}
          onClick={showPreviousFile}
          disabled={files.length <= 1}
        >
          &lt;
        </button>
        {/* Display the current file */}
        <div className={styles.file_div}>
          {file.type.includes("image") ? (
            <img src={fileUrl} alt={file.name} className={styles.file} />
          ) : file.type.includes("video") ? (
            <video src={fileUrl} className={styles.file} controls />
          ) : (
            <FaFile
              fontSize={"5rem"}
              className={styles.file}
              title="No preview available"
            />
          )}
        </div>
        {/* Next Button */}
        <button
          className={styles.navigation_button}
          onClick={showNextFile}
          disabled={files.length <= 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FilesCarousel;
