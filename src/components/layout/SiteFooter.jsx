import { Link } from "react-router-dom";
import { SCHOOL } from "../../data/school";
import Logo from "../ui/Logo";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="Rainbow Digi School home"><Logo /></Link>
          <p>{SCHOOL.tagline}</p>
          <address>{SCHOOL.contact.address}</address>
        </div>
        <div>
          <h2>Explore our school</h2>
          <nav aria-label="Footer navigation">
            {[["/", "Home"], ["/academics", "Academics"], ["/campus-life", "Campus & Life"], ["/contact", "Contact"], ["/admissions", "Apply"]].map(([to, label]) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Start a conversation</h2>
          {SCHOOL.contact.phones.map((phone) => <a key={phone.href} href={phone.href}>{phone.label}</a>)}
          <a href={`mailto:${SCHOOL.contact.email}`}>{SCHOOL.contact.email}</a>
          <a href={SCHOOL.contact.mapsUrl} target="_blank" rel="noopener noreferrer">Directions to the school ↗</a>
          <a href={SCHOOL.social.instagram} target="_blank" rel="noopener noreferrer">School updates on Instagram ↗</a>
          <p className="footer-confirmation">Fees, availability and eligibility are confirmed by the school on enquiry.</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>© Rainbow Digi School</span>
        <Link to="/privacy-policy">Privacy information</Link>
        <a href="https://my-work-umber.vercel.app/" target="_blank" rel="noopener noreferrer">Crafted by Garuda ↗</a>
      </div>
    </footer>
  );
}
