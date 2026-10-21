import styles from "./ContactAdmissions.module.css";
import admissionsChild from "../assets/contact-admissions-child.webp";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowRight, ArrowUpRight } from "lucide-react";
import { SCHOOL } from "../data/school";
import { PageIntro, SectionHeading } from "../components/ui/PageElements";

export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="Contact Rainbow DIGI School"
        title="Good questions are always welcome."
      >
        <p>
          Speak with the school about learning, admissions, or a possible visit
          to our Kandlakoya campus.
        </p>
      </PageIntro>

      <section className={`section site-container contact-bento ${styles.section}`} aria-label="Contact and admissions">
        <div className="contact-card contact-card-admissions clay-tile clay-cream">
          <p className="eyebrow contact-admissions-eyebrow">
            <span className="eyebrow-dot" /> Admissions
          </p>
          <h2 className="contact-admissions-heading">Looking for <span className={styles.underline}>admissions?</span></h2>
          <p className="contact-admissions-text">
            If you have questions about our Nursery to Grade V programmes, fees,
            availability, or the admissions process, please use our dedicated
            admissions enquiry form.
          </p>
          <div className="contact-admissions-action">
            <Link to="/admissions#enquiry" className="contact-chip contact-admissions-chip">
              <span>Go to Admissions</span>
              <ArrowRight size={23} aria-hidden="true" />
            </Link>
          </div>
          <img className={styles.illustration} src={admissionsChild} alt="" aria-hidden="true" width="1024" height="1024" loading="lazy" />
        </div>

        <div className="contact-methods">
          <div className="contact-card contact-card-call clay-tile clay-yellow">
            <div className="contact-card-icon" aria-hidden="true"><Phone /></div>
            <div className="contact-card-content">
              <h2>Call admissions</h2>
              <div className="contact-chips-row">
                {SCHOOL.contact.phones.map(phone => (
                  <a key={phone.href} href={phone.href} className="contact-chip">
                    <Phone size={17} aria-hidden="true" /><span>{phone.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-card contact-card-write clay-tile clay-mint">
            <div className="contact-card-icon" aria-hidden="true"><Mail /></div>
            <div className="contact-card-content">
              <h2>Write to us</h2>
              <div className="contact-chips-row">
                <a href={"mailto:" + SCHOOL.contact.email} className="contact-chip contact-email-chip">
                  <Mail size={17} aria-hidden="true" /><span>{SCHOOL.contact.email}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-card contact-card-find clay-tile clay-pink">
            <div className="contact-card-icon" aria-hidden="true"><MapPin /></div>
            <div className="contact-card-content">
              <h2>Find our school</h2>
              <div className="contact-text-block">
                <address className="contact-address">{SCHOOL.contact.address}</address>
                <p className="contact-visit-note">Please call before travelling to confirm a suitable time to visit.</p>
              </div>
              <div className="contact-card-actions">
                <a className="contact-chip contact-directions-chip" href={SCHOOL.contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={21} className="contact-map-pin" aria-hidden="true" />
                  <span>Open directions in Google Maps</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Band */}
      <section className="section site-container community-band-section">
        <div className="community-band clay-tile clay-cream clay-shape-blob">
          <div className="intro-grid">
            <SectionHeading
              eyebrow="Keep in touch"
              title="A window into school life."
            />
            <div className="editorial-copy">
              <p>
                Follow the school’s own updates, celebrations, and announcements.
              </p>
              <div style={{ marginTop: "20px" }}>
                <a
                  className="button button-secondary clay-btn-mint"
                  href={SCHOOL.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Rainbow Digi School on Instagram</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
