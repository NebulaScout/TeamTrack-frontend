import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiMessageSquare,
  FiShield,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "@/styles/home.module.css";
import LandingPageHeader from "@/components/LandingPageHeader";
import LandingPageFooter from "@/components/LandingPageFooter";

const features = [
  {
    icon: FiGrid,
    title: "Projects & Tasks",
    description:
      "Organize work into projects, break it down into tasks, and keep everyone aligned on what's next.",
  },
  {
    icon: FiUsers,
    title: "Team Collaboration",
    description:
      "Assign teammates, leave comments, and discuss work right where it happens.",
  },
  {
    icon: FiCalendar,
    title: "Calendar View",
    description:
      "Visualize deadlines and milestones on a shared calendar so nothing slips through.",
  },
  {
    icon: FiBarChart2,
    title: "Reports & Insights",
    description:
      "Track progress, productivity, and bottlenecks with built-in dashboards.",
  },
  {
    icon: FiBell,
    title: "Smart Notifications",
    description: "Stay in the loop on the work that matters without the noise.",
  },
  {
    icon: FiShield,
    title: "Role-based Access",
    description:
      "Admins, moderators, and members each get the right level of access and control.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your workspace",
    description: "Sign up and invite your teammates with a single link.",
  },
  {
    number: "02",
    title: "Set up projects",
    description: "Add projects, assign roles, and break work into clear tasks.",
  },
  {
    number: "03",
    title: "Track and ship",
    description: "Collaborate in real time and watch progress unfold.",
  },
];

const boardColumns = [
  {
    title: "To Do",
    count: 3,
    cards: [
      {
        title: "Plan onboarding flow",
        subtitle: "UI polish and copy review",
      },
      {
        title: "Set release milestones",
        subtitle: "Confirm dates with stakeholders",
      },
      {
        title: "Review task permissions",
        subtitle: "Make sure roles behave correctly",
      },
    ],
  },
  {
    title: "In Progress",
    count: 2,
    cards: [
      {
        title: "Dashboard cards",
        subtitle: "Improve spacing and hierarchy",
      },
      {
        title: "Notification pipeline",
        subtitle: "Reduce noise and surface priority",
      },
    ],
  },
  {
    title: "Done",
    count: 1,
    cards: [
      {
        title: "Project overview",
        subtitle: "Landing panel and quick stats",
      },
    ],
  },
];

export default function Home() {
  const { isAuthenticated, homeRoute } = useAuth();

  const primaryHref = isAuthenticated ? homeRoute || "/dashboard" : "/register";
  const primaryLabel = isAuthenticated ? "Open app" : "Start for free";
  const secondaryHref = isAuthenticated ? "/projects" : "/login";
  const secondaryLabel = isAuthenticated ? "View projects" : "Sign in";

  return (
    <div className={styles.page}>
      <LandingPageHeader />

      <main>
        <section className={styles.hero}>
          <div className={styles.shell}>
            <div className={styles.heroBadge}>
              <FiStar />
              <span>Built for modern teams</span>
            </div>

            <h1 className={styles.heroTitle}>
              Plan projects, track tasks, <span>ship together.</span>
            </h1>

            <p className={styles.heroText}>
              TeamTrack is the all-in-one workspace where teams break down work,
              stay accountable, and move fast in one beautifully simple place.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.heroPrimaryButton} to={primaryHref}>
                <span>{primaryLabel}</span>
                <FiArrowRight />
              </Link>
              <a className={styles.heroSecondaryButton} href="#about">
                Learn more
              </a>
            </div>

            <p className={styles.heroMeta}>
              No credit card required · Free for small teams
            </p>

            <div className={styles.showcase} aria-label="Project board preview">
              <div className={styles.windowBar} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className={styles.board}>
                {boardColumns.map((column) => (
                  <article className={styles.column} key={column.title}>
                    <div className={styles.columnHeader}>
                      <h2>{column.title}</h2>
                      <span>{column.count}</span>
                    </div>

                    <div className={styles.cardStack}>
                      {column.cards.map((card, index) => (
                        <div
                          className={styles.card}
                          key={`${column.title}-${index}`}
                        >
                          <div className={styles.cardLine} />
                          <div className={styles.cardLineShort} />
                          <div className={styles.cardMeta}>
                            <div className={styles.avatarGroup}>
                              <span className={styles.avatarBlue} />
                              <span className={styles.avatarGreen} />
                            </div>
                            <span className={styles.cardPill} />
                          </div>
                          <h3>{card.title}</h3>
                          <p>{card.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="about">
          <div className={styles.shell}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionEyebrow}>Everything in one place</p>
              <h2>Everything your team needs in one place</h2>
              <p>
                Stop juggling tools. TeamTrack brings projects, tasks,
                conversations, and reporting together so your team can focus on
                the work.
              </p>
            </div>

            <div className={styles.featureGrid}>
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article className={styles.featureCard} key={feature.title}>
                    <div className={styles.featureIcon}>
                      <Icon />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionEyebrow}>Simple rollout</p>
              <h2>Get your team moving in minutes</h2>
            </div>

            <div className={styles.stepsGrid}>
              {steps.map((step) => (
                <article className={styles.stepCard} key={step.number}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>

            <div className={styles.ctaPanel}>
              <div className={styles.ctaCopy}>
                <h2>Ready to bring clarity to your team&apos;s work?</h2>
                <p>
                  Join teams using TeamTrack to plan smarter, collaborate
                  better, and deliver on time.
                </p>
              </div>

              <div className={styles.ctaActions}>
                <Link className={styles.ctaPrimaryButton} to={primaryHref}>
                  <span>{primaryLabel}</span>
                  <FiArrowRight />
                </Link>
                <Link className={styles.ctaSecondaryButton} to={secondaryHref}>
                  {secondaryLabel}
                </Link>
              </div>

              <div className={styles.ctaNotes}>
                <span>
                  <FiCheckCircle />
                  Free forever plan
                </span>
                <span>
                  <FiClock />
                  Setup in minutes
                </span>
                <span>
                  <FiMessageSquare />
                  Built for collaboration
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </div>
  );
}
