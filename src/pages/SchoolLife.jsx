import { ArrowUpRight } from "lucide-react";
import { EVENTS, SCHOOL } from "../data/school";
import {
  PageIntro,
  AdmissionsInvite,
  SectionHeading,
} from "../components/ui/PageElements";
export default function EventsNews() {
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
      <section className="section site-container">
        <SectionHeading
          eyebrow="From the school’s community updates"
          title="Many ways to take part."
        >
          The school’s shared material features these activity themes. For
          current activities and participation details, speak with the school.
        </SectionHeading>
        <div className="values-grid">
          {[
            [
              "01",
              "Celebrating together",
              "National and cultural celebrations, including Independence Day and festival greetings, feature in school updates.",
            ],
            [
              "02",
              "Expressing ideas",
              "Classroom participation, creative work, and themed activities offer a window into the school’s community.",
            ],
            [
              "03",
              "Making connections",
              "Friends Day, Guru Purnima, and Doctor’s Day are among the themes previously shared by the school.",
            ],
          ].map(([n, title, copy]) => (
            <article key={n}>
              <span className="feature-index">{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="community-band">
        <div className="site-container intro-grid">
          <SectionHeading
            eyebrow="Announcements"
            title="Stay connected to what’s current."
          />
          <div className="editorial-copy">
            {EVENTS.length ? (
              EVENTS.map((event) => (
                <article key={event.title}>
                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
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
            <a
              className="text-link"
              href={SCHOOL.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              View the school’s Instagram{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <AdmissionsInvite />
    </>
  );
}
