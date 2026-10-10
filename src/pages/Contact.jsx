import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { SCHOOL } from "../data/school";
import EnquiryForm from "../components/ui/EnquiryForm";
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
      <section className="section site-container contact-grid">
        <div className="contact-details">
          <div>
            <Phone aria-hidden="true" />
            <h2>Call admissions</h2>
            {SCHOOL.contact.phones.map((phone) => (
              <a key={phone.href} href={phone.href}>
                {phone.label}
              </a>
            ))}
          </div>
          <div>
            <Mail aria-hidden="true" />
            <h2>Write to us</h2>
            <a href={"mailto:" + SCHOOL.contact.email}>
              {SCHOOL.contact.email}
            </a>
          </div>
          <div>
            <MapPin aria-hidden="true" />
            <h2>Find our school</h2>
            <address>{SCHOOL.contact.address}</address>
            <a
              className="text-link"
              href={SCHOOL.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open directions in Google Maps{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <p className="section-note">
              Please call before travelling to confirm a suitable time to visit.
            </p>
          </div>
        </div>
        <div className="form-surface">
          <SectionHeading
            eyebrow="An easy first step"
            title="Send your enquiry."
          />
          <EnquiryForm idPrefix="contact" />
        </div>
      </section>
      <section className="community-band">
        <div className="site-container intro-grid">
          <SectionHeading
            eyebrow="Keep in touch"
            title="A window into school life."
          />
          <div className="editorial-copy">
            <p>
              Follow the school’s own updates, celebrations, and announcements.
            </p>
            <a
              className="text-link"
              href={SCHOOL.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Rainbow Digi School on Instagram{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
