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

      {/* Contact Bento Grid (Alternating Clay Shapes) */}
      <section className="section site-container contact-bento">
        {/* Card 1: Call admissions */}
        <div className="contact-card contact-card-call clay-tile clay-yellow clay-interactive">
          <div className="contact-card-icon" aria-hidden="true">
            <Phone size={20} color="#342407" />
          </div>
          <h2>Call admissions</h2>
          <div className="contact-chips-row">
            {SCHOOL.contact.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="clay-btn clay-btn-cream contact-chip"
              >
                <span>{phone.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Card 2: Write to us */}
        <div className="contact-card contact-card-write clay-tile clay-mint clay-interactive">
          <div className="contact-card-icon" aria-hidden="true">
            <Mail size={20} color="#17322a" />
          </div>
          <h2>Write to us</h2>
          <div className="contact-chips-row">
            <a
              href={"mailto:" + SCHOOL.contact.email}
              className="clay-btn clay-btn-cream contact-chip contact-email-chip"
            >
              <span>{SCHOOL.contact.email}</span>
            </a>
          </div>
        </div>

        {/* Card 3: Find our school */}
        <div className="contact-card contact-card-find clay-tile clay-pink clay-interactive">
          <div className="contact-card-icon" aria-hidden="true">
            <MapPin size={20} color="#361f17" />
          </div>
          <h2>Find our school</h2>
          <div className="contact-text-block">
            <address className="contact-address">{SCHOOL.contact.address}</address>
            <p className="section-note contact-visit-note">
              Please call before travelling to confirm a suitable time to visit.
            </p>
          </div>
          <div className="contact-card-actions">
            <a
              className="button button-secondary clay-btn clay-btn-cream contact-chip contact-directions-chip"
              href={SCHOOL.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Open directions in Google Maps</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Card 4: Admissions */}
        <div className="contact-card contact-card-admissions clay-tile clay-cream">
          <p className="eyebrow contact-admissions-eyebrow">
            <span className="eyebrow-dot" /> Admissions
          </p>
          <h2 className="contact-admissions-heading">Looking for admissions?</h2>
          <p className="contact-admissions-text">
            If you have questions about our Nursery to Grade V programmes, fees, availability, or the admissions process, please use our dedicated admissions enquiry form.
          </p>
          <div className="contact-admissions-action">
            <Link
              to="/admissions#enquiry"
              className="button button-primary clay-btn clay-btn-yellow contact-chip contact-admissions-chip"
            >
              <span>Go to Admissions</span>
            </Link>
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
