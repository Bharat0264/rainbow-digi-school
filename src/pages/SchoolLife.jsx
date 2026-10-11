import { ArrowUpRight } from "lucide-react";
import { EVENTS, SCHOOL } from "../data/school";
import {
  PageIntro,
  AdmissionsInvite,
  SectionHeading,
} from "../components/ui/PageElements";

export default function SchoolLife() {
  return (
    <>
      <PageIntro
        eyebrow="Student life & school updates"
        title="More than a school day."
      >
        <p>
          Celebrations, creativity, and shared experiences form part of the
          story Rainbow Digi School shares with its community.
        </p>
      </PageIntro>

      {/* Activity Themes Bento Grid (Ref 2 Alternating Shapes & Pastels) */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="From the school’s community updates"
          title="Many ways to take part."
        >
          The school’s shared material features these activity themes. For
          current activities and participation details, speak with the school.
        </SectionHeading>
        <div className="feature-grid" style={{ marginTop: "36px" }}>
          {[
            [
              "01",
              "Celebrating together",
              "National and cultural celebrations, including Independence Day and festival greetings, feature in school updates.",
              "clay-yellow",
            ],
            [
              "02",
              "Expressing ideas",
              "Classroom participation, creative work, and themed activities offer a window into the school’s community.",
              "clay-pink",
            ],
            [
              "03",
              "Making connections",
              "Friends Day, Guru Purnima, and Doctor’s Day are among the themes previously shared by the school.",
              "clay-mint",
            ],
          ].map(([n, title, copy, color]) => (
            <article key={n} className={`feature-card clay-tile ${color} clay-interactive`}>
              <div className="feature-card-header">
                <span className="feature-index">0{n}</span>
                <h3>{title}</h3>
              </div>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Announcements Bento Section */}
      <section className="section site-container community-band-section">
        <div className="community-band clay-tile clay-cream clay-shape-blob">
          <div className="intro-grid">
            <SectionHeading
              eyebrow="Announcements"
              title="Stay connected to what’s current."
            />
            <div className="editorial-copy">
              {EVENTS.length ? (
                EVENTS.map((event) => (
                  <article key={event.title} className="event-item clay-tile clay-cream" style={{ marginBlock: "14px" }}>
                    <h3>{event.title}</h3>
                    <p className="event-date">{event.date}</p>
                    <p>{event.description}</p>
                  </article>
                ))
              ) : (
                <p>
                  There are no dated announcements published here at the moment.
                  Check the school’s own updates or contact the team for current
                  events and activity schedules.
                </p>
              )}
              <div style={{ marginTop: "24px" }}>
                <a
                  className="button button-secondary clay-btn-mint"
                  href={SCHOOL.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View the school’s Instagram</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsInvite />
    </>
  );
}
