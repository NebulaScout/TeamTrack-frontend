import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import AuthPagesNavBar from "@/components/AuthPagesNavBar";
import styles from "@/styles/authpages.module.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedirect = () => {
    navigate("/register");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <AuthPagesNavBar />

        <div className={styles.container}>
          <h2 className={styles.title}>Log in to your account</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email:</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Password:</label>
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}{" "}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <a href="#" className={styles.forgotPassword}>
              Forgot Password?
            </a>
            <button className={styles.btnSubmit} type="submit">
              Log in
            </button>
          </form>
          <div className={styles.divider}>
            <hr />
          </div>

          <p className={styles.loginText}> Don't have have an account? </p>
          <button className={styles.btnLogOutline} onClick={handleRedirect}>
            Sign up
          </button>
        </div>
      </div>
    </>
  );
}
