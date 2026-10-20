import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  ACADEMIC_PROGRAMMES,
  LEARNING_METHODOLOGY,
  PARENT_CURRICULUM_QUESTIONS,
  SCHOOL,
} from "../data/school";
import {
  PageIntro,
  SectionHeading,
  ArrowLink,
} from "../components/ui/PageElements";

export default function Academics() {
  const { earlyYears, primaryYears } = ACADEMIC_PROGRAMMES;

  return (
    <>
      <PageIntro
        eyebrow="Curriculum & Learning"
        title="Foundations for Curious Minds."
      >
        <p>
          At Rainbow Digi School, we nurture a lifelong love for learning. Explore
          our educational approach across the early childhood and primary years,
          from Nursery through Grade V.
        </p>
      </PageIntro>

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
