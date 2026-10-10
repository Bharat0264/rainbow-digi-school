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
      <section className="section site-container photo-story">
        <div>
          <button
            type="button"
            className="photo-open"
            onClick={() => dialog.current.showModal()}
            aria-label="Enlarge photograph of Rainbow Digi School exterior"
          >
            <CampusPhoto caption={false} />
            <span>
              <Expand size={18} aria-hidden="true" /> View full photograph
            </span>
          </button>
          <p className="image-caption">
            Rainbow Digi School exterior · School-approved photograph
          </p>
        </div>
        <div className="editorial-copy">
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
            <li>How is the day organised for new learners?</li>
            <li>What classroom activities can parents learn about?</li>
            <li>How does the school communicate with families?</li>
            <li>
              Which facilities and transport arrangements are available for your
              class?
            </li>
          </ul>
          <p>
            Call ahead to confirm visit arrangements. We do not publish
            unverified facility or transport claims.
          </p>
          <a
            className="text-link"
            href={SCHOOL.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find the campus <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
      <dialog
        ref={dialog}
        className="photo-dialog"
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
          <X aria-hidden="true" />
        </button>
        <img {...SCHOOL.campusPhoto} />
        <p>Rainbow Digi School, Kandlakoya</p>
      </dialog>
      <AdmissionsInvite />
    </>
  );
}
