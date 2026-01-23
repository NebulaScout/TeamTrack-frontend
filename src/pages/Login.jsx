import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import AuthPagesNavBar from "@/components/AuthPagesNavBar";
import styles from "@/styles/authpages.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedirect = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log(formData);

    setIsLoading(true);

    try {
      await login(formData);
      console.log("Login Successful:");
      navigate("/dashboard");
    } catch (err) {
      console.log("Log in failed. ", err);
      setError(
        err.response?.data?.messages ||
          err.response?.data?.detail ||
          "Login Failed! Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <AuthPagesNavBar />

        <div className={styles.container}>
          <h2 className={styles.title}>Log in to your account</h2>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Username/ Email:</label>

              <input
                type="text"
                name="username"
                value={formData.username}
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
            <button
              className={styles.btnSubmit}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in" : "Log in"}
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
