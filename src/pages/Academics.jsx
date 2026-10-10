import { ACADEMICS, FEATURES, SCHOOL } from "../data/school";
import {
  PageIntro,
  AdmissionsInvite,
  SectionHeading,
  ArrowLink,
} from "../components/ui/PageElements";
export default function Academics() {
  return (
    <>
      <PageIntro
        eyebrow="Curriculum & learning"
        title="Foundations for a curious mind."
      >
        <p>
          Explore the early-years and primary programme, from Nursery to Grade
          V, and the questions to bring to your admissions conversation.
        </p>
      </PageIntro>
      <section id="curriculum" className="section site-container intro-grid">
        <SectionHeading
          eyebrow="The curriculum"
          title="Start with a clear understanding."
        />
        <div className="editorial-copy">
          <p>
            Rainbow Digi School advertises a CBSE curriculum for its
            Nursery-to-Grade-V offering. For the programme followed in each
            class, textbooks, assessment, and formal affiliation details, ask
            the school directly.
          </p>
          <p className="information-note">{SCHOOL.curriculumNote}</p>
          <ArrowLink to="/admissions#enquiry">
            Ask a curriculum question
          </ArrowLink>
        </div>
      </section>
      <section className="site-container stage-grid academic-stages">
        {ACADEMICS.map((stage, i) => (
          <article
            id={stage.id}
            className={"stage-panel stage-" + stage.id}
            key={stage.id}
          >
            <span className="stage-number">0{i + 1}</span>
            <p className="eyebrow">{stage.grades}</p>
            <h2>{stage.stage}</h2>
            <p>{stage.description}</p>
            <h3 className="small-heading">Topics to explore with the school</h3>
            <ul className="check-list">
              {stage.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ArrowLink to="/admissions#enquiry">
              Enquire about this stage
            </ArrowLink>
          </article>
        ))}
      </section>
      <section id="enrichment" className="section site-container">
        <SectionHeading
          eyebrow="Beyond core learning"
          title="Learn more about the programme."
        >
          These themes feature in the school’s promotional information. Ask
          about availability, activities, and suitability for your child’s age.
        </SectionHeading>
        <div className="feature-list">
          {FEATURES.map((feature, i) => (
            <article key={feature.title}>
              <span className="feature-index">0{i + 1}</span>
              <h3>{feature.title}</h3>
              <div>
                <p>{feature.desc}</p>
                <p className="question-prompt">Ask: {feature.question}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="community-band">
        <div className="site-container intro-grid">
          <SectionHeading
            eyebrow="Technology with context"
            title="The right questions about digital learning."
          />
          <div className="editorial-copy">
            <p>
              Digital tools are only one part of a child’s education. Before
              choosing a programme, ask about screen time, teacher involvement,
              age-appropriate content, and how children’s information is
              protected.
            </p>
            <p>
              The school can explain how its advertised AI-powered learning is
              used in practice. We do not publish unconfirmed claims about
              devices, tools, or independent access for children.
            </p>
          </div>
        </div>
      </section>
      <AdmissionsInvite />
    </>
  );
}
