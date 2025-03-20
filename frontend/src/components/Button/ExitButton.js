import styles from './Button.module.css';
import React from "react";

const ExitButton = (props) => {
  return (
    <button
      className={styles.button_exit}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
export default ExitButton;