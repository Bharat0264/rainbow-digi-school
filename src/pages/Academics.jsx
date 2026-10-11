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

      {/* Curriculum Bento Grid */}
      <section id="curriculum" className="section site-container intro-grid">
        <div className="glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <SectionHeading
            eyebrow="The curriculum"
            title="Start with a clear understanding."
          />
        </div>
        <div className="editorial-copy glass-card glass-card--matte">
          <span className="glass-specular" aria-hidden="true" />
          <p>
            Rainbow Digi School advertises a CBSE curriculum for its
            Nursery-to-Grade-V offering. For the programme followed in each
            class, textbooks, assessment, and formal affiliation details, ask
            the school directly.
          </p>
          <div className="information-note glass-card glass-card--subtle">
            <p>{SCHOOL.curriculumNote}</p>
          </div>
          <ArrowLink to="/admissions#enquiry">
            Ask a curriculum question
          </ArrowLink>
        </div>
      </section>

      {/* Ref 2 Two-Stage Bento Cards */}
      <section className="section site-container stage-grid academic-stages">
        {ACADEMICS.map((stage, i) => (
          <article
            id={stage.id}
            className={`stage-panel stage-${stage.id} glass-card ${
              stage.id === "nursery"
                ? "glass-card--orange"
                : "glass-card--green"
            } glass-card--interactive`}
            key={stage.id}
          >
            <span className="glass-specular" aria-hidden="true" />
            {stage.id !== "nursery" && (
              <span className="glass-silk-wave" aria-hidden="true" />
            )}
            <span className="stage-number">0{i + 1}</span>
            <p className="eyebrow">{stage.grades}</p>
            <h2>{stage.stage}</h2>
            <p>{stage.description}</p>
            <h3 className="small-heading">Topics to explore with the school</h3>
            <ul className="check-list">
              {stage.highlights.map((item) => (
                <li key={item}>
                  <span className="check-bullet" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="stage-action">
              <ArrowLink to="/admissions#enquiry">
                Enquire about this stage
              </ArrowLink>
            </div>
          </article>
        ))}
      </section>

      {/* Enrichment Bento Grid */}
      <section id="enrichment" className="section site-container">
        <SectionHeading
          eyebrow="Beyond core learning"
          title="Learn more about the programme."
        >
          These themes feature in the school’s promotional information. Ask
          about availability, activities, and suitability for your child’s age.
        </SectionHeading>
        <div className="feature-grid">
          {FEATURES.map((feature, i) => (
            <article
              key={feature.title}
              className="feature-card glass-card glass-card--interactive"
            >
              <span className="glass-specular" aria-hidden="true" />
              <div className="feature-card-header">
                <span className="feature-index">0{i + 1}</span>
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.desc}</p>
              <p className="question-prompt">Ask: {feature.question}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Technology with Context Bento Card */}
      <section className="section site-container community-band-section">
        <div className="community-band glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <div className="intro-grid">
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
        </div>
      </section>

      <AdmissionsInvite />
    </>
  );
}
