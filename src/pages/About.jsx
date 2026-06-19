import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "@/styles/about.module.css";
import LandingPageFooter from "@/components/LandingPageFooter";
import LandingPageHeader from "@/components/LandingPageHeader";

const stats = [
  { value: "10k+", label: "Teams onboard" },
  { value: "1M+", label: "Tasks completed" },
  { value: "60+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const beliefs = [
  {
    icon: FiTarget,
    title: "Clarity over chaos",
    text: "We believe great teamwork starts with a clear view of who's doing what, and why.",
  },
  {
    icon: FiHeart,
    title: "Built for people",
    text: "Software should feel calm and human. We sweat the details so your team doesn't have to.",
  },
  {
    icon: HiSparkles,
    title: "Simple, but powerful",
    text: "Easy on day one. Capable enough for the most ambitious projects on day one hundred.",
  },
  {
    icon: FiGlobe,
    title: "Made for every team",
    text: "Whether you're 3 people or 300, TeamTrack scales with the way you work.",
  },
];

const values = [
  {
    icon: FiUsers,
    title: "Team-first",
    text: "Every product decision starts with collaboration, visibility, and shared ownership.",
  },
  {
    icon: FiShield,
    title: "Trust by default",
    text: "Roles, permissions, and controls are designed to keep work secure without slowing people down.",
  },
  {
    icon: FiCheckCircle,
    title: "Ship with confidence",
    text: "We help teams stay aligned so they can move faster and deliver better work.",
  },
];

export default function About() {
  const { isAuthenticated, homeRoute } = useAuth();

  const primaryHref = isAuthenticated ? homeRoute || "/dashboard" : "/register";
  const primaryLabel = isAuthenticated ? "Open app" : "Get started free";

  return (
    <div className={styles.page}>
      <LandingPageHeader />

      <main>
        <section className={styles.hero}>
          <div className={styles.shell}>
            <p className={styles.heroEyebrow}>About TeamTrack</p>
            <h1 className={styles.heroTitle}>
              We're building the calmest way
              <br />
              for teams to get work done.
            </h1>
            <p className={styles.heroText}>
              TeamTrack started with a simple idea: the best teams don't need
              more tools. They need one tool that just works. So we built it.
            </p>
          </div>
        </section>

        <section className={styles.missionSection}>
          <div className={styles.shell}>
            <div className={styles.missionGrid}>
              <div className={styles.missionCopy}>
                <p className={styles.sectionLabel}>Our mission</p>
                <h2>Make team work feel clear, calm, and connected.</h2>
                <p>
                  Teams everywhere lose hours each week jumping between tabs,
                  chasing updates, and rewriting the same status report. We
                  think that's broken.
                </p>
                <p>
                  TeamTrack brings projects, tasks, people, and progress
                  together in one place so your team spends less time managing
                  work and more time actually doing it.
                </p>
                <Link className={styles.inlineButton} to={primaryHref}>
                  <span>{primaryLabel}</span>
                  <FiArrowRight />
                </Link>
              </div>

              <div className={styles.statsGrid}>
                {stats.map((item) => (
                  <article className={styles.statCard} key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.beliefsSection}>
          <div className={styles.shell}>
            <div className={styles.sectionHeading}>
              <h2>What we believe</h2>
              <p>The principles that shape every decision we make.</p>
            </div>

            <div className={styles.beliefsGrid}>
              {beliefs.map((item) => {
                const Icon = item.icon;
                return (
                  <article className={styles.beliefCard} key={item.title}>
                    <div className={styles.beliefIcon}>
                      <Icon />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.shell}>
            <div className={styles.storyLayout}>
              <div className={styles.storyCard}>
                <p className={styles.sectionLabel}>Our story</p>
                <h2>Built from the frustration of scattered work.</h2>
                <p>
                  TeamTrack was born out of frustration. As a small team
                  shipping ambitious work, we tried every project management
                  tool out there and they all left us wanting more. Some were
                  too rigid, others too complex. Most just got in the way.
                </p>
                <p>
                  So we built the tool we wished existed: opinionated where it
                  should be, flexible where it has to be, and beautiful
                  everywhere it matters. Today, teams across the world use
                  TeamTrack to plan roadmaps, collaborate across time zones, and
                  deliver work they're proud of.
                </p>
                <p>We're just getting started, and we're glad you're here.</p>
              </div>

              <div className={styles.valuesGrid}>
                {values.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article className={styles.valueCard} key={item.title}>
                      <div className={styles.valueIcon}>
                        <Icon />
                      </div>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.shell}>
            <div className={styles.ctaCard}>
              <h2>Ready to see TeamTrack in action?</h2>
              <p>
                Create your free workspace and invite your team in under a
                minute.
              </p>
              <div className={styles.ctaActions}>
                <Link className={styles.ctaPrimaryButton} to={primaryHref}>
                  <span>{primaryLabel}</span>
                  <FiArrowRight />
                </Link>
                <Link className={styles.ctaSecondaryButton} to="/login">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </div>
  );
}
