// One source of truth for Rainbow DIGI School.
// Contact details and campus image confirmed by the school owner.
export const SCHOOL = {
  name: "Rainbow DIGI School",
  tagline: "Excellence Begins Early",
  location: "Kandlakoya, Hyderabad",
  classes: "Nursery to Grade V",
  curriculum: "CBSE curriculum",
  curriculumNote:
    "The school advertises a CBSE curriculum. For formal CBSE affiliation status, textbook selection, or class-specific syllabi, please speak with the school directly.",
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
  social: {
    instagram: "https://www.instagram.com/rainbowdigischool/",
  },
  campusPhoto: {
    src: "/images/about-building-real.jpg",
    width: 765,
    height: 1020,
    alt: "Rainbow Digi School exterior with its school sign and colourful entrance in Kandlakoya, Hyderabad",
  },
};

/* ==========================================================================
   1. HOME PAGE DATA — School Introduction & Navigation Launchpad
   ========================================================================== */
export const HOME_STAGES = [
  {
    id: "early-years",
    number: "01",
    stage: "Early Years",
    grades: "Nursery · LKG · UKG",
    description:
      "A gentle, joyful entry into school life. Focused on sensory discovery, spoken language, social comfort, and developing natural curiosity.",
    link: "/academics#early-years",
    linkText: "Explore early years learning",
  },
  {
    id: "primary-years",
    number: "02",
    stage: "Primary Years",
    grades: "Grade I to Grade V",
    description:
      "Building conceptual strength in literacy, mathematical reasoning, and environmental inquiry as children grow into independent learners.",
    link: "/academics#primary-years",
    linkText: "Explore primary curriculum",
  },
];

export const HOME_PILLARS = [
  {
    title: "Nurturing Environment",
    desc: "A warm, community-rooted setting in Padmashree Enclave where young children feel secure, welcomed, and eager to participate every day.",
  },
  {
    title: "Play to Structured Learning",
    desc: "A thoughtful pedagogical transition from hands-on early sensory exploration to structured reading, numeracy, and foundational reasoning.",
  },
  {
    title: "Open Parent Communication",
    desc: "Direct access to educators and school leadership so parents stay actively informed about their child’s progress and classroom milestones.",
  },
];

export const HOME_FAQS = [
  {
    q: "Where is Rainbow Digi School located in Kandlakoya?",
    a: "The school is located at Plot No. 61, Padmashree Enclave, near Sanjana Courtyard, Kandlakoya, Hyderabad – 501401. It is conveniently accessible from both Medchal Road (NH-44) and the Outer Ring Road (ORR) junction.",
  },
  {
    q: "Which age groups and classes are offered?",
    a: "Rainbow Digi School provides programmes from Early Childhood (Nursery, LKG, UKG) through Primary School (Grades I to V).",
  },
  {
    q: "What curriculum does the school follow?",
    a: "The school advertises a CBSE-pattern curriculum focusing on core literacy, numeracy, environmental studies, and foundational reasoning. Parents are invited to discuss class-specific textbooks and syllabus details directly with the school.",
  },
  {
    q: "How can parents visit the school or enquire about admissions?",
    a: "You can submit an online enquiry on our Admissions page or call the admissions desk at +91 80085 33078 / +91 91210 59881 to schedule a personal campus walkthrough.",
  },
];

/* ==========================================================================
   2. ACADEMICS PAGE DATA — Deep Curriculum & Teaching Architecture
   ========================================================================== */
export const ACADEMIC_PROGRAMMES = {
  earlyYears: {
    id: "early-years",
    stage: "Early Childhood Education",
    grades: "Nursery, LKG & UKG",
    overview:
      "Early childhood education at Rainbow Digi School is designed around how young children naturally discover the world: through tactile exploration, storytelling, rhythmic songs, and guided social interaction. Rather than formal testing, educators nurture listening skills, phonetic awareness, and early motor coordination.",
    pillars: [
      {
        title: "Phonics & Spoken Expression",
        desc: "Interactive storytelling, rhymes, and phonemic awareness that help children articulate thoughts clearly and build early vocabulary.",
      },
      {
        title: "Early Numeracy & Spatial Sense",
        desc: "Counting concrete objects, recognising shapes, identifying visual patterns, and understanding basic size and quantity relationships.",
      },
      {
        title: "Sensory & Fine Motor Coordination",
        desc: "Clay shaping, paper tearing, crayon control, block building, and guided play that strengthen hand-eye coordination for early handwriting.",
      },
      {
        title: "Social Readiness & Self-Expression",
        desc: "Sharing, listening in small groups, following gentle daily routines, and building emotional confidence around peers and teachers.",
      },
    ],
  },
  primaryYears: {
    id: "primary-years",
    stage: "Primary Years Programme",
    grades: "Grade I to Grade V",
    overview:
      "As students transition into primary schooling, the academic framework broadens into structured subject learning under an advertised CBSE curriculum. The emphasis moves from guided discovery toward conceptual clarity, structured reading comprehension, mathematical calculation, and scientific inquiry into the surrounding world.",
    pillars: [
      {
        title: "Structured Literacy & Languages",
        desc: "Reading fluency, grammar foundations, descriptive writing, and bilingual expression that encourage children to communicate with clarity and confidence.",
      },
      {
        title: "Mathematics & Analytical Thinking",
        desc: "Conceptual arithmetic (addition, subtraction, multiplication, division), word problems, geometric intuition, and foundation-level logical reasoning.",
      },
      {
        title: "Environmental Studies & Science Inquiry",
        desc: "Exploring plants, animals, natural resources, community roles, and physical phenomena through observation, questions, and simple experiments.",
      },
      {
        title: "Thoughtful Digital & Computer Familiarity",
        desc: "Teacher-guided computer awareness, interactive classroom multimedia, and age-appropriate technology understanding with balanced screen exposure.",
      },
    ],
  },
};

export const LEARNING_METHODOLOGY = [
  {
    title: "Activity-Based Learning",
    desc: "Concepts are introduced through concrete models, visual diagrams, and interactive activities before moving to abstract workbook exercises.",
  },
  {
    title: "Continuous Observational Assessment",
    desc: "Teachers observe day-to-day understanding, project participation, and curiosity, reducing stress while providing timely developmental feedback.",
  },
  {
    title: "Curiosity-Led Questions",
    desc: "Classroom dialogues encourage children to ask 'why' and 'how', cultivating independent inquiry and confidence in sharing ideas.",
  },
];

export const PARENT_CURRICULUM_QUESTIONS = [
  "Which textbooks, workbooks, and supplementary reading materials are used for my child's class?",
  "How do teachers support children who need extra time to master phonics or foundational arithmetic?",
  "What is the school's policy on daily homework, home reading habits, and parent involvement?",
  "How are co-curricular activities, art, and physical games integrated into the weekly timetable?",
];

/* ==========================================================================
   3. ADMISSIONS PAGE DATA — Clear 5-Step Journey, Age Criteria & Checklist
   ========================================================================== */
export const ADMISSION_ROADMAP = [
  {
    step: 1,
    title: "Submit an Enquiry",
    description:
      "Fill out the online enquiry form below or call the admissions desk to register your interest and share your child's prospective class.",
  },
  {
    step: 2,
    title: "Educational Counselling",
    description:
      "Speak directly with the school team to discuss your child's learning stage, programme offerings, fee structures, and class availability.",
  },
  {
    step: 3,
    title: "Campus Walkthrough",
    description:
      "Visit the school in Kandlakoya to tour classrooms, observe learning spaces, and meet teachers in a welcoming, unhurried atmosphere.",
  },
  {
    step: 4,
    title: "Document Verification",
    description:
      "Submit standard verification documents including the child’s birth certificate, photographs, and address proof for administrative review.",
  },
  {
    step: 5,
    title: "Enrolment Confirmation",
    description:
      "Complete enrolment formalities, receive the academic calendar and uniform/book guidance, and prepare for your child's first school day.",
  },
];

export const ADMISSION_ELIGIBILITY = [
  { stage: "Nursery", age: "3+ Years", focus: "Social interaction, language exposure & sensory play" },
  { stage: "LKG", age: "4+ Years", focus: "Phonics, letter recognition, motor coordination & counting" },
  { stage: "UKG", age: "5+ Years", focus: "Early reading, sentence formation, numbers & pattern work" },
  { stage: "Grade I", age: "6+ Years", focus: "Foundational literacy, arithmetic operations & environmental study" },
  { stage: "Grades II–V", age: "7+ to 10+ Years", focus: "Primary curriculum, language proficiency & analytical reasoning" },
];

export const ADMISSION_DOCUMENTS = [
  {
    name: "Child's Birth Certificate",
    detail: "Official certificate issued by the Municipal Corporation or Gram Panchayat (original for verification, copy for records).",
  },
  {
    name: "Recent Passport Photographs",
    detail: "Recent colour passport-size photographs of the child (4 copies) and parents/guardians (2 copies each).",
  },
  {
    name: "Proof of Residence",
    detail: "Government-issued address proof (Aadhaar Card, utility bill, or registered rental agreement).",
  },
  {
    name: "Transfer Certificate (TC)",
    detail: "Required for admission into Grade II and above from the child's previous recognised school.",
  },
  {
    name: "Previous Academic Records",
    detail: "Report cards or progress summaries from the previous school/kindergarten, where applicable.",
  },
];

export const ADMISSION_FAQS = [
  {
    q: "When are admissions open for the 2026–2027 academic year?",
    a: "Admissions enquiries for the upcoming 2026–2027 session are currently being accepted for Nursery through Grade V. Parents are encouraged to enquire early to confirm seat availability for their preferred class.",
  },
  {
    q: "What is the age cutoff for Nursery and primary admissions?",
    a: "As a general guideline, children entering Nursery should be 3+ years old by the start of the academic term, LKG 4+ years, UKG 5+ years, and Grade I 6+ years. Exact cutoff dates can be confirmed directly with the admissions team.",
  },
  {
    q: "How can parents arrange a campus walkthrough?",
    a: "You can indicate your request in the admissions form message or call +91 80085 33078 / +91 91210 59881. The school will schedule a convenient morning time during working days so you can see classrooms in person.",
  },
  {
    q: "What fee details and payment schedules apply?",
    a: "Fee schedules, term breakdown, and material costs vary by grade level. The school shares the complete, transparent fee schedule during the admissions interaction.",
  },
  {
    q: "Are mid-term admissions permitted for relocating families?",
    a: "Subject to seat availability in the respective grade and submission of valid transfer documentation, the school accommodates mid-term enrolments. Please call the school desk directly to check current openings.",
  },
];

/* ==========================================================================
   4. CAMPUS PAGE DATA — Factual School Environment & Visit Guidance
   ========================================================================== */
export const CAMPUS_DETAILS = {
  address: "Plot No. 61, Padmashree Enclave, near Sanjana Courtyard, Kandlakoya, Hyderabad – 501401",
  environment: [
    {
      title: "Peaceful Residential Enclave",
      desc: "Situated inside Padmashree Enclave away from heavy highway traffic and noise, providing a calm, safe learning atmosphere.",
    },
    {
      title: "Bright, Naturally Lit Classrooms",
      desc: "Spacious learning rooms designed with natural ventilation, child-friendly ergonomic desks, and colourful display boards.",
    },
    {
      title: "Dedicated Early Years Play Space",
      desc: "Supervised indoor and outdoor play spaces equipped for motor development, group games, and tactile activities.",
    },
    {
      title: "Supervised Safety & Perimeter",
      desc: "Single-point visitor entry and continuous educator supervision throughout the school day ensure peace of mind for families.",
    },
  ],
  visitChecklist: [
    "Classroom layout, natural lighting, and child-safe furnishings.",
    "Interaction and communication style between educators and students.",
    "Display of authentic student artwork, charts, and learning materials.",
    "Cleanliness of sanitation facilities and drinking water arrangements.",
    "Accessibility and drop-off ease within Padmashree Enclave.",
  ],
};

/* ==========================================================================
   5. SCHOOL LIFE PAGE DATA — Daily Rhythm, Celebrations & Community
   ========================================================================== */
export const SCHOOL_LIFE_EXPERIENCE = {
  dailyRhythm: [
    {
      time: "Morning Circle & Assembly",
      desc: "The day begins with a gentle morning gathering: short prayers, thought for the day, stretching exercises, and sharing positive news.",
    },
    {
      time: "Focused Core Learning",
      desc: "Interactive sessions dedicated to reading, phonics, mathematics, and environmental concepts when children's energy is highest.",
    },
    {
      time: "Snack Break & Social Play",
      desc: "Supervised mealtime where children practice table etiquette, sharing, handwashing, and relaxed conversation with classmates.",
    },
    {
      time: "Creative & Co-Curricular Stations",
      desc: "Afternoons feature hands-on art, drawing, singing rhymes, physical movement games, and storytelling sessions.",
    },
  ],
  celebrations: [
    {
      title: "National Pride Observances",
      desc: "Independence Day and Republic Day flag-hoisting ceremonies, patriotic songs, and learning about India’s national symbols and unity.",
    },
    {
      title: "Cultural & Festive Celebrations",
      desc: "Traditional festivals celebrated with festive attire, greeting cards, cultural stories, and understanding diverse community traditions.",
    },
    {
      title: "Appreciation & Community Days",
      desc: "Doctor's Day, Teachers' Day, and Guru Purnima activities where students express gratitude to community helpers and mentors.",
    },
    {
      title: "Sports & Physical Movement Days",
      desc: "Fun races, obstacle courses, relay games, and physical challenges that build sportsmanship, balance, and peer encouragement.",
    },
  ],
};

/* ==========================================================================
   LEGACY / SHARED EXPORTS (Preserved for compatibility)
   ========================================================================== */
export const ACADEMICS = [
  {
    id: "nursery",
    stage: "Early Years",
    grades: "Nursery · LKG · UKG",
    description:
      "A first step into school life. Early sensory play, phonetic awareness, language expression, and social readiness in a caring setting.",
    highlights: [
      "Language and expression",
      "Early number sense",
      "Play and participation",
    ],
  },
  {
    id: "primary",
    stage: "Primary Years",
    grades: "Grade I to Grade V",
    description:
      "Building foundational mastery in literacy, mathematics, environmental inquiry, and structured thinking under the advertised CBSE framework.",
    highlights: [
      "Literacy and numeracy",
      "Communication",
      "Creative exploration",
    ],
  },
];

export const FEATURES = [
  {
    title: "Communication & Expression",
    desc: "Language enrichment, storytelling, and spoken English confidence embedded into everyday classroom dialogues.",
    question: "How do educators encourage shy or new learners to speak up?",
  },
  {
    title: "Mathematics & Reasoning",
    desc: "Concept-first numeracy, visual number patterns, and foundation-level problem solving designed to build confidence.",
    question: "What hands-on materials are used to explain math concepts?",
  },
  {
    title: "Thoughtful Digital Learning",
    desc: "Age-appropriate digital familiarity and multimedia-assisted instruction with teacher supervision and balanced screen time.",
    question: "How is digital exposure balanced with physical book reading?",
  },
];

export const VALUES = [
  {
    title: "Curiosity",
    description: "Making room for questions, exploration, and the joy of discovery.",
  },
  {
    title: "Expression",
    description: "Valuing each child’s unique voice and building self-confidence.",
  },
  {
    title: "Foundations",
    description: "Keeping strong reading, writing, and numeracy at the center of education.",
  },
];

export const ADMISSION_FAQ = ADMISSION_FAQS;
export const ADMISSION_STEPS = ADMISSION_ROADMAP.slice(0, 3);
export const EVENTS = [];
export const GALLERY_IMAGES = [];
export const STATS = [];
export const TESTIMONIALS = [];
export const ADMISSION_DOCS = [];
