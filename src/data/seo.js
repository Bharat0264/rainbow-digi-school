import { SCHOOL } from "./school.js";

export const SITE_URL = "https://rainbow-digi-school.vercel.app";
export const SEO_ROUTES = {
  "/": { title: "Best CBSE School in Kandlakoya | Rainbow Digi School", description: "Explore Rainbow Digi School, a CBSE curriculum school in Kandlakoya, Hyderabad for Nursery to Grade V. Enquire about admissions today.", label: "Home" },
  "/academics": { title: "CBSE Curriculum, Nursery to Grade V | Rainbow Digi School", description: "Explore Nursery to Grade V learning, play and learn, Maths Lab and digital learning at Rainbow Digi School in Kandlakoya. Enquire today.", label: "Academics" },
  "/campus-life": { title: "Campus & School Life in Kandlakoya | Rainbow Digi School", description: "Explore the campus, school life and family visit information at Rainbow Digi School in Kandlakoya, Hyderabad. Plan your enquiry today.", label: "Campus & Life" },
  "/contact": { title: "Contact Rainbow Digi School, Kandlakoya | Enquire Today", description: "Contact Rainbow Digi School in Kandlakoya, Hyderabad for Nursery to Grade V admissions, directions and school timings. Get in touch today.", label: "Contact" },
  "/admissions": { title: "Admissions Enquiry, Nursery to Grade V | Rainbow Digi School", description: "Enquire about Nursery to Grade V admissions at Rainbow Digi School in Kandlakoya, Hyderabad. Ask about fees, eligibility and availability.", label: "Admissions" },
  "/privacy-policy": { title: "Privacy Information | Rainbow Digi School", description: "Read the Rainbow Digi School website privacy information.", label: "Privacy", noindex: true },
};

export function pageSeo(pathname) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return { path, ...(SEO_ROUTES[path] || { title: "Page not found | Rainbow Digi School", description: "This page could not be found.", label: "Page not found", noindex: true }) };
}

export function structuredData(pathname) {
  const page = pageSeo(pathname);
  if (page.noindex) return null;
  const schoolId = `${SITE_URL}/#school`;
  const graph = [{
    "@type": "School", "@id": schoolId, name: SCHOOL.name, url: `${SITE_URL}/`, slogan: SCHOOL.tagline,
    logo: `${SITE_URL}/logo.svg`, image: `${SITE_URL}${SCHOOL.campusPhoto.src}`,
    address: { "@type": "PostalAddress", streetAddress: SCHOOL.contact.address, addressLocality: "Hyderabad", addressRegion: "Telangana", postalCode: "501401", addressCountry: "IN" },
    telephone: SCHOOL.contact.phones.map((phone) => phone.href.replace("tel:", "")), email: SCHOOL.contact.email,
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:15", closes: "16:00" }],
    sameAs: [SCHOOL.social.instagram],
  }, {
    "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SCHOOL.name, publisher: { "@id": schoolId },
  }, {
    "@type": "WebPage", "@id": `${SITE_URL}${page.path}#webpage`, url: `${SITE_URL}${page.path}`, name: page.title, description: page.description, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": schoolId }, inLanguage: "en-IN",
  }];
  if (page.path !== "/") graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: page.label, item: `${SITE_URL}${page.path}` }] });
  if (page.path === "/admissions") graph.push({ "@type": "FAQPage", mainEntity: (awaitlessFaqs()).map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}
function awaitlessFaqs() {
  return [
    { q: "Which classes does Rainbow Digi School offer?", a: "Rainbow Digi School offers Nursery, LKG, UKG and Grades I to V." },
    { q: "What curriculum is advertised?", a: "The school advertises a CBSE curriculum." },
    { q: "Where is the school?", a: SCHOOL.contact.address },
  ];
}
export function socialMeta(page) { return { type: "website", title: page.title, description: page.description, url: `${SITE_URL}${page.path}`, site_name: SCHOOL.name, image: `${SITE_URL}/social-card.png`, "image:width": "1200", "image:height": "630", "image:alt": "Rainbow Digi School, Kandlakoya, Hyderabad", locale: "en_IN" }; }
export function twitterMeta(page) { return { card: "summary_large_image", title: page.title, description: page.description, image: `${SITE_URL}/social-card.png`, "image:alt": "Rainbow Digi School, Kandlakoya, Hyderabad" }; }
