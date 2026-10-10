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
      <section
        className="home-hero site-container"
        aria-labelledby="home-title"
      >
        <div className="hero-copy">
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
              Enquire about admissions{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <ArrowLink to="/academics">Explore learning</ArrowLink>
          </div>
          <div className="hero-footnote">
            <span className="small-rainbow" aria-hidden="true" />{" "}
            <span>{SCHOOL.tagline}</span>
          </div>
        </div>
        <div className="hero-visual">
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
      <div
        className="school-facts site-container"
        aria-label="School at a glance"
      >
        <div>
          <Sprout aria-hidden="true" />
          <span>
            Early years<small>Nursery · LKG · UKG</small>
          </span>
        </div>
        <div>
          <BookOpen aria-hidden="true" />
          <span>
            Primary years<small>Grades I to V</small>
          </span>
        </div>
        <div>
          <MapPin aria-hidden="true" />
          <span>
            Our neighbourhood<small>Kandlakoya, Hyderabad</small>
          </span>
        </div>
      </div>
      <section className="section site-container intro-grid">
        <SectionHeading
          eyebrow="A school, and a starting point"
          title="Room for curiosity. Space to grow."
        >
          Choosing a school is about more than the next class. It’s about
          finding the right beginning for your child.
        </SectionHeading>
        <div className="editorial-copy">
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
                className={"stage-panel stage-" + stage.id}
                key={stage.id}
              >
                <span className="stage-number">0{i + 1}</span>
                <p className="eyebrow">{stage.grades}</p>
                <h3>{stage.stage}</h3>
                <p>{stage.description}</p>
                <ArrowLink to={"/academics#" + stage.id}>
                  Explore {stage.stage.toLowerCase()}
                </ArrowLink>
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
      <section className="section site-container">
        <SectionHeading
          eyebrow="Questions worth exploring"
          title="Beyond the textbook."
        >
          Get to know the themes in the school’s programme, then ask how they
          work for your child’s class.
        </SectionHeading>
        <div className="feature-list">
          {FEATURES.map((feature, i) => (
            <article key={feature.title}>
              <span className="feature-index">0{i + 1}</span>
              <h3>{feature.title}</h3>
              <div>
                <p>{feature.desc}</p>
                <ArrowLink to="/academics#enrichment">
                  What to ask the school
                </ArrowLink>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="community-band">
        <div className="site-container intro-grid">
          <div>
            <p className="eyebrow">Life beyond lessons</p>
            <h2>
              Small moments.
              <br />
              <em>Shared memories.</em>
            </h2>
          </div>
          <div className="editorial-copy">
            <MessageCircle size={32} strokeWidth={1.4} aria-hidden="true" />
            <p>
              School celebrations, creative activities, and classroom
              participation feature in Rainbow’s community updates. Discover the
              stories shared by the school.
            </p>
            <ArrowLink to="/school-life">Explore school life</ArrowLink>
          </div>
        </div>
      </section>
      <section className="section site-container faq-grid">
        <SectionHeading
          eyebrow="For thoughtful decisions"
          title="Your questions, a clearer starting point."
        />
        <Faqs />
      </section>
      <AdmissionsInvite />
    </>
  );
}
