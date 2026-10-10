import { VALUES, SCHOOL } from "../data/school";
import {
  PageIntro,
  CampusPhoto,
  AdmissionsInvite,
  SectionHeading,
  ArrowLink,
} from "../components/ui/PageElements";
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="Our school · Our beginnings"
        title="Excellence begins early."
      >
        <p>
          Get to know Rainbow Digi School, serving the early and primary years
          in Kandlakoya, Hyderabad.
        </p>
      </PageIntro>
      <section className="section site-container photo-story">
        <CampusPhoto />
        <div className="editorial-copy">
          <SectionHeading
            eyebrow="A place in your child’s story"
            title="The first chapters matter."
          />
          <p>
            From Nursery to Grade V, these are years of first questions, new
            friendships, and growing independence. Choosing a school means
            thinking about the everyday experience as well as the curriculum.
          </p>
          <p>
            Our school’s published programme highlights communication,
            activity-based learning, mathematics, and digital learning. Explore
            these themes, and ask the school what a day looks like for your
            child’s class.
          </p>
          <ArrowLink to="/academics">
            Understand the learning approach
          </ArrowLink>
        </div>
      </section>
      <section className="section soft-section">
        <div className="site-container">
          <SectionHeading
            eyebrow="What shapes the conversation"
            title="A thoughtful foundation."
          />
          <div className="values-grid">
            {VALUES.map((value, i) => (
              <article key={value.title}>
                <span className="feature-index">0{i + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section site-container intro-grid">
        <SectionHeading
          eyebrow="Get to know us"
          title="Ask the questions that matter to you."
        />
        <div className="editorial-copy">
          <p>
            Meet the school through a conversation about your child’s
            prospective class. Ask about teacher communication, settling in,
            classroom routines, and the support available to new learners.
          </p>
          <p>
            For the latest school news, visit{" "}
            <a
              href={SCHOOL.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Rainbow Digi School on Instagram
            </a>
            .
          </p>
          <ArrowLink to="/contact">Start a conversation</ArrowLink>
        </div>
      </section>
      <AdmissionsInvite />
    </>
  );
}
