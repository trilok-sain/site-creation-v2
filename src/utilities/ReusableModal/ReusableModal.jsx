import React from "react";
import styles from "./Modal.module.css";

const ReusableModal = ({
  children,
  title,
  isModalOpen,
  handleModalClose,
  width = "40vw",
  height = "40vh",
  titleColor = "black"
}) => {
  if (!isModalOpen) {
    return null;
  }

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content} style={{ width, height }}>
        <div className={styles.modal_header}>
         {title && <h2 style={{color: titleColor}}>{title || ""}</h2>}
          <span onClick={handleModalClose}>&times;</span>
        </div>
        <div className={styles.modal_body}>{children}</div>
      </div>
    </div>
  );
};

export default ReusableModal;
