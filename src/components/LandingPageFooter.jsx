import React from "react";
import { Link } from "react-router-dom";
import styles from "@/styles/home.module.css";

function LandingPageFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.footerGrid}>
          <div>
            <Link to="/" className={styles.footerBrand}>
              <span className={styles.brandMark} aria-hidden="true">
                <span className={styles.brandDot} />
              </span>
              <span>TeamTrack</span>
            </Link>
            <p>
              The collaborative workspace where teams plan projects, track
              tasks, and ship work together.
            </p>
          </div>

          <div>
            <h3>Product</h3>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/register">Get started</Link>
          </div>

          <div>
            <h3>Account</h3>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 TeamTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default LandingPageFooter;
