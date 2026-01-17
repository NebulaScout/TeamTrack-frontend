import styles from "@/styles/authpages.module.css";
import { useNavigate } from "react-router-dom";

export default function AuthPagesNavBar() {
  const navigate = useNavigate();

  const handleClick = (buttonId) => {
    buttonId == "login" ? navigate("/login") : navigate("/register");
  };
  return (
    <nav className={styles.nav}>
      <div className={styles.navRight}>
        <button
          className={styles.btnLogin}
          onClick={() => handleClick("login")}
        >
          Log in
        </button>
        <button
          className={styles.btnSignup}
          onClick={() => handleClick("signup")}
        >
          Sign up
        </button>
      </div>
    </nav>
  );
}
