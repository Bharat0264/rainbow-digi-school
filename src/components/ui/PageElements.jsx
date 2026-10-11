import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ADMISSION_FAQ, SCHOOL } from "../../data/school";

export function ArrowLink({ to, children, className = "" }) {
  return (
    <Link className={"text-link " + className} to={to}>
      <span>{children}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function PageIntro({ eyebrow, title, children }) {
  return (
    <section className="page-intro">
      <div className="site-container">
        <div className="page-intro-card clay-tile clay-cream">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> {eyebrow}
          </p>
          <h1>{title}</h1>
          {children && <div className="page-lead">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      {eyebrow && (
        <p className="eyebrow">
          <span className="eyebrow-dot" /> {eyebrow}
        </p>
      )}
      <h2>{title}</h2>
      {children && <p className="section-description">{children}</p>}
    </div>
  );
}

export function AdmissionsInvite() {
  return (
    <section
      className="admissions-invite-section site-container"
      aria-labelledby="invite-title"
    >
      <div className="admissions-invite clay-tile clay-pink clay-shape-capsule clay-interactive">
        <div className="invite-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> A good beginning starts with a conversation
          </p>
          <h2 id="invite-title">Let’s talk about your child’s next chapter.</h2>
          <p>
            Ask about classes, the learning approach, and what to consider before
            applying.
          </p>
        </div>
        <div className="invite-action">
          <Link className="button button-primary clay-btn-yellow" to="/admissions#enquiry">
            <span>Enquire about admissions</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Faqs({ items = ADMISSION_FAQ }) {
  return (
    <div className="faq-list">
      {items.map((item, idx) => {
        const colors = ["clay-cream", "clay-pink", "clay-mint", "clay-yellow"];
        const color = colors[idx % colors.length];
        return (
          <details key={item.q} className={`clay-tile ${color}`}>
            <summary>
              <span>{item.q}</span>
              <span className="faq-toggle-btn" aria-hidden="true">+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        );
      })}
    </div>
  );
}

export function CampusPhoto({
  priority = false,
  className = "",
  caption = true,
}) {
  return (
    <figure className={"campus-photo " + className}>
      <img
        {...SCHOOL.campusPhoto}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
      {caption && (
        <figcaption>Our school exterior · Kandlakoya, Hyderabad</figcaption>
      )}
    </figure>
  );
}
