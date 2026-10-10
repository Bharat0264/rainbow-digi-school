import EnquiryForm from "../components/ui/EnquiryForm";
import { PageIntro, SectionHeading, Faqs } from "../components/ui/PageElements";
import { ADMISSION_STEPS, SCHOOL } from "../data/school";

export default function Admissions() {
  return <>
    <PageIntro eyebrow="Nursery to Grade V · Admissions enquiries" title="The next chapter starts here."><p>Tell us which class you’re interested in and ask about the learning programme, availability and next steps for your family.</p><a className="button button-primary" href="#enquiry">Start an enquiry</a></PageIntro>
    <section className="section site-container"><SectionHeading eyebrow="A clear starting point" title="From first question to next step." /><ol className="steps-grid">{ADMISSION_STEPS.map((step) => <li key={step.step}><span className="feature-index">0{step.step}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol><p className="information-note">Fees, availability and eligibility are confirmed by the school on enquiry.</p></section>
    <section id="enquiry" className="section soft-section"><div className="site-container enquiry-layout"><div><SectionHeading eyebrow="Let’s begin with your questions" title="Enquire about admissions.">Share only the details needed for the school to contact you.</SectionHeading><div className="contact-short"><h3>Prefer to talk?</h3>{SCHOOL.contact.phones.map((phone) => <a key={phone.href} href={phone.href}>{phone.label}</a>)}</div></div><div className="form-surface"><EnquiryForm /></div></div></section>
    <section className="section site-container faq-grid"><SectionHeading eyebrow="Before you apply" title="Useful answers for parents." /><Faqs /></section>
  </>;
}
