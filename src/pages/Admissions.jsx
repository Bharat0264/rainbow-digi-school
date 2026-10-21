import EnquiryForm from "../components/ui/EnquiryForm";
import { ArrowRight, Send } from "lucide-react";
import styles from "./AdmissionsHero.module.css";
import { SectionHeading, Faqs } from "../components/ui/PageElements";
import {
  ADMISSION_ROADMAP,
  ADMISSION_ELIGIBILITY,
  ADMISSION_DOCUMENTS,
  ADMISSION_FAQS,
  SCHOOL,
} from "../data/school";

export default function Admissions() {
  return (
    <>
      <section className={`section ${styles.hero}`} aria-labelledby="admissions-hero-title">
        <div className={`site-container ${styles.layout}`}>
          <div className={styles.card}>
            <div className={styles.copy}>
              <p className={`eyebrow ${styles.eyebrow}`}><span className="eyebrow-dot" /> Nursery to Grade V &middot; Admissions 2026&ndash;2027</p>
              <h1 id="admissions-hero-title" className={styles.title}>The Next Chapter<br className={styles.desktopBreak} /> Starts <span className={styles.underlined}>Here.</span><span className={styles.rays} aria-hidden="true"><i /><i /><i /></span></h1>
              <p className={styles.lead}>We welcome families looking for a caring, curiosity-driven educational environment. Learn about our 5-step admissions process, class age guidelines, and documentation, then submit your enquiry below.</p>
              <a className={styles.button} href="#enquiry"><span>Start an admissions enquiry</span><span className={styles.buttonArrow}><ArrowRight size={26} aria-hidden="true" /></span></a>
            </div>
            <div className={styles.flight} aria-hidden="true"><svg viewBox="0 0 270 150" fill="none"><path d="M 4 137 C 99 174 55 20 137 62 S 226 39 245 16" stroke="currentColor" strokeWidth="2" strokeDasharray="7 8" strokeLinecap="round" /></svg><Send size={39} /></div>
          </div>
          <figure className={styles.photo} aria-label={SCHOOL.campusPhoto.alt}>
            <img src={SCHOOL.campusPhoto.src} width={SCHOOL.campusPhoto.width} height={SCHOOL.campusPhoto.height} alt={SCHOOL.campusPhoto.alt} loading="eager" fetchPriority="high" decoding="async" />
          </figure>
        </div>
      </section>

      {/* 5-Step Enrolment Roadmap */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="The enrolment journey"
          title="From first question to your child’s first day."
        >
          A transparent, step-by-step sequence designed to make joining our school
          straightforward and comfortable.
        </SectionHeading>
        <ol className="steps-grid card-grid-5">
          {ADMISSION_ROADMAP.map((item, idx) => {
            const colors = ["clay-yellow", "clay-pink", "clay-mint", "clay-cream", "clay-peach"];
            const color = colors[idx % colors.length];
            return (
              <li
                key={item.step}
                className={`step-card clay-tile ${color} clay-interactive`}
              >
                <span className="feature-index">0{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Class Placement & Age Criteria */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="Class placement"
          title="Age guidelines & learning stages."
        >
          Class allocation is guided by age and developmental readiness. Cutoff
          dates can be confirmed directly during your admissions conversation.
        </SectionHeading>
        <div className="feature-grid card-grid-5">
          {ADMISSION_ELIGIBILITY.map((item, idx) => {
            const colors = ["clay-mint", "clay-pink", "clay-yellow", "clay-cream", "clay-mint"];
            const color = colors[idx % colors.length];
            return (
              <article
                key={item.stage}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index">{item.age}</span>
                  <h3>{item.stage}</h3>
                </div>
                <p>{item.focus}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Required Documentation Checklist */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="Documentation checklist"
          title="Documents to prepare for enrolment."
        >
          To complete formal enrolment after initial discussions, please have
          these standard verification records ready for the school office.
        </SectionHeading>
        <div className="feature-grid card-grid-5">
          {ADMISSION_DOCUMENTS.map((doc, idx) => {
            const colors = ["clay-cream", "clay-yellow", "clay-pink", "clay-mint", "clay-cream"];
            const color = colors[idx % colors.length];
            return (
              <article
                key={doc.name}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index">✓</span>
                  <h3>{doc.name}</h3>
                </div>
                <p>{doc.detail}</p>
              </article>
            );
          })}
        </div>
        <div
          className="information-note clay-tile clay-cream"
          style={{ marginTop: "28px" }}
        >
          <p>
            Please note: Submitting an online enquiry does not require uploading
            identity documents. Keep these records ready for your in-person
            verification visit.
          </p>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry" className="section soft-section">
        <div className="site-container enquiry-layout">
          <div className="enquiry-intro-col">
            <div className="clay-tile clay-cream">
              <SectionHeading
                eyebrow="Admissions form"
                title="Send your admissions enquiry."
              >
                Share your contact details and child’s prospective class so our
                team can connect with you regarding current openings.
              </SectionHeading>
            </div>
            <div
              className="contact-short clay-tile clay-pink"
              style={{ marginTop: "24px" }}
            >
              <h3>Prefer an immediate conversation?</h3>
              <p style={{ fontSize: "14px", margin: "8px 0 16px" }}>
                Our admissions desk is available on weekdays to answer your
                questions directly.
              </p>
              <div className="phone-pills">
                {SCHOOL.contact.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="clay-btn clay-btn-cream contact-pill"
                  >
                    <span>{phone.label}</span>
                  </a>
                ))}
              </div>
              <a
                href={"mailto:" + SCHOOL.contact.email}
                className="clay-btn clay-btn-cream contact-pill email-pill"
                style={{ marginTop: "12px", display: "inline-flex" }}
              >
                <span>{SCHOOL.contact.email}</span>
              </a>
            </div>
          </div>
          <div className="form-surface clay-tile clay-cream" style={{ alignSelf: "start" }}>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Admissions-Specific FAQ Grid */}
      <section className="section site-container faq-grid">
        <div className="clay-tile clay-cream faq-header-card">
          <SectionHeading
            eyebrow="Admissions questions"
            title="Helpful answers about applying."
          >
            Clear information regarding seat availability, fees, visits, and
            timelines.
          </SectionHeading>
        </div>
        <div>
          <Faqs items={ADMISSION_FAQS} />
        </div>
      </section>
    </>
  );
}
