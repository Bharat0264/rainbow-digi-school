import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, MapPin, Sprout } from "lucide-react";
import { SCHOOL } from "../data/school";
import { AdmissionsInvite, ArrowLink, CampusPhoto, SectionHeading } from "../components/ui/PageElements";

export default function Home() {
  return <>
    <section className="home-hero site-container" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> Rainbow Digi School · Kandlakoya</p>
        <h1 id="home-title">Little beginnings.<br /><em>Big discoveries.</em></h1>
        <p className="hero-description">Rainbow Digi School in Kandlakoya, Hyderabad offers a play-and-learn beginning for Nursery to Grade V.</p>
        <div className="button-row"><Link className="button button-primary" to="/admissions#enquiry">Enquire about admissions <ArrowRight size={18} aria-hidden="true" /></Link><ArrowLink to="/academics">Explore learning</ArrowLink></div>
        <div className="hero-footnote"><span className="small-rainbow" aria-hidden="true" /><span>{SCHOOL.tagline}</span></div>
      </div>
      <div className="hero-visual"><CampusPhoto priority caption={false} /><div className="photo-label"><MapPin size={18} aria-hidden="true" /><span>A real place for new beginnings<small>Our school in Kandlakoya</small></span></div><span className="photo-index" aria-hidden="true">01 / OUR SCHOOL</span></div>
    </section>
    <div className="school-facts site-container" aria-label="School at a glance">
      <div><Sprout aria-hidden="true" /><span>Early years<small>Nursery · LKG · UKG</small></span></div>
      <div><BookOpen aria-hidden="true" /><span>Primary years<small>Grades I to V</small></span></div>
      <div><MapPin aria-hidden="true" /><span>Our neighbourhood<small>Kandlakoya, Hyderabad</small></span></div>
    </div>
    <section className="section site-container intro-grid"><SectionHeading eyebrow="A school, and a starting point" title="Room for curiosity. Space to grow.">A thoughtful beginning for children and families.</SectionHeading><div className="editorial-copy"><p>Our advertised CBSE curriculum brings together foundational learning, communication and exploration.</p><p>Discover the programme, daily learning approach and the people your child will learn with.</p><ArrowLink to="/academics">Explore academics</ArrowLink></div></section>
    <section className="section learning-section"><div className="site-container"><div className="section-row"><SectionHeading eyebrow="Learning at Rainbow" title="A beginning for every learning stage." /><ArrowLink to="/academics">See academics</ArrowLink></div><div className="stage-grid"><article className="stage-panel stage-nursery"><span className="stage-number">01</span><p className="eyebrow">Nursery · LKG · UKG</p><h3>Early years</h3><p>Play, participation, language and early number sense for first school days.</p><ArrowLink to="/academics#nursery">Explore early years</ArrowLink></article><article className="stage-panel stage-primary"><span className="stage-number">02</span><p className="eyebrow">Grades I to V</p><h3>Primary years</h3><p>Foundational learning with communication, mathematics and exploration.</p><ArrowLink to="/academics#primary">Explore primary years</ArrowLink></article></div></div></section>
    <section className="section site-container"><SectionHeading eyebrow="Learning spaces" title="Four ways to explore."><p>Ask the school how these spaces support your child’s stage of learning.</p></SectionHeading><div className="feature-list">{["Smart classrooms", "Maths Lab", "Computer Lab", "Olympiad foundation"].map((title, i) => <article key={title}><span className="feature-index">0{i + 1}</span><h3>{title}</h3><div><p>Part of the learning experience families can discuss with the school.</p><ArrowLink to="/academics#enrichment">Learn more</ArrowLink></div></article>)}</div></section>
    <AdmissionsInvite />
  </>;
}
