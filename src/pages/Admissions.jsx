import EnquiryForm from "../components/ui/EnquiryForm";
import { PageIntro, SectionHeading, Faqs } from "../components/ui/PageElements";
import { ADMISSION_STEPS, SCHOOL } from "../data/school";

export default function Admissions() {
  return (
    <>
      <PageIntro
        eyebrow="Nursery to Grade V · Admissions enquiries"
        title="The next chapter starts here."
      >
        <p>
          Tell us which class you’re interested in. Ask about the learning
          programme, current availability, and the next steps for your family.
        </p>
        <div className="page-intro-actions">
          <a className="button button-primary clay-btn-yellow" href="#enquiry">
            <span>Start an enquiry</span>
          </a>
        </div>
      </PageIntro>

      {/* Admission Steps Bento Grid (Alternating Raised Pastel Tiles) */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="A clear starting point"
          title="From first question to next step."
        />
        <ol className="steps-grid">
          {ADMISSION_STEPS.map((step, idx) => {
            const colors = ["clay-yellow", "clay-pink", "clay-mint"];
            const color = colors[idx % colors.length];
            return (
              <li key={step.step} className={`step-card clay-tile ${color} clay-interactive`}>
                <span className="feature-index">0{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>
        <div className="information-note clay-tile clay-cream" style={{ marginTop: "28px" }}>
          <p>
            Enquiries are welcome. Class availability, fees, eligibility,
            documents, and any visit appointment must be confirmed by the school.
            An enquiry is not an admission offer or a booking.
          </p>
        </div>
      </section>

      {/* Enquiry Form Bento Layout */}
      <section id="enquiry" className="section soft-section">
        <div className="site-container enquiry-layout">
          <div className="enquiry-intro-col">
            <div className="clay-tile clay-cream">
              <SectionHeading
                eyebrow="Let’s begin with your questions"
                title="Enquire about admissions."
              >
                Share only the details needed for the school to contact you.
              </SectionHeading>
            </div>
            <div className="contact-short clay-tile clay-pink" style={{ marginTop: "24px" }}>
              <h3>Prefer a conversation?</h3>
              <div className="phone-pills">
                {SCHOOL.contact.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="clay-btn clay-btn-cream contact-pill">
                    <span>{phone.label}</span>
                  </a>
                ))}
              </div>
              <a href={"mailto:" + SCHOOL.contact.email} className="clay-btn clay-btn-cream contact-pill email-pill" style={{ marginTop: "12px" }}>
                <span>{SCHOOL.contact.email}</span>
              </a>
            </div>
          </div>
          <div className="form-surface clay-tile clay-cream" style={{ alignSelf: "start" }}>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* FAQ Bento Grid */}
      <section className="section site-container faq-grid">
        <div className="clay-tile clay-cream">
          <SectionHeading
            eyebrow="Before you apply"
            title="Useful answers for parents."
          />
        </div>
        <div>
          <Faqs />
        </div>
      </section>
    </>
  );
}
