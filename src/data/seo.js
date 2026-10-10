import { SCHOOL } from "./school.js";

export const SITE_URL = "https://rainbow-digi-school.vercel.app";
export const SEO_ROUTES = {
  "/": {
    title: "Rainbow Digi School, Kandlakoya | Nursery to Grade V",
    description:
      "Explore Rainbow Digi School in Kandlakoya, Hyderabad, for early-years and primary education. Discover learning programmes, campus information, and admission enquiries.",
    label: "Home",
  },
  "/academics": {
    title: "Nursery & Primary Learning | Rainbow Digi School",
    description:
      "Explore Nursery, LKG, UKG and Grades I-V at Rainbow Digi School, Kandlakoya. Learn about our advertised curriculum and questions to discuss with the school.",
    label: "Academics",
  },
  "/admissions": {
    title: "Admissions Enquiries | Rainbow Digi School, Kandlakoya",
    description:
      "Explore the admissions enquiry journey for Nursery to Grade V at Rainbow Digi School in Kandlakoya. Ask about availability, fees and a school visit.",
    label: "Admissions",
  },
  "/campus": {
    title: "Explore the Campus | Rainbow Digi School",
    description:
      "Plan what to look for during a Rainbow Digi School campus visit in Kandlakoya. Explore learning spaces and ask the school about current facilities.",
    label: "Campus",
  },
  "/school-life": {
    title: "School Life & Activities | Rainbow Digi School",
    description:
      "Explore the activity and celebration themes shared by Rainbow Digi School, Kandlakoya, and discover questions to ask about school life.",
    label: "School Life",
  },
  "/contact": {
    title: "Contact & Enquiries | Rainbow Digi School, Kandlakoya",
    description:
      "Find Rainbow Digi School in Kandlakoya, Hyderabad. Explore contact information and prepare your questions about Nursery to Grade V admissions.",
    label: "Contact",
  },
  "/privacy-policy": {
    title: "Website Privacy Information | Rainbow Digi School",
    description:
      "Read how this Rainbow Digi School website handles enquiries, browser requests and privacy, including information still awaiting school confirmation.",
    label: "Privacy",
  },
};
export function pageSeo(pathname) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return {
    path,
    ...(SEO_ROUTES[path] || {
      title: "Page not found | Rainbow Digi School",
      description:
        "This page could not be found. Return to Rainbow Digi School or explore admissions and learning.",
      label: "Page not found",
      noindex: true,
    }),
  };
}
export function structuredData(pathname) {
  const page = pageSeo(pathname);
  if (page.noindex) return null;
  const schoolId = `${SITE_URL}/#school`;
  const graph = [
    {
      "@type": "School",
      "@id": schoolId,
      name: "Rainbow Digi School",
      url: `${SITE_URL}/`,
      slogan: "Excellence Begins Early",
      description: "Nursery to Grade V school in Kandlakoya, Hyderabad.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kandlakoya, Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Rainbow Digi School",
      publisher: { "@id": schoolId },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}${page.path}#webpage`,
      url: `${SITE_URL}${page.path}`,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": schoolId },
      inLanguage: "en-IN",
    },
  ];
  graph[0].name = SCHOOL.name;
  graph[0].slogan = SCHOOL.tagline;
  if (SCHOOL.contact?.verified) {
    graph[0].telephone = SCHOOL.contact.phones.map((phone) =>
      phone.href.replace("tel:", ""),
    );
    graph[0].email = SCHOOL.contact.email;
    graph[0].address.streetAddress = SCHOOL.contact.address;
    graph[0].address.postalCode = "501401";
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
export function socialMeta(page) {
  return {
    type: "website",
    title: page.title,
    description: page.description,
    url: `${SITE_URL}${page.path}`,
    site_name: "Rainbow Digi School",
    image: `${SITE_URL}/social-card.png`,
    "image:width": "1200",
    "image:height": "630",
    "image:alt":
      "Rainbow Digi School — Excellence Begins Early. Nursery to Grade V, Kandlakoya, Hyderabad.",
    locale: "en_IN",
  };
}
export function twitterMeta(page) {
  return {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
    image: `${SITE_URL}/social-card.png`,
    "image:alt": "Rainbow Digi School, Kandlakoya, Hyderabad",
  };
}
