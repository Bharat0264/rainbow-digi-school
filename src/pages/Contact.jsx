import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
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

      {/* Contact Bento Grid */}
      <section className="section site-container contact-grid">
        <div className="contact-details">
          <div className="contact-detail-card glass-card glass-card--interactive">
            <span className="glass-specular" aria-hidden="true" />
            <div className="contact-icon-pill">
              <Phone aria-hidden="true" size={22} />
            </div>
            <h2>Call admissions</h2>
            <div className="phone-pills" style={{ marginTop: "12px" }}>
              {SCHOOL.contact.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="contact-pill">
                  <span>{phone.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-detail-card glass-card glass-card--interactive">
            <span className="glass-specular" aria-hidden="true" />
            <div className="contact-icon-pill">
              <Mail aria-hidden="true" size={22} />
            </div>
            <h2>Write to us</h2>
            <div style={{ marginTop: "12px" }}>
              <a href={"mailto:" + SCHOOL.contact.email} className="contact-pill email-pill">
                <span>{SCHOOL.contact.email}</span>
              </a>
            </div>
          </div>

          <div className="contact-detail-card glass-card glass-card--interactive">
            <span className="glass-specular" aria-hidden="true" />
            <div className="contact-icon-pill">
              <MapPin aria-hidden="true" size={22} />
            </div>
            <h2>Find our school</h2>
            <address style={{ marginTop: "10px" }}>{SCHOOL.contact.address}</address>
            <div style={{ marginTop: "16px" }}>
              <a
                className="button button-secondary"
                href={SCHOOL.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Open directions in Google Maps</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <p className="section-note" style={{ marginTop: "14px" }}>
              Please call before travelling to confirm a suitable time to visit.
            </p>
          </div>
        </div>

        <div className="form-surface glass-card" style={{ alignSelf: "start" }}>
          <span className="glass-specular" aria-hidden="true" />
          <SectionHeading
            eyebrow="Admissions"
            title="Looking for admissions?"
          />
          <p style={{ marginBottom: "24px" }}>
            If you have questions about our Nursery to Grade V programmes, fees, availability, or the admissions process, please use our dedicated admissions enquiry form.
          </p>
          <Link to="/admissions#enquiry" className="button button-primary">
            <span>Go to Admissions</span>
          </Link>
        </div>
      </section>

      {/* Community Band */}
      <section className="section site-container community-band-section">
        <div className="community-band glass-card">
          <span className="glass-specular" aria-hidden="true" />
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
                  className="button button-secondary"
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
