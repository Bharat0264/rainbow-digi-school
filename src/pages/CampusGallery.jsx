import { useRef } from "react";
import { X, Expand, ArrowUpRight } from "lucide-react";
import { SCHOOL } from "../data/school";
import {
  PageIntro,
  AdmissionsInvite,
  SectionHeading,
  CampusPhoto,
} from "../components/ui/PageElements";

export default function CampusGallery() {
  const dialog = useRef(null);
  return (
    <>
      <PageIntro
        eyebrow="Our campus · Kandlakoya"
        title="Come with curiosity. Leave with clarity."
      >
        <p>
          A look at our school’s exterior, and a guide to the questions you can
          explore when speaking with the school about a visit.
        </p>
      </PageIntro>

      {/* Campus Bento Photo Story */}
      <section className="section site-container photo-story">
        <div className="photo-story-image-card glass-card glass-card--matte">
          <span className="glass-specular" aria-hidden="true" />
          <button
            type="button"
            className="photo-open"
            onClick={() => dialog.current.showModal()}
            aria-label="Enlarge photograph of Rainbow Digi School exterior"
          >
            <CampusPhoto caption={false} />
            <span className="photo-pill-badge">
              <Expand size={18} aria-hidden="true" />
              <span>View full photograph</span>
            </span>
          </button>
          <p className="image-caption">
            Rainbow Digi School exterior · School-approved photograph
          </p>
        </div>

        <div className="editorial-copy glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <SectionHeading
            eyebrow="Make the visit useful"
            title="Look closer at everyday school life."
          />
          <p>
            When you enquire about a visit, tell the school which class
            interests you. Ask to understand the spaces, routines, and learning
            materials relevant to that age group.
          </p>
          <ul className="check-list">
            <li>
              <span className="check-bullet" aria-hidden="true">✓</span>
              <span>How is the day organised for new learners?</span>
            </li>
            <li>
              <span className="check-bullet" aria-hidden="true">✓</span>
              <span>What classroom activities can parents learn about?</span>
            </li>
            <li>
              <span className="check-bullet" aria-hidden="true">✓</span>
              <span>How does the school communicate with families?</span>
            </li>
            <li>
              <span className="check-bullet" aria-hidden="true">✓</span>
              <span>Which facilities and transport arrangements are available for your class?</span>
            </li>
          </ul>
          <div className="information-note glass-card glass-card--subtle" style={{ marginBlock: "24px" }}>
            <p>
              Call ahead to confirm visit arrangements. We do not publish
              unverified facility or transport claims.
            </p>
          </div>
          <a
            className="button button-secondary"
            href={SCHOOL.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Find the campus</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Frosted Glass Photo Lightbox */}
      <dialog
        ref={dialog}
        className="photo-dialog glass-card"
        aria-label="Rainbow Digi School exterior photograph"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
      >
        <button
          type="button"
          className="dialog-close"
          onClick={() => dialog.current.close()}
          aria-label="Close photograph"
          autoFocus
        >
          <X aria-hidden="true" size={20} />
        </button>
        <img {...SCHOOL.campusPhoto} />
        <p>Rainbow Digi School, Kandlakoya</p>
      </dialog>

      <AdmissionsInvite />
    </>
  );
}
