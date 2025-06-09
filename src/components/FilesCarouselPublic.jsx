import React, { useEffect, useState } from "react";
import styles from "./FilesCarousel.module.css";
import { FaFile } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const FilesCarouselPublic = ({ files = [], setIsShowProofFilesClicked }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  // Move to next/previous main file and reset subIndex
  const showNextFile = () =>
    setCurrentIndex((i) => {
      const next = (i + 1) % files.length;
      setSubIndex(0);
      return next;
    });

  const showPreviousFile = () =>
    setCurrentIndex((i) => {
      const prev = (i - 1 + files.length) % files.length;
      setSubIndex(0);
      return prev;
    });

  // Get current file and URL(s)
  const { label, path: urls } = files[currentIndex] || {};
  const isArray = Array.isArray(urls);
  const currentUrl = isArray ? urls[subIndex] : urls;
  const hasMultiple = isArray && urls.length > 1;
  //   console.log("hasmultiple", hasMultiple);

  // Handlers for sub-carousel
  const showNextSub = () =>
    hasMultiple && setSubIndex((i) => (i + 1) % urls.length);
  const showPrevSub = () =>
    hasMultiple && setSubIndex((i) => (i - 1 + urls.length) % urls.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight") {
        hasMultiple ? showNextSub() : showNextFile();
      } else if (e.key === "ArrowLeft") {
        hasMultiple ? showPrevSub() : showPreviousFile();
      } else if (e.key === "Escape") {
        setIsShowProofFilesClicked(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [files.length, hasMultiple, subIndex]);

  return (
    <div
      className={styles.files_overlay}
      onClick={() => setIsShowProofFilesClicked(false)}
    >
      <div
        className={styles.carousel_container}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={styles.close_button}
          onClick={() => setIsShowProofFilesClicked(false)}
        >
          <MdClose size={30} />
        </span>

        {/* Main navigation */}
        {/* <button
          className={styles.navigation_button}
          onClick={showPreviousFile}
          disabled={hasMultiple === false}
        >
          &lt;
        </button> */}

        {/* File + sub-navigation */}
        <div className={styles.file_div}>
          {hasMultiple && (
            <button className={styles.navigation_button} onClick={showPrevSub}>
              &lt;
            </button>
          )}

          {/* Media Preview */}
          {currentUrl && currentUrl.match(/\.(jpe?g|png|gif|jfif)$/i) ? (
            <img src={currentUrl} alt={label} className={styles.file} />
          ) : currentUrl && currentUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={currentUrl} className={styles.file} controls />
          ) : (
            <FaFile
              fontSize="5rem"
              className={styles.file}
              title="No preview available"
            />
          )}

          {hasMultiple && (
            <button className={styles.navigation_button} onClick={showNextSub}>
              &gt;
            </button>
          )}
        </div>

        {/* Main navigation */}
        {/* <button
          className={styles.navigation_button}
          onClick={showNextFile}
          disabled={hasMultiple === false}
        >
          &gt;
        </button> */}
      </div>
    </div>
  );
};

export default FilesCarouselPublic;
