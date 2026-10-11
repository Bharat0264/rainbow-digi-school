import { Link } from "react-router-dom";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { ACADEMICS, FEATURES, SCHOOL } from "../data/school";
import {
  AdmissionsInvite,
  ArrowLink,
  CampusPhoto,
  Faqs,
  SectionHeading,
} from "../components/ui/PageElements";
import { LineBook, LineSprout, LineSchool } from "../components/ui/ClayIcons";

export default function Home() {
  return (
    <>
      {/* Hero Bento Layout */}
      <section
        className="home-hero site-container"
        aria-labelledby="home-title"
      >
        <div className="hero-copy clay-tile clay-cream clay-shape-blob">
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
            <Link className="button button-primary clay-btn-yellow" to="/admissions#enquiry">
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
        <div className="hero-visual clay-tile clay-mint">
          <CampusPhoto priority caption={false} />
          <div className="photo-label clay-tile clay-cream clay-shape-pill">
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

      {/* Highlights Strip: Raised Alternating Pastel Pills (Ref 2) */}
      <div
        className="school-facts site-container"
        aria-label="School at a glance"
      >
        <div className="clay-tile clay-yellow clay-shape-pill clay-fact-item">
          <div className="clay-fact-icon">
            <LineSprout size={24} color="#342407" />
          </div>
          <div>
            <span>Early years</span>
            <small>Nursery · LKG · UKG</small>
          </div>
        </div>
        <div className="clay-tile clay-pink clay-shape-pill clay-fact-item">
          <div className="clay-fact-icon">
            <LineBook size={24} color="#361f17" />
          </div>
          <div>
            <span>Primary years</span>
            <small>Grades I to V</small>
          </div>
        </div>
        <div className="clay-tile clay-mint clay-shape-pill clay-fact-item">
          <div className="clay-fact-icon">
            <LineSchool size={24} color="#17322a" />
          </div>
          <div>
            <span>Our neighbourhood</span>
            <small>Kandlakoya, Hyderabad</small>
          </div>
        </div>
      </div>

      {/* Intro Bento Grid */}
      <section className="section site-container intro-grid">
        <div className="clay-tile clay-cream">
          <SectionHeading
            eyebrow="A school, and a starting point"
            title="Room for curiosity. Space to grow."
          >
            Choosing a school is about more than the next class. It’s about
            finding the right beginning for your child.
          </SectionHeading>
        </div>
        <div className="editorial-copy clay-tile clay-yellow">
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

      {/* Two-Stage Cards: Ref 2 Butter Yellow + Ref 1 Slate Green Embossed Card */}
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
            {ACADEMICS.map((stage, i) => {
              const isSlate = stage.id === "primary";
              return (
                <article
                  className={`stage-panel stage-${stage.id} clay-tile ${
                    isSlate ? "clay-slate" : "clay-pink"
                  } clay-shape-capsule clay-interactive`}
                  key={stage.id}
                >
                  <div className="stage-top-bar">
                    <span className="stage-number">0{i + 1}</span>
                    {isSlate ? (
                      <LineBook size={28} color="#FFFFFF" strokeWidth={1.5} />
                    ) : (
                      <LineSprout size={28} color="#361f17" strokeWidth={1.5} />
                    )}
                  </div>
                  <p className="eyebrow">{stage.grades}</p>
                  <h3>{stage.stage}</h3>
                  <p>{stage.description}</p>
                  <div className="stage-action">
                    <ArrowLink to={"/academics#" + stage.id}>
                      Explore {stage.stage.toLowerCase()}
                    </ArrowLink>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="section-note">
            CBSE curriculum, as advertised by the school.{" "}
            <Link to="/academics#curriculum">
              Read about curriculum information.
            </Link>
          </p>
        </div>
      </section>

      {/* Questions Worth Exploring Bento Grid (Alternating Pastel Tiles) */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="Questions worth exploring"
          title="Beyond the textbook."
        >
          Get to know the themes in the school’s programme, then ask how they
          work for your child’s class.
        </SectionHeading>
        <div className="feature-grid">
          {FEATURES.map((feature, i) => {
            const colors = ["clay-mint", "clay-pink", "clay-yellow"];
            const color = colors[i % colors.length];
            return (
              <article
                key={feature.title}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
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
            );
          })}
        </div>
      </section>

      {/* Community Band */}
      <section className="section site-container community-band-section">
        <div className="community-band clay-tile clay-cream clay-shape-blob">
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
              <div className="community-icon clay-tile clay-yellow clay-shape-pill" style={{ display: "inline-flex", padding: "12px", marginBottom: "16px" }}>
                <MessageCircle size={28} strokeWidth={1.5} color="#342407" aria-hidden="true" />
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

      {/* FAQ Bento Grid */}
      <section className="section site-container faq-grid">
        <div className="clay-tile clay-cream">
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
