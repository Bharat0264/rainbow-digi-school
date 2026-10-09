// The single content source for Rainbow Digi School. Keep facts here, not in components.
export const SCHOOL = {
  name: 'Rainbow Digi School', tagline: 'Excellence Begins Early', location: 'Kandlakoya, Hyderabad',
  phone: '080085 33078', phoneHref: 'tel:+918008533078', timings: 'Mon–Fri 8:15 AM – 4:00 PM',
  address: { line1: 'Plot No. 104, Padmasree Enclave', line2: 'near Sanjana Courtyard, Kandlakoya', city: 'Hyderabad, Telangana 501401', full: 'Plot No. 104, Padmasree Enclave, near Sanjana Courtyard, Kandlakoya, Hyderabad, Telangana 501401' },
  rating: { score: 4.9, count: 31 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Digi+School+Padmasree+Enclave+Plot+No+104+Kandlakoya+Hyderabad+Telangana+501401',
  mapsEmbed: 'https://www.google.com/maps?q=Padmasree+Enclave,+Plot+No.+104,+near+Sanjana+Courtyard,+Kandlakoya,+Hyderabad,+Telangana+501401&output=embed',
  whatsappUrl: 'https://wa.me/918008533078?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20admissions.',
  social: { instagram: 'https://www.instagram.com/rainbowdigischool/' },
  principal: { name: 'Anita', title: 'Principal', experience: '24+ years of experience', message: 'Every early step deserves patient attention, playful discovery, and a steady belief in what a child can become.' },
};

export const ACADEMICS = [
  { id: 'nursery', stage: 'Early Years', grades: 'Nursery · LKG · UKG', age: 'A joyful beginning', description: 'Play and Learn gives early curiosity room to grow.', highlights: ['Activity-based learning', 'One-to-one care', 'Interactive smart panels'] },
  { id: 'primary', stage: 'Primary', grades: 'Grades 1 – 5', age: 'A confident foundation', description: 'CBSE-aligned learning made hands-on, thoughtful and connected.', highlights: ['Maths Lab', 'Computer Lab', 'Olympiad preparation'] },
];
export const STATS = [{ value: 'Nursery–5', suffix: '', label: 'Learning years' }, { value: 24, suffix: '+', label: 'Years of principal experience' }, { value: 4.9, suffix: '★', label: 'Google rating', decimal: true }, { value: 31, suffix: '', label: 'Google reviews' }];
export const FEATURES = [{ title: 'Smart Panels', desc: 'Interactive classrooms made for active participation', icon: 'MonitorPlay' }, { title: 'Maths Lab', desc: 'Ideas become tangible through doing', icon: 'Calculator' }, { title: 'Computer Lab', desc: 'Early digital confidence, thoughtfully guided', icon: 'Laptop' }, { title: 'Olympiad', desc: 'A supportive pathway for curious thinkers', icon: 'Medal' }, { title: 'AI-powered learning', desc: 'Early concepts for a changing world', icon: 'Sparkles' }, { title: 'Safe Transport', desc: 'Verified school transport across Medchal region', icon: 'Bus' }];
export const VALUES = [{ title: 'Play and Learn', description: 'Learning begins with a sense of wonder.', icon: 'Sparkles' }, { title: 'Individual care', description: 'Every child is seen and supported.', icon: 'Heart' }, { title: 'Future-ready', description: 'Digital confidence grows with strong foundations.', icon: 'Monitor' }];
// Photo placeholders only — replace with permissioned school photography.
export const GALLERY_IMAGES = [{ id: 1, src: null, alt: 'PHOTO SLOT — school exterior', category: 'Campus' }, { id: 2, src: null, alt: 'PHOTO SLOT — smart classroom', category: 'Classrooms' }, { id: 3, src: null, alt: 'PHOTO SLOT — Play and Learn activity', category: 'Learning' }, { id: 4, src: null, alt: 'PHOTO SLOT — safe school transport', category: 'Campus' }];
export const TESTIMONIALS = [];
export const EVENTS = [];
export const ADMISSION_STEPS = [{ step: 1, title: 'Enquire', description: 'Call or send an enquiry.' }, { step: 2, title: 'Visit', description: 'Meet us and see the campus.' }, { step: 3, title: 'Apply', description: 'Share the required documents.' }, { step: 4, title: 'Welcome', description: 'Begin your Rainbow journey.' }];
export const ADMISSION_DOCS = ['Birth certificate', 'Child and parent Aadhaar cards', 'Previous school transfer certificate, if applicable', 'Recent passport photographs', 'Address proof'];
export const ADMISSION_FAQ = [{ q: 'Which grades are offered?', a: 'Rainbow Digi School welcomes learners from Nursery through Grade 5.' }, { q: 'What curriculum framework do you follow?', a: 'The school follows the CBSE curriculum framework through an activity-based Play and Learn approach.' }, { q: 'Is transport available?', a: 'Verified school transport is available for the Medchal region. Please contact the school for route details.' }];
