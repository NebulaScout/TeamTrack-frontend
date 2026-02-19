import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { authAPI } from "@/services/authAPI";
import AuthPagesNavBar from "@/components/AuthPagesNavBar";
import styles from "@/styles/authpages.module.css";
import { FiLoader } from "react-icons/fi";

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name is required")
  .refine((val) => !/^\d+$/.test(val), {
    message: "Name cannot consist of only numbers",
  });

const registerSchema = z
  .object({
    email: z.email("Enter a valid email"),
    firstName: nameSchema,
    lastName: nameSchema.optional(),
    username: z
      .string()
      .trim()
      .min(3, "Username must be atleast 3 characters long")
      .max(20, "Username is too long")
      .refine((val) => !/^\d+$/.test(val), {
        message: "Username cannot consist of only numbers",
      }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(30, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match!",
  });

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err) => {
      const message =
        err?.response?.data?.messages ||
        err?.response?.data?.detail ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Registration failed! Please try again.";
      setError("root", { message });
    },
  });
  console.log("Register Mutation: ", registerMutation);

  const handleRedirect = () => {
    navigate("/login");
  };

  const onSubmit = (data) => {
    clearErrors("root");
    registerMutation.mutate(data);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <AuthPagesNavBar />

        <div className={styles.container}>
          <h2 className={styles.title}>Sign up for an account</h2>

          {errors.root?.message && (
            <p className={styles.error}>{errors.root.message}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email:</label>

              <input
                type="email"
                className={styles.input}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email?.message && (
                <p className={styles.fieldError}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>First Name:</label>

              <input
                type="text"
                className={styles.input}
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
              {errors.firstName?.message && (
                <p className={styles.fieldError}>{errors.firstName.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name:</label>

              <input
                type="text"
                className={styles.input}
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
              {errors.lastName?.message && (
                <p className={styles.fieldError}>{errors.lastName.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Username:</label>

              <input
                type="text"
                className={styles.input}
                aria-invalid={!!errors.username}
                {...register("username")}
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
                {...register("password")}
              />
              {errors.password?.message && (
                <p className={styles.fieldError}>{errors.password.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password:</label>

              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword?.message && (
                <p className={styles.fieldError}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <a href="#" className={styles.forgotPassword}>
              Forgot Password?
            </a>
            <button
              className={styles.btnSubmit}
              type="submit"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  {/* TODO: Add animate spin style */}
                  <FiLoader className="" />
                  Creating user...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <div className={styles.divider}>
            <hr />
          </div>

          <p className={styles.loginText}> Already have an account? </p>
          <button
            className={styles.btnLogOutline}
            onClick={handleRedirect}
            disabled={registerMutation.isPending}
          >
            Log in
          </button>
        </div>
      </div>
    </>
  );
}
