import React from "react";
import styles from "../styles/Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader_overlay}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
