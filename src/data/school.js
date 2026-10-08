/**
 * Rainbow Digi School – Central Content Data
 *
 * ╔══════════════════════════════════════════════╗
 * ║  Edit this file to update all site content  ║
 * ╚══════════════════════════════════════════════╝
 */

export const SCHOOL = {
  name: "Rainbow Digi School",
  tagline: "Excellence Begins Early",
  phone: "080085 33078",
  phoneHref: "tel:+918008533078",
  openingTime: "8:15 AM",
  rating: { score: 4.9, count: 31 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rainbow+Digi+School+Padmasree+Enclave+Plot+No+104+Kandlakoya+Hyderabad+Telangana+501401",
  mapsEmbed: "https://www.google.com/maps?q=Padmasree+Enclave,+Plot+No.+104,+near+Sanjana+Courtyard,+Kandlakoya,+Hyderabad,+Telangana+501401&output=embed",
  address: {
    line1: "Padmasree Enclave, Plot No. 104",
    line2: "near Sanjana Courtyard, Kandlakoya",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "501401",
    full: "Padmasree Enclave, Plot No. 104, near Sanjana Courtyard, Kandlakoya, Hyderabad, Telangana 501401",
  },

  /* ── PLACEHOLDERS ─────────────────────────────── */

  // [EMAIL] – Replace with actual school email
  email: "admissions@rainbowdigischool.com",

  // [WHATSAPP NUMBER] – Replace with actual WhatsApp number
  whatsapp: "+918008533078",
  whatsappUrl: "https://wa.me/918008533078?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20admissions.",

  // [SOCIAL LINKS] – Replace with actual URLs
  social: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
  },

  // [PRINCIPAL NAME] – Replace with actual name and photo
  principal: {
    name: "Dr. Ananya Sharma",
    title: "Founder & Principal",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    message: "At Rainbow Digi School, we believe every child carries a universe of potential. Our role is to provide the light, the tools, and the warmth to help that potential unfold. Welcome to a place where technology meets tenderness.",
  },
};

// [CLASSES OFFERED] – Update stages and descriptions as needed
export const ACADEMICS = [
  {
    id: "pre-primary",
    stage: "Pre-Primary",
    grades: "Playgroup · Nursery · Junior KG · Senior KG",
    age: "Ages 2.5 – 5",
    description: "Play-based discovery with gentle digital introductions. Building social skills, motor development, and early literacy through joy.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?auto=format&fit=crop&w=800&q=80",
    highlights: ["Montessori-inspired play", "Smart board storytelling", "Art & sensory labs", "Safe outdoor zones"],
  },
  {
    id: "primary",
    stage: "Primary School",
    grades: "Grades 1 – 5",
    age: "Ages 6 – 10",
    description: "A strong academic foundation fused with digital classrooms, project-based learning, and character development.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    highlights: ["Interactive smart classes", "STEM foundations", "Reading & language labs", "Sports & fitness"],
  },
  {
    id: "upper-primary",
    stage: "Upper Primary",
    grades: "Grades 6 – 8",
    age: "Ages 11 – 13",
    description: "Deepening analytical thinking with advanced digital tools, competitive exam prep, and leadership programs.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    highlights: ["Advanced STEM labs", "Public speaking", "Robotics & coding", "Inter-school competitions"],
  },
  {
    id: "high-school",
    stage: "High School",
    grades: "Grades 9 – 10",
    age: "Ages 14 – 16",
    description: "Board exam excellence with personalised coaching, career guidance, and holistic development.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    highlights: ["Board exam mastery", "Career counselling", "Digital library access", "Life-skills workshops"],
  },
];

export const STATS = [
  { value: 4.9, suffix: "★", label: "Google Rating", decimal: true },
  { value: 31, suffix: "+", label: "Happy Parent Reviews" },
  { value: 500, suffix: "+", label: "Students & Growing" },   // [PLACEHOLDER] – update count
  { value: 25, suffix: "+", label: "Dedicated Educators" },   // [PLACEHOLDER] – update count
];

export const VALUES = [
  { title: "Curiosity First", description: "We nurture the questions, not just the answers.", icon: "Lightbulb" },
  { title: "Digital Fluency", description: "Smart boards, coding labs, and future-ready skills.", icon: "Monitor" },
  { title: "Compassionate Care", description: "Every child is seen, heard, and celebrated.", icon: "Heart" },
  { title: "Joyful Growth", description: "Learning should feel like sunshine, never a burden.", icon: "Sun" },
];

export const FEATURES = [
  { title: "Smart Classrooms", desc: "Interactive digital boards in every room", icon: "MonitorPlay" },
  { title: "Sports & Fitness", desc: "Dedicated grounds and structured PE", icon: "Trophy" },
  { title: "Creative Arts", desc: "Music, dance, painting, and craft studios", icon: "Palette" },
  { title: "Safe Campus", desc: "CCTV-monitored, child-safe environment", icon: "ShieldCheck" },
  { title: "Caring Faculty", desc: "Trained, empathetic, and attentive mentors", icon: "Users" },
  { title: "Values & Life Skills", desc: "Character building woven into every day", icon: "Sparkles" },
];

export const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80", alt: "Smart classroom with interactive learning", category: "Classrooms" },
  { id: 2, src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80", alt: "Students engaged in collaborative learning", category: "Classrooms" },
  { id: 3, src: "https://images.unsplash.com/photo-1461896836934-bd45ba7b5391?auto=format&fit=crop&w=800&q=80", alt: "Sports day activities and athletics", category: "Sports" },
  { id: 4, src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80", alt: "Children playing outdoor sports", category: "Sports" },
  { id: 5, src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80", alt: "Annual Day cultural celebration", category: "Events" },
  { id: 6, src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80", alt: "Science exhibition and innovation fair", category: "Events" },
  { id: 7, src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80", alt: "Art class and creative expression", category: "Arts" },
  { id: 8, src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80", alt: "Music and performing arts session", category: "Arts" },
];

export const TESTIMONIALS = [
  {
    quote: "The balance between technology and personal attention is remarkable. Our daughter's confidence has blossomed here.",
    name: "Sowmya & Rajesh Reddy",
    relation: "Parents, Grade 3",
  },
  {
    quote: "Finding a school in Kandlakoya with genuinely modern teaching was a relief. The faculty truly cares.",
    name: "Dr. Ananya Murthy",
    relation: "Parent, Senior KG",
  },
  {
    quote: "My son wakes up excited for school every single day. That says everything about Rainbow Digi.",
    name: "Karthik Varma",
    relation: "Parent, Grade 1",
  },
];

export const EVENTS = [
  { title: "Annual Science & Innovation Expo", date: "November 15, 2026", tag: "Academic", description: "Students showcase projects spanning robotics, environmental science, and digital innovation." },
  { title: "Rainbow Sports Championship", date: "December 8, 2026", tag: "Sports", description: "Inter-house athletics, team games, and individual events celebrating sportsmanship." },
  { title: "Cultural Fest – Colours of Joy", date: "January 20, 2027", tag: "Cultural", description: "Dance, drama, music performances, and art exhibitions by every grade." },
  { title: "Parent-Teacher Connect", date: "February 5, 2027", tag: "Community", description: "Collaborative sessions for academic reviews, feedback, and growth planning." },
  { title: "Admissions Open House", date: "March 1, 2027", tag: "Admissions", description: "Campus tours, meet the faculty, and experience smart classrooms first-hand." },
  { title: "Graduation & Awards Ceremony", date: "April 10, 2027", tag: "Celebration", description: "Honouring academic excellence, character awards, and fond farewells." },
];

export const ADMISSION_STEPS = [
  { step: 1, title: "Enquire", description: "Call, WhatsApp, or fill our online form to start the conversation." },
  { step: 2, title: "Campus Visit", description: "Schedule a personalised tour of our smart classrooms and facilities." },
  { step: 3, title: "Apply", description: "Submit the application with required documents for your child's grade." },
  { step: 4, title: "Welcome", description: "Receive your offer, complete onboarding, and join the Rainbow family." },
];

export const ADMISSION_DOCS = [
  "Birth certificate (original & photocopy)",
  "Aadhaar card of child and parents",
  "Previous school Transfer Certificate (if applicable)",
  "Report card / progress report from last school",
  "4 recent passport-sized photographs",
  "Address proof (Aadhaar / utility bill)",
];

export const ADMISSION_FAQ = [
  { q: "What is the admission age for Playgroup?", a: "Children who are 2.5 years old by June of the academic year are eligible for Playgroup admission." },
  { q: "Is there an entrance test?", a: "For Pre-Primary, we conduct an informal interaction. For higher grades, a simple assessment in English and Maths is held." },
  { q: "What curriculum does the school follow?", a: "We follow the CBSE curriculum enhanced with our own digital-first teaching methodology and activity-based learning modules." },
  { q: "What are the school timings?", a: "The school opens at 8:15 AM. Pre-Primary sessions end at 12:30 PM, and Primary onwards at 3:30 PM." },
  { q: "Is transport available?", a: "Yes, GPS-tracked school buses cover major areas in Kandlakoya, Kompally, and surrounding localities." },
  { q: "What safety measures are in place?", a: "The campus has CCTV surveillance, trained security, child-safe infrastructure, and a strict visitor management system." },
];

export const MARQUEE_WORDS = [
  "Smart Classes", "Sports", "Arts & Music", "Values", "STEM Labs",
  "Safe Campus", "Digital Library", "Caring Faculty", "Joyful Learning", "Future Ready",
];
