import { FunctionComponent } from "react";
import { motion } from "framer-motion";
import styles from "../styles/Badges.module.css";

type Types = "default" | "danger";

interface Props {
  isActive: boolean;
  type?: Types;
}

const variants = {
  initial: { transition: { duration: 0.4 }, y: "-100%", x: "-50%" },
  animate: { transition: { duration: 0.4 }, y: 30, x: "-50%" },
};

const Badges: FunctionComponent<Props> = ({
  isActive,
  type = "default",
  children,
}) => {
  let color: string;

  if (type === "default") {
    color = "#fff";
  } else {
    color = "red";
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate={isActive ? "animate" : "initial"}
      style={{
        position: "fixed",
        top: 0,
        backgroundColor: color,
        color: type === "default" ? "#000" : "#fff",
        border: "1px solid var(--light-blue)",
      }}
      className={styles.Badges}
    >
      {children}
    </motion.div>
  );
};

export default Badges;
