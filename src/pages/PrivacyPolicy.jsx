import { SCHOOL } from "../data/school";
import { PageIntro } from "../components/ui/PageElements";
export default function PrivacyPolicy() {
  return (
    <>
      <PageIntro
        eyebrow="Website privacy information"
        title="Your enquiry, handled thoughtfully."
      >
        <p>
          This notice explains the information requested by this website’s
          admissions form and the choices available to you.
        </p>
      </PageIntro>
      <article className="section site-container privacy-copy">
        <h2>What the enquiry form asks for</h2>
        <p>
          The form requests a parent or guardian’s name, mobile number, and
          prospective class. Email and a short message are optional. It records
          agreement to be contacted about the enquiry. Please do not include a
          child’s full name, identity documents, medical details, or other
          sensitive information.
        </p>
        <h2>What happens when you submit</h2>
        <p>
          The website sends the enquiry to its server. A successful submission
          is saved with a reference number, creation time, and a record of your
          contact consent. You will only see a saved confirmation when the
          server returns that reference. The form does not book a visit, secure
          a place, or confirm admission.
        </p>
        <p>
          If saving cannot be confirmed, the website displays an error. You can
          instead call or email the school. A saved reference does not mean an
          email or WhatsApp notification has been sent.
        </p>
        <h2>Why these details are requested</h2>
        <p>
          Your contact details allow the school to respond to your questions
          about admissions. Please ask the school directly about who can access
          enquiry records, its retention period, or a request to correct or
          delete information. We do not state a fixed retention period because
          one has not been confirmed for publication.
        </p>
        <h2>Website services and external links</h2>
        <p>
          The site is hosted on Vercel and loads typefaces from Google Fonts.
          Requests to these services can include technical information such as
          your IP address and browser details. This release does not add
          advertising cookies, an analytics tracker, or a social-feed embed.
        </p>
        <p>
          Google Maps and Instagram open only when you follow their links. Those
          services have their own privacy practices. Calling or emailing the
          school uses your device’s selected application.
        </p>
        <h2>Contact the school</h2>
        <p>
          For questions about an enquiry or use of your details, email{" "}
          <a href={"mailto:" + SCHOOL.contact.email}>{SCHOOL.contact.email}</a>{" "}
          or call{" "}
          {SCHOOL.contact.phones.map((phone, i) => (
            <span key={phone.href}>
              {i ? " or " : ""}
              <a href={phone.href}>{phone.label}</a>
            </span>
          ))}
          .
        </p>
        <p>{SCHOOL.contact.address}</p>
      </article>
    </>
  );
}
