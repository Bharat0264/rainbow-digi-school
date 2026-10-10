import { Link } from "react-router-dom";
import { PageIntro } from "../components/ui/PageElements";
export default function NotFound() {
  return (
    <PageIntro eyebrow="404 · Page not found" title="Let’s find your way back.">
      <p>
        This page may have moved or the address may be incorrect. Explore our
        school or start an admissions enquiry.
      </p>
      <div className="button-row">
        <Link className="button button-primary" to="/">
          Back to home
        </Link>
        <Link className="text-link" to="/admissions">
          Admissions enquiries
        </Link>
      </div>
    </PageIntro>
  );
}
