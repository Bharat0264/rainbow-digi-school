import { Link } from "react-router-dom";
import { SCHOOL } from "../../data/school";
import Logo from "../ui/Logo";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="Rainbow Digi School home">
            <Logo />
          </Link>
          <p>{SCHOOL.tagline}</p>
          <address>{SCHOOL.contact.address}</address>
        </div>
        <div>
          <h2>Explore our school</h2>
          <nav aria-label="Footer navigation">
            {[
              ["/about", "About Rainbow"],
              ["/academics", "Curriculum & learning"],
              ["/campus", "Our campus"],
              ["/events", "Student life"],
              ["/admissions", "Admissions"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Start a conversation</h2>
          {SCHOOL.contact.phones.map((phone) => (
            <a key={phone.href} href={phone.href}>
              {phone.label}
            </a>
          ))}
          <a href={"mailto:" + SCHOOL.contact.email}>{SCHOOL.contact.email}</a>
          <a
            href={SCHOOL.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions to the school ↗
          </a>
          <a
            href={SCHOOL.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            School updates on Instagram ↗
          </a>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>© Rainbow DIGI School</span>
        <Link to="/privacy-policy">Privacy information</Link>
        <a
          href="https://my-work-umber.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Crafted by Garuda ↗
        </a>
      </div>
    </footer>
  );
}
