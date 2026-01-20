import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { authAPI } from "@/services/apiService";
import AuthPagesNavBar from "@/components/AuthPagesNavBar";
import styles from "@/styles/authpages.module.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  const validatePassword = () => {
    if (formData.password != formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be atleast 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return;

    setIsLoading(true);

    console.log(formData);

    try {
      const response = await authAPI.register(formData);
      console.log("Registration successful: ", response);
      navigate("/login"); // Redirect to login after a successful registration
    } catch (err) {
      console.log("Registration failed", err);
      setError(
        err.response?.data?.message || "Registration failed! Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  // TODO: validate password

  return (
    <>
      <div className={styles.pageContainer}>
        <AuthPagesNavBar />

        <div className={styles.container}>
          <h2 className={styles.title}>Sign up for an account</h2>

          {error && <p className={styles.error}>{error}</p>}

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
              <label>First Name:</label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name:</label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Username:</label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
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

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
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
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div className={styles.divider}>
            <hr />
          </div>

          <p className={styles.loginText}> Already have an account? </p>
          <button className={styles.btnLogOutline} onClick={handleRedirect}>
            Log in
          </button>
        </div>
      </div>
    </>
  );
}
