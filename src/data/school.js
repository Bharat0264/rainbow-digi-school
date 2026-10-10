// One source of truth. Contact details and campus image confirmed by the school owner.
export const SCHOOL = {
  name: "Rainbow DIGI School",
  tagline: "Excellence Begins Early",
  location: "Kandlakoya, Hyderabad",
  classes: "Nursery to Grade V",
  curriculum: "CBSE curriculum",
  curriculumNote:
    "The school advertises a CBSE curriculum. This is not a statement of formal CBSE affiliation.",
  contact: {
    verified: true,
    phones: [
      { label: "+91 80085 33078", href: "tel:+918008533078" },
      { label: "+91 91210 59881", href: "tel:+919121059881" },
    ],
    email: "rainbowdigischool01@gmail.com",
    address:
      "Plot No. 61, Padmashree Enclave, near Sanjana Courtyard, Kandlakoya, Hyderabad – 501401",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rainbow+Digi+School+Plot+No+61+Padmashree+Enclave+near+Sanjana+Courtyard+Kandlakoya+Hyderabad+501401",
  },
  admissions: {
    academicYear: "2026–2027",
    status: "enquiries",
    availabilityConfirmed: false,
  },
  social: { instagram: "https://www.instagram.com/rainbowdigischool/" },
  campusPhoto: {
    src: "/images/about-building-real.jpg",
    width: 765,
    height: 1020,
    alt: "Rainbow Digi School exterior with its school sign and colourful entrance in Kandlakoya",
  },
};
export const ACADEMICS = [
  {
    id: "nursery",
    stage: "Early years",
    grades: "Nursery · LKG · UKG",
    description:
      "A first step into school life. Explore the early-years programme and talk with the school about your child’s readiness, the daily routine, and settling in.",
    highlights: [
      "Language and expression",
      "Early number sense",
      "Play and participation",
    ],
  },
  {
    id: "primary",
    stage: "Primary years",
    grades: "Grade I – Grade V",
    description:
      "The next chapter in a child’s learning. Ask how the advertised CBSE curriculum connects reading, writing, mathematics, and wider exploration.",
    highlights: [
      "Literacy and numeracy",
      "Communication",
      "Creative exploration",
    ],
  },
];
export const FEATURES = [
  {
    title: "Communication & expression",
    desc: "Communication and soft-skills development feature in the school’s programme information.",
    question:
      "How do children practise speaking, listening, and working together?",
  },
  {
    title: "Mathematics & reasoning",
    desc: "The school promotes mathematics enrichment and Olympiad foundation learning.",
    question:
      "Which classes take part, and what does a typical activity involve?",
  },
  {
    title: "Digital learning",
    desc: "Digital learning and AI-powered learning appear in school promotional material.",
    question:
      "What tools are used, for which age groups, and with what teacher supervision?",
  },
];
export const VALUES = [
  {
    title: "Curiosity",
    description:
      "Make room for questions, new interests, and the pleasure of discovery.",
  },
  {
    title: "Expression",
    description: "Value a child’s ideas and the confidence to share them.",
  },
  {
    title: "Foundations",
    description:
      "Keep reading, communication, and number sense at the centre of the conversation.",
  },
];
export const ADMISSION_FAQ = [
  {
    q: "Which classes does Rainbow Digi School offer?",
    a: "The school’s published information covers Nursery, LKG, UKG, and Grades I to V. Ask the admissions team about availability for your child’s prospective class.",
  },
  {
    q: "What curriculum is advertised?",
    a: "The school advertises a CBSE curriculum. For formal affiliation details, textbooks, or the programme for a specific class, please ask the school directly.",
  },
  { q: "Where is the school?", a: SCHOOL.contact.address + "." },
  {
    q: "Can I ask about a school visit?",
    a: "Yes. Include your interest in visiting in the enquiry message, or call the school. The school will need to confirm whether a visit is available and agree a time with you; submitting an enquiry does not book an appointment.",
  },
  {
    q: "What about fees, age criteria, and required documents?",
    a: "Ask the school for the current fee details, age criteria, and document checklist for your prospective class. Please do not upload identity documents or private information about your child in this initial enquiry.",
  },
];
export const ADMISSION_STEPS = [
  {
    step: 1,
    title: "Introduce yourself",
    description:
      "Share your contact details and the class you are interested in.",
  },
  {
    step: 2,
    title: "Discuss your questions",
    description:
      "Ask about the programme, availability, fees, and a possible visit.",
  },
  {
    step: 3,
    title: "Confirm the next step",
    description:
      "Get the current process and requirements directly from the school.",
  },
];
// Only school-approved dated announcements and permissioned images belong here.
export const EVENTS = [];
export const GALLERY_IMAGES = [];
export const STATS = [];
export const TESTIMONIALS = [];
export const ADMISSION_DOCS = [];
