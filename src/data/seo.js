import { SCHOOL } from "./school.js";

export const SITE_URL = "https://rainbow-digi-school.vercel.app";

export const SEO_ROUTES = {
  "/": {
    title: "Rainbow Digi School | Preschool & Primary in Kandlakoya",
    description:
      "Discover Rainbow Digi School in Kandlakoya, Hyderabad. Welcoming Nursery to Grade V students with a balanced approach to early play, foundational literacy, and conceptual learning.",
    label: "Home",
  },
  "/academics": {
    title: "Curriculum & Learning | Rainbow Digi School Kandlakoya",
    description:
      "Explore the Nursery to Grade V curriculum at Rainbow Digi School. Learn how we teach phonics, early numeracy, language expression, and primary mathematics in Kandlakoya.",
    label: "Academics",
  },
  "/admissions": {
    title: "Admissions 2026–2027 | Rainbow Digi School Kandlakoya",
    description:
      "Enrol your child at Rainbow Digi School in Kandlakoya. Review our 5-step admissions process, age criteria, document checklist, and submit your admission enquiry today.",
    label: "Admissions",
  },
  "/campus": {
    title: "Our Campus & Visit Guide | Rainbow Digi School Kandlakoya",
    description:
      "Explore the campus of Rainbow Digi School in Padmashree Enclave, Kandlakoya. Find location directions, classroom features, and guidelines for scheduling a parent visit.",
    label: "Campus",
  },
  "/school-life": {
    title: "School Life & Activities | Rainbow Digi School Kandlakoya",
    description:
      "Experience student life at Rainbow Digi School. Explore daily routines, national celebrations, festive events, creative arts, and community moments in Kandlakoya.",
    label: "School Life",
  },
  "/contact": {
    title: "Contact Admissions & School Desk | Rainbow Digi School",
    description:
      "Connect with Rainbow Digi School in Kandlakoya, Hyderabad. Access verified phone numbers, email, physical address, and directions for admissions and enquiries.",
    label: "Contact",
  },
  "/privacy-policy": {
    title: "Privacy Policy & Enquiry Notice | Rainbow Digi School",
    description:
      "Learn how Rainbow Digi School protects parent and enquiry information, our data handling standards, hosting infrastructure, and privacy commitments.",
    label: "Privacy",
  },
};

export function pageSeo(pathname) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return {
    path,
    ...(SEO_ROUTES[path] || {
      title: "Page Not Found | Rainbow Digi School",
      description:
        "The requested page could not be found. Return to Rainbow Digi School home or explore our academic programmes and admissions in Kandlakoya.",
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
      name: SCHOOL.name,
      url: `${SITE_URL}/`,
      slogan: SCHOOL.tagline,
      description:
        "Nursery to Grade V preschool and primary school in Kandlakoya, Hyderabad offering early childhood and primary education.",
      image: `${SITE_URL}${SCHOOL.campusPhoto.src}`,
      logo: `${SITE_URL}/images/rainbow-logo-embroidered.webp`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.contact.address,
        addressLocality: "Kandlakoya, Hyderabad",
        addressRegion: "Telangana",
        postalCode: "501401",
        addressCountry: "IN",
      },
      sameAs: [SCHOOL.social.instagram],
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

  if (SCHOOL.contact?.verified) {
    graph[0].telephone = SCHOOL.contact.phones.map((phone) =>
      phone.href.replace("tel:", ""),
    );
    graph[0].email = SCHOOL.contact.email;
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
