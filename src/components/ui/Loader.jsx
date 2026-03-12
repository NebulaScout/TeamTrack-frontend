import React from "react";
import styles from "@/styles/ui.module.css";

function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default Loader;
