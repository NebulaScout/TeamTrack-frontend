import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import AuthPagesNavBar from "@/components/AuthPagesNavBar";
import styles from "@/styles/authpages.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { FiLoader } from "react-icons/fi";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (err) => {
      const message =
        err?.response?.data?.messages ||
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed! Please try again.";
      setError("root", { message });
    },
  });

  const handleRedirect = () => {
    navigate("/register");
  };

  const onSubmit = (data) => {
    clearErrors("root");
    loginMutation.mutate(data);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <AuthPagesNavBar />

        <div className={styles.container}>
          <h2 className={styles.title}>Log in to your account</h2>

          {errors.root?.message && (
            <p className={styles.error}>{errors.root.message}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Username/ Email:</label>

              <input
                type="text"
                aria-invalid={!!errors.username}
                {...register("username", { required: true })}
                className={styles.input}
              />
              {errors.username?.message && (
                <p className={styles.fieldError}>{errors.username.message}</p>
              )}
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
                className={styles.input}
                aria-invalid={!!errors.password}
                {...register("password", { required: true })}
              />
              {errors.password?.message && (
                <p className={styles.fieldError}>{errors.password.message}</p>
              )}
            </div>

            <a href="#" className={styles.forgotPassword}>
              Forgot Password?
            </a>
            <button
              className={styles.btnSubmit}
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  {/* TODO: Add animate spin style */}
                  <FiLoader className="" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>
          <div className={styles.divider}>
            <hr />
          </div>

          <p className={styles.loginText}> Don't have have an account? </p>
          <button
            className={styles.btnLogOutline}
            onClick={handleRedirect}
            disabled={loginMutation.isPending}
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  );
}
