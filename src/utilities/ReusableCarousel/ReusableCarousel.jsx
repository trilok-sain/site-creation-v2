import { Fragment, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import mime from "mime";
import styles from "./Carousel.module.css";
import { useApi } from "../../APIConfig/APIContext";

const ReusableCarousel = ({ closeCarousel, apiFiles, localFiles, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const baseUrl = useApi();

  // ***** STATES FOR DRAGGING AND DROPPING FILES *****
  const [reorderedFiles, setReorderedFiles] = useState([])
  const [draggedIndex, setDraggedIndex] = useState(null)

  // Combine apiFiles and localFiles into one array
  const combinedFiles = [
    ...(apiFiles || []).map((file) => ({ ...file, source: "api" })),
    ...(localFiles || []).map((file) => ({ ...file, source: "local" })),
    ...(images || []).map((file) => ({ ...file, source: "images" })),
  ];

  const handleDragStart = (index)=> {
    setDraggedIndex(index)
  }

  const handleDragOver = (event)=> {
    event.preventDefault()
  }

  const handleDrop = (index)=> {
    if(draggedIndex !==null && draggedIndex!==null){
      const reorderedArr = [...reorderedFiles]
      const [draggedItem] = reorderedArr.splice(draggedIndex, 1)
      reorderedArr.splice(index, 0, draggedItem)
      setReorderedFiles(reorderedArr);
      setDraggedIndex(null);
      setCurrentIndex(index);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        carouselRef.current.decrement();
      } else if (event.key === "ArrowRight") {
        carouselRef.current.increment();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (reorderedFiles.length > 0) {
      setCurrentIndex(0); // Reset to the first item when new files are loaded
    }
  }, [apiFiles, localFiles, images]);

  useEffect(() => {
    if (combinedFiles.length > 0) {
      setCurrentIndex(0); // Reset to the first item when new files are loaded
    }
  }, [apiFiles, localFiles]);

  return (
    <Fragment>
      <div className={`${styles.overlay}`}>
        <div
          className={`${styles.content}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={`${styles.close_btn}`} onClick={closeCarousel}>
            &times;
          </button>

          <Carousel
            ref={carouselRef}
            selectedItem={currentIndex}
            showThumbs={false}
            infiniteLoop={true}
            showStatus={false}
            showArrows={false}
            dynamicHeight={true}
            useKeyboardArrows
            swipeable={true}
            emulateTouch={true}
            onChange={(index) => setCurrentIndex(index)}
          >
            {combinedFiles.length > 0 &&
              combinedFiles.map((file, index) => (
                <div key={index} className={`${styles.carousel_item}`}>
                  {/* Check if the file is from api or local */}
                  {file.source === "api" ? (
                    mime
                      .getType(`${baseUrl}/${file.filePath}`)
                      ?.startsWith("image/") ? (
                      <img
                        src={`${baseUrl}/${file.filePath}`}
                        alt={file.name}
                        className={`${styles.carousel_media}`}
                      />
                    ) : mime
                        .getType(`${baseUrl}/${file.filePath}`)
                        .startsWith("video/") ? (
                      <video
                        src={`${baseUrl}/${file.filePath}`}
                        controls
                        className={`${styles.carousel_media}`}
                      />
                    ) : (
                      <p>No preview available for this file.</p>
                    )
                  ) : file.source === "local" ? (
                    file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className={`${styles.carousel_media}`}
                      />
                    ) : file.type.startsWith("video/") ? (
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className={`${styles.carousel_media}`}
                      />
                    ) : (
                      <p>No preview available for this file.</p>
                    )
                  ) : file.source === "images" ? (
                    <img
                      src={file?.pptImages}
                      alt={file.name}
                      className={`${styles.carousel_media}`}
                    />
                  ) : null}
                </div>
              ))}
          </Carousel>

          <button
            className={`${styles.prev_btn}`}
            onClick={() => carouselRef.current.decrement()}
          >
            <FaArrowLeft size={30} />
          </button>
          <button
            className={`${styles.next_btn}`}
            onClick={() => carouselRef.current.increment()}
          >
            <FaArrowRight size={30} />
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ReusableCarousel;
