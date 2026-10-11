import { Link } from "react-router-dom";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { HOME_STAGES, HOME_PILLARS, HOME_FAQS, SCHOOL } from "../data/school";
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
            A welcoming preschool and primary school in Kandlakoya, Hyderabad.
            We nurture young children from Nursery through Grade V with warmth,
            curiosity, and strong foundational learning.
          </p>
          <div className="button-row">
            <Link
              className="button button-primary clay-btn-yellow"
              to="/admissions#enquiry"
            >
              <span>Enquire about admissions</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <ArrowLink to="/academics">Explore our curriculum</ArrowLink>
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

      {/* Highlights Strip: Raised Alternating Pastel Pills */}
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
            Choosing a school is about finding the right first environment. At
            Rainbow Digi School, we believe that education should spark joy,
            encourage questions, and build natural confidence.
          </SectionHeading>
        </div>
        <div className="editorial-copy clay-tile clay-yellow">
          <p>
            Located inside Padmashree Enclave in Kandlakoya, our campus provides a
            peaceful, community-centered environment where young learners can focus
            on building strong foundations.
          </p>
          <p>
            From your child’s very first school day through the primary years, we
            work alongside families to support emotional comfort, social
            readiness, and cognitive development.
          </p>
          <ArrowLink to="/campus">Discover our campus setting</ArrowLink>
        </div>
      </section>

      {/* Two-Stage Educational Journey Cards */}
      <section className="section learning-section">
        <div className="site-container">
          <div className="section-row">
            <SectionHeading
              eyebrow="Educational programmes"
              title="A clear path from early play to primary learning."
            />
            <ArrowLink to="/academics">Detailed curriculum</ArrowLink>
          </div>
          <div className="stage-grid">
            {HOME_STAGES.map((stage) => {
              const isSlate = stage.id === "primary-years";
              return (
                <article
                  className={`stage-panel stage-${stage.id} clay-tile ${
                    isSlate ? "clay-slate" : "clay-pink"
                  } clay-shape-capsule clay-interactive`}
                  key={stage.id}
                >
                  <div className="stage-top-bar">
                    <span className="stage-number">{stage.number}</span>
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
                    <ArrowLink to={stage.link}>
                      {stage.linkText}
                    </ArrowLink>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="section-note">
            Advertised CBSE-aligned curriculum.{" "}
            <Link to="/academics#curriculum">
              Read our full curriculum overview.
            </Link>
          </p>
        </div>
      </section>

      {/* The School Experience Pillars (Distinct from Academics) */}
      <section className="section site-container">
        <SectionHeading
          eyebrow="The Rainbow approach"
          title="What families value most about our school."
        >
          Key principles that guide our daily interactions, classroom
          atmosphere, and partnership with parents.
        </SectionHeading>
        <div className="feature-grid">
          {HOME_PILLARS.map((pillar, i) => {
            const colors = ["clay-mint", "clay-pink", "clay-yellow"];
            const color = colors[i % colors.length];
            return (
              <article
                key={pillar.title}
                className={`feature-card clay-tile ${color} clay-interactive`}
              >
                <div className="feature-card-header">
                  <span className="feature-index">0{i + 1}</span>
                  <h3>{pillar.title}</h3>
                </div>
                <p>{pillar.desc}</p>
                <div className="feature-card-link">
                  <ArrowLink to="/school-life">
                    See school life in action
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
              <div
                className="community-icon clay-tile clay-yellow clay-shape-pill"
                style={{ display: "inline-flex", padding: "12px", marginBottom: "16px" }}
              >
                <MessageCircle
                  size={28}
                  strokeWidth={1.5}
                  color="#342407"
                  aria-hidden="true"
                />
              </div>
              <p>
                From morning assemblies and festive celebrations to sports days
                and student art displays, discover how our children learn,
                collaborate, and celebrate together every week.
              </p>
              <ArrowLink to="/school-life">Explore school life & activities</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* Home-Specific FAQ Bento Grid */}
      <section className="section site-container faq-grid">
        <div className="clay-tile clay-cream faq-header-card">
          <SectionHeading
            eyebrow="School overview"
            title="Common questions from prospective parents."
          >
            Essential answers about our school location, curriculum, and classes.
          </SectionHeading>
        </div>
        <div>
          <Faqs items={HOME_FAQS} />
        </div>
      </section>

      {/* Admissions Invite CTA */}
      <AdmissionsInvite />
    </>
  );
}
