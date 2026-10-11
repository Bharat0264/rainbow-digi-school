import { Link } from "react-router-dom";
import { SCHOOL } from "../../data/school";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        {/* Left Column: Brand Block (Row 1: Logo | Divider | Text Stack, Row 2: Map Pin + Address) */}
        <div className="footer-brand">
          <div className="footer-brand-row">
            <Link
              to="/"
              className="footer-logo-link"
              aria-label="Rainbow Digi School home"
            >
              <img
                src="/images/rainbow-logo-embroidered.webp"
                alt="Rainbow Digi School logo"
                width={133}
                height={64}
                loading="lazy"
                decoding="async"
                className="footer-logo-img"
              />
            </Link>
            <div className="footer-brand-divider" aria-hidden="true" />
            <div className="footer-text-stack">
              <span className="footer-school-name">Rainbow Digi School</span>
              <span className="footer-tagline">Excellence Begins Early</span>
            </div>
          </div>

          <address className="footer-address-block">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="footer-pin-icon"
              aria-hidden="true"
            >
              <path
                d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
                fill="#D92D3A"
              />
              <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
            </svg>
            <div className="footer-address-text">
              <span>Plot No. 61, Padmashree Enclave,</span>
              <span>near Sanjana Courtyard, Kandlakoya, Hyderabad – 501401</span>
            </div>
          </address>
        </div>

        {/* Middle Column: Explore our school */}
        <div>
          <h2>Explore our school</h2>
          <nav aria-label="Footer navigation">
            {[
              ["/school-life", "School Life"],
              ["/academics", "Curriculum & learning"],
              ["/campus", "Our campus"],
              ["/admissions", "Admissions"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Column: Start a conversation */}
        <div className="footer-contact-col">
          <h2>Start a conversation</h2>
          <div className="footer-contact-list">
            <a href="tel:+918008533078" className="footer-contact-link">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="footer-contact-icon"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 80085 33078</span>
            </a>
            <a href="tel:+919121059881" className="footer-contact-link">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="footer-contact-icon"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 91210 59881</span>
            </a>
            <a
              href={"mailto:" + SCHOOL.contact.email}
              className="footer-contact-link"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="footer-contact-icon"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{SCHOOL.contact.email}</span>
            </a>
            <a
              href={SCHOOL.contact.mapsUrl}
              target="_blank"
              rel="noopener"
              className="footer-contact-link"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="footer-contact-icon"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Directions to the school ↗</span>
            </a>
            <a
              href={SCHOOL.social.instagram}
              target="_blank"
              rel="noopener"
              className="footer-contact-link"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="footer-contact-icon"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>School updates on Instagram ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="site-container footer-bottom">
        <span>© Rainbow DIGI School</span>
        <Link to="/privacy-policy">Privacy information</Link>
        <a
          href="https://my-work-umber.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-attribution"
        >
          <img
            src="/images/garuda-emblem.png"
            alt="Garuda emblem"
            width={32}
            height={28}
            className="footer-garuda-logo"
            loading="lazy"
            decoding="async"
          />
          <span>Crafted by Garuda ↗</span>
        </a>
      </div>
    </footer>
  );
}
