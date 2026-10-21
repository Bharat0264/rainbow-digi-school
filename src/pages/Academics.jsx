import styles from "./CurriculumIntro.module.css";
import readingArt from "../assets/curriculum-reading.webp";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  ACADEMIC_PROGRAMMES,
  LEARNING_METHODOLOGY,
  PARENT_CURRICULUM_QUESTIONS,
  SCHOOL,
} from "../data/school";
import {
  SectionHeading,
  ArrowLink,
} from "../components/ui/PageElements";

export default function Academics() {
  const { earlyYears, primaryYears } = ACADEMIC_PROGRAMMES;

  return (
    <>
      <section className={`section page-intro ${styles.intro}`}>
        <div className="site-container">
          <div className="page-intro-card clay-tile clay-cream">
            <p className="eyebrow"><span className="eyebrow-dot" /> Curriculum &amp; Learning</p>
            <h1>Foundations for <span className={styles.underline}>Curious Minds.</span></h1>
            <div className="page-lead"><p>
              At Rainbow Digi School, we nurture a lifelong love for learning. Explore
              our educational approach across the early childhood and primary years,
              from Nursery through Grade V.
            </p></div>
            <div className={styles.art} aria-hidden="true">
              <div className={styles.glow} />
              <svg className={styles.doodles} viewBox="0 0 360 220" fill="none">
                <path d="M12 205C0 103 65 37 153 60S255 3 339 76" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 7" />
                <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M107 60C106 50 97 48 97 36A20 20 0 01137 36C137 48 128 50 127 60L107 64L107 60ZM108 68L126 65M111 73L123 71M114 58L112 39L118 44L123 38L121 57M116 5L115 0M88 14L83 10M146 16L151 11M88 39L81 40M146 36L153 34" />
                  <path d="M292 49L310 39L329 60L310 70L292 49ZM310 39L328 29L347 50L329 60M302 49L310 45M306 54L314 50M321 39L329 35M325 44L333 40M310 70L314 74L351 53L347 50" />
                </g>
              </svg>
              <img src={readingArt} width="1100" height="733" alt="" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Framework Bento */}
      <section id="curriculum" className="section site-container intro-grid">
        <div className="clay-tile clay-cream curriculum-overview">
          <SectionHeading
            eyebrow="Curriculum framework"
            title="A structured, child-centred approach."
          >
            A clear understanding of how our classroom learning is planned and
            delivered.
          </SectionHeading>
          <ul className="curriculum-stages" aria-label="Learning stages">
            <li>
              <strong>{earlyYears.grades}</strong>
              <span>Play, phonics and early number skills.</span>
            </li>
            <li>
              <strong>{primaryYears.grades}</strong>
              <span>Literacy, mathematics and guided inquiry.</span>
            </li>
          </ul>
          <a href="#early-years" className="button button-primary curriculum-programmes-link">
            <span>Explore our programmes</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="editorial-copy clay-tile clay-mint">
          <p>
            Rainbow Digi School delivers a curriculum aligned with CBSE learning
            standards, designed to build strong foundations in literacy,
            mathematics, environmental inquiry, and bilingual communication.
          </p>
          <div
            className="information-note clay-tile clay-cream"
            style={{ marginBlock: "18px" }}
          >
            <p>{SCHOOL.curriculumNote}</p>
          </div>
          <ArrowLink to="/admissions#enquiry">
            Discuss syllabus details with our team
          </ArrowLink>
        </div>
      </section>

      {/* Stage 1: Early Childhood Education (Nursery, LKG, UKG) */}
      <section id="early-years" className="section site-container">
        <div className="section-row">
          <SectionHeading
            eyebrow="Stage 1: Early childhood"
            title="Nursery, LKG & UKG: Joyful Beginnings."
          >
            {earlyYears.overview}
          </SectionHeading>
        </div>
        <div className="feature-grid card-grid-4">
          {earlyYears.pillars.map((pillar, idx) => {
            const colors = ["clay-yellow", "clay-pink", "clay-mint", "clay-peach"];
            const color = colors[idx % colors.length];
            return (
              <article
                key={pillar.title}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index">0{idx + 1}</span>
                  <h3>{pillar.title}</h3>
                </div>
                <p>{pillar.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Stage 2: Primary Years Programme (Grades I to V) */}
      <section id="primary-years" className="section site-container">
        <div className="section-row">
          <SectionHeading
            eyebrow="Stage 2: Primary education"
            title="Grades I to V: Conceptual Mastery."
          >
            {primaryYears.overview}
          </SectionHeading>
        </div>
        <div className="feature-grid card-grid-4">
          {primaryYears.pillars.map((pillar, idx) => {
            const colors = ["clay-slate", "clay-mint", "clay-yellow", "clay-pink"];
            const color = colors[idx % colors.length];
            const isSlate = color === "clay-slate";
            return (
              <article
                key={pillar.title}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index" style={{ color: isSlate ? "#FFFFFF" : undefined }}>
                    0{idx + 1}
                  </span>
                  <h3 style={{ color: isSlate ? "#FFFFFF" : undefined }}>
                    {pillar.title}
                  </h3>
                </div>
                <p style={{ color: isSlate ? "#E8F0EE" : undefined }}>
                  {pillar.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Teaching Methodology Section */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="Classroom pedagogy"
          title="How learning happens every day."
        >
          We replace rote memorisation with active discovery, guided
          exploration, and meaningful teacher-student discussions.
        </SectionHeading>
        <div className="feature-grid card-grid-3">
          {LEARNING_METHODOLOGY.map((method, idx) => {
            const colors = ["clay-pink", "clay-yellow", "clay-mint"];
            const color = colors[idx % colors.length];
            return (
              <article
                key={method.title}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index">0{idx + 1}</span>
                  <h3>{method.title}</h3>
                </div>
                <p>{method.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Parent Curriculum Discussion Guide */}
      <section className="section site-container community-band-section">
        <div className="community-band clay-tile clay-cream clay-shape-blob">
          <div className="intro-grid">
            <SectionHeading
              eyebrow="For thoughtful families"
              title="Helpful questions to ask about our curriculum."
            >
              When you speak with our academic team, these practical questions can
              help you understand how our teaching aligns with your child’s needs.
            </SectionHeading>
            <div className="editorial-copy">
              <ul className="check-list" style={{ marginBottom: "28px" }}>
                {PARENT_CURRICULUM_QUESTIONS.map((question) => (
                  <li key={question}>
                    <span className="check-bullet" aria-hidden="true">✓</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/admissions#enquiry"
                className="button button-primary clay-btn-yellow"
                style={{ display: "inline-flex" }}
              >
                <span>Ask about admissions for your child</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
