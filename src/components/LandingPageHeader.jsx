import React from "react";
import { NavLink, Link } from "react-router-dom";
import styles from "@/styles/home.module.css";
import logoStyles from "@/styles/logo.module.css";
import { FiCheckSquare } from "react-icons/fi";

function LandingPageHeader() {
  return (
    <header className={styles.navBar}>
      <div className={styles.shell}>
        <div className={styles.navInner}>
          <Link to="/" className={logoStyles.brand}>
            <span className={logoStyles.logoMark} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className={logoStyles.logoIcon}
                role="presentation"
                focusable="false"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>TeamTrack</span>
          </Link>

          <nav className={styles.navLinks} aria-label="Primary">
            <NavLink
              className={({ isActive }) =>
                `${isActive ? styles.navLinkActive : styles.navLink}`
              }
              to="/"
              end
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${isActive ? styles.navLinkActive : styles.navLink}`
              }
              to="/about"
            >
              About
            </NavLink>
          </nav>

          <div className={styles.navActions}>
            <Link className={styles.navGhostButton} to="/login">
              Sign in
            </Link>
            <Link className={styles.navPrimaryButton} to="/register">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingPageHeader;
