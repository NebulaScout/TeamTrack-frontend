import React from "react";
import { NavLink, Link } from "react-router-dom";
import styles from "@/styles/home.module.css";

function LandingPageHeader() {
  return (
    <header className={styles.navBar}>
      <div className={styles.shell}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              <span className={styles.brandDot} />
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
