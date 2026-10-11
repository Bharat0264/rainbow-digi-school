import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SCHOOL_LIFE_EXPERIENCE, EVENTS, SCHOOL } from "../data/school";
import {
  PageIntro,
  SectionHeading,
} from "../components/ui/PageElements";

export default function SchoolLife() {
  const { dailyRhythm, celebrations } = SCHOOL_LIFE_EXPERIENCE;

  return (
    <>
      <PageIntro
        eyebrow="Student Life & School Culture"
        title="More Than a School Day."
      >
        <p>
          Beyond textbooks and workbooks, childhood at Rainbow Digi School is
          filled with laughter, shared celebrations, creative expression, and
          meaningful friendships.
        </p>
      </PageIntro>

      {/* Daily Rhythm Bento */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="The daily rhythm"
          title="A balanced, joyful day for every learner."
        >
          Our school day blends focused classroom engagement with open social play,
          rhythmic movement, and creative exploration.
        </SectionHeading>
        <div className="feature-grid">
          {dailyRhythm.map((item, idx) => {
            const colors = ["clay-yellow", "clay-pink", "clay-mint", "clay-cream"];
            const color = colors[idx % colors.length];
            return (
              <article
                key={item.time}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index">0{idx + 1}</span>
                  <h3>{item.time}</h3>
                </div>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Celebrations & Community Traditions Bento */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="Events & community"
          title="Celebrating culture, gratitude, and unity."
        >
          Special days help young children understand diversity, express
          gratitude to community helpers, and celebrate national occasions together.
        </SectionHeading>
        <div className="feature-grid">
          {celebrations.map((item, idx) => {
            const colors = ["clay-mint", "clay-yellow", "clay-pink", "clay-slate"];
            const color = colors[idx % colors.length];
            const isSlate = color === "clay-slate";
            return (
              <article
                key={item.title}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span
                    className="feature-index"
                    style={{ color: isSlate ? "#FFFFFF" : undefined }}
                  >
                    0{idx + 1}
                  </span>
                  <h3 style={{ color: isSlate ? "#FFFFFF" : undefined }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ color: isSlate ? "#E8F0EE" : undefined }}>
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Authentic Social Channel & Announcements Band */}
      <section className="section site-container community-band-section">
        <div className="community-band clay-tile clay-cream clay-shape-blob">
          <div className="intro-grid">
            <SectionHeading
              eyebrow="Community window"
              title="See our school activities in real time."
            >
              We regularly share classroom photographs, festive celebrations, and
              student activities with families on our official social channel.
            </SectionHeading>
            <div className="editorial-copy">
              {EVENTS.length > 0 ? (
                EVENTS.map((event) => (
                  <article
                    key={event.title}
                    className="event-item clay-tile clay-cream"
                    style={{ marginBlock: "14px" }}
                  >
                    <h3>{event.title}</h3>
                    <p className="event-date">{event.date}</p>
                    <p>{event.description}</p>
                  </article>
                ))
              ) : (
                <p>
                  Follow Rainbow Digi School on Instagram for verified photo
                  updates, student art displays, and festive event recaps
                  throughout the academic term.
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                <a
                  className="button button-secondary clay-btn-mint"
                  href={SCHOOL.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Rainbow Digi School on Instagram</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <Link
                  className="button button-primary clay-btn-yellow"
                  to="/academics"
                >
                  <span>How activities support learning</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
