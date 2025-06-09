import { useState } from "react";
import styles from "./Carousel.module.css";
import { FaFile } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const Carousel = ({ files = [], setIsShwoProofFilesClicked }) => {
  // ----- state for current file index
  const [currentIndex, setCurrentIndex] = useState(0);

  // ----- show next file
  const showNextFile = () => {
    // ----- loop back to first file if at last index
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };

  // ----- show previous file
  const showPreviousFile = () => {
    // ----- loop to last file if at the beginning
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  // ----- get the file based on the current index
  const file = files[currentIndex];
  const fileUrl = URL.createObjectURL(file);

  return (
    <div className={styles.files_overlay}>
      <div
        className={styles.carousel_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ------ close button */}
        <span
          className={styles.close_button}
          onClick={() => setIsShwoProofFilesClicked(false)}
        >
          <MdClose size={30} />
        </span>

        {/* ----- previous button */}
        <button
          className={styles.navigation_button}
          onClick={showPreviousFile}
          disabled={files.length <= 1}
        >
          &lt;
        </button>

        {/* ----- display current file */}
        <div className={styles.fie_div}>
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

        {/* ----- next button */}
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
