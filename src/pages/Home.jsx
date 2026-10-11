import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  BookOpen,
  Sprout,
  MessageCircle,
} from "lucide-react";
import { ACADEMICS, FEATURES, SCHOOL } from "../data/school";
import {
  AdmissionsInvite,
  ArrowLink,
  CampusPhoto,
  Faqs,
  SectionHeading,
} from "../components/ui/PageElements";

export default function Home() {
  return (
    <>
      {/* Ref 2 Bento Hero Layout */}
      <section
        className="home-hero site-container"
        aria-labelledby="home-title"
      >
        <div className="hero-copy glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Rainbow DIGI School · Kandlakoya
          </p>
          <h1 id="home-title">
            Little beginnings.
            <br />
            <em>Big discoveries.</em>
          </h1>
          <p className="hero-description">
            A new chapter starts with curiosity. Explore Rainbow Digi School in
            Kandlakoya, Hyderabad, for your child’s early and primary years.
          </p>
          <div className="button-row">
            <Link className="button button-primary" to="/admissions#enquiry">
              <span>Enquire about admissions</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <ArrowLink to="/academics">Explore learning</ArrowLink>
          </div>
          <div className="hero-footnote">
            <span className="small-rainbow" aria-hidden="true" />{" "}
            <span>{SCHOOL.tagline}</span>
          </div>
        </div>
        <div className="hero-visual glass-card glass-card--matte">
          <span className="glass-specular" aria-hidden="true" />
          <CampusPhoto priority caption={false} />
          <div className="photo-label">
            <MapPin size={18} aria-hidden="true" />
            <span>
              A real place for new beginnings
              <small>Our school in Kandlakoya</small>
            </span>
          </div>
          <span className="photo-index" aria-hidden="true">
            01 / OUR SCHOOL
          </span>
        </div>
      </section>

      {/* Ref 1 Liquid Glass Facts Bento Strip */}
      <div
        className="school-facts site-container"
        aria-label="School at a glance"
      >
        <div className="glass-fact-item">
          <div className="glass-fact-icon">
            <Sprout aria-hidden="true" />
          </div>
          <div>
            <span>Early years</span>
            <small>Nursery · LKG · UKG</small>
          </div>
        </div>
        <div className="glass-fact-item">
          <div className="glass-fact-icon">
            <BookOpen aria-hidden="true" />
          </div>
          <div>
            <span>Primary years</span>
            <small>Grades I to V</small>
          </div>
        </div>
        <div className="glass-fact-item">
          <div className="glass-fact-icon">
            <MapPin aria-hidden="true" />
          </div>
          <div>
            <span>Our neighbourhood</span>
            <small>Kandlakoya, Hyderabad</small>
          </div>
        </div>
      </div>

      {/* Educational Approach Bento Grid */}
      <section className="section site-container intro-grid">
        <div className="glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <SectionHeading
            eyebrow="A school, and a starting point"
            title="Room for curiosity. Space to grow."
          >
            Choosing a school is about more than the next class. It’s about
            finding the right beginning for your child.
          </SectionHeading>
        </div>
        <div className="editorial-copy glass-card glass-card--matte">
          <span className="glass-specular" aria-hidden="true" />
          <p>
            Rainbow Digi School’s early-years and primary programme brings
            together the themes of foundational learning, communication, and
            exploration.
          </p>
          <p>
            Start with what matters to your family: the daily rhythm, the
            learning approach, and the people your child will learn with. We’ve
            brought the key information and questions together to help.
          </p>
          <ArrowLink to="/school-life">Get to know school life</ArrowLink>
        </div>
      </section>

      {/* Ref 2 Two-Stage Bento Cards: Warm Orange + Deep Green Silk-Wave */}
      <section className="section learning-section">
        <div className="site-container">
          <div className="section-row">
            <SectionHeading
              eyebrow="Two stages. Many possibilities."
              title="A beginning for every learning stage."
            />
            <ArrowLink to="/academics">Curriculum & learning</ArrowLink>
          </div>
          <div className="stage-grid">
            {ACADEMICS.map((stage, i) => (
              <article
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
                <h3>{stage.stage}</h3>
                <p>{stage.description}</p>
                <div className="stage-action">
                  <ArrowLink to={"/academics#" + stage.id}>
                    Explore {stage.stage.toLowerCase()}
                  </ArrowLink>
                </div>
              </article>
            ))}
          </div>
          <p className="section-note">
            CBSE curriculum, as advertised by the school.{" "}
            <Link to="/academics#curriculum">
              Read about curriculum information.
            </Link>
          </p>
        </div>
      </section>

      {/* Questions Worth Exploring Bento Grid */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="Questions worth exploring"
          title="Beyond the textbook."
        >
          Get to know the themes in the school’s programme, then ask how they
          work for your child’s class.
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
              <div className="feature-card-link">
                <ArrowLink to="/academics#enrichment">
                  What to ask the school
                </ArrowLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Community Band */}
      <section className="section site-container community-band-section">
        <div className="community-band glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <div className="intro-grid">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Life beyond lessons
              </p>
              <h2>
                Small moments.
                <br />
                <em>Shared memories.</em>
              </h2>
            </div>
            <div className="editorial-copy">
              <div className="community-icon">
                <MessageCircle size={32} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <p>
                School celebrations, creative activities, and classroom
                participation feature in Rainbow’s community updates. Discover the
                stories shared by the school.
              </p>
              <ArrowLink to="/school-life">Explore school life</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* Ref 1 Liquid Glass FAQ Accordion */}
      <section className="section site-container faq-grid">
        <div className="glass-card">
          <span className="glass-specular" aria-hidden="true" />
          <SectionHeading
            eyebrow="For thoughtful decisions"
            title="Your questions, a clearer starting point."
          />
        </div>
        <div>
          <Faqs />
        </div>
      </section>

      {/* Compact Admissions CTA */}
      <AdmissionsInvite />
    </>
  );
}
