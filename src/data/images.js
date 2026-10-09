export const IMAGES = {
  heroLeft: { key: 'hero-left', path: '/images/hero-left.jpg', alt: 'PHOTO SLOT — child learning through play', label: 'A joyful learning moment', topic: 'classroom', shape: 'arch' },
  heroRight: { key: 'hero-right', path: '/images/hero-right.jpg', alt: 'PHOTO SLOT — child at Rainbow Digi School', label: 'A bright school day', topic: 'art', shape: 'arch' },
  about: { key: 'about', path: '/images/about.jpg', alt: 'PHOTO SLOT — Rainbow Digi School community', label: 'Our school community', topic: 'classroom', shape: 'squircle' },
  building: { key: 'building', path: '/images/building.jpg', alt: 'PHOTO SLOT — Rainbow Digi School building', label: 'Our welcoming campus', topic: 'building', shape: 'squircle' },
  principal: { key: 'principal', path: '/images/principal.jpg', alt: 'PHOTO SLOT — Principal Anita', label: 'Principal Anita', topic: 'celebration', shape: 'blob' },
  ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`campus${i + 1}`, { key: `campus-${i + 1}`, path: `/images/campus-${i + 1}.jpg`, alt: `PHOTO SLOT — campus view ${i + 1}`, label: 'Campus moment', topic: i % 2 ? 'classroom' : 'building', shape: 'squircle' }])),
  ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`event${i + 1}`, { key: `event-${i + 1}`, path: `/images/event-${i + 1}.jpg`, alt: `PHOTO SLOT — school event ${i + 1}`, label: 'A Rainbow celebration', topic: 'celebration', shape: 'squircle' }])),
  ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`activity${i + 1}`, { key: `activity-${i + 1}`, path: `/images/activity-${i + 1}.jpg`, alt: `PHOTO SLOT — learning activity ${i + 1}`, label: 'Play and Learn', topic: ['maths', 'computer', 'art', 'sports'][i], shape: 'squircle' }])),
};
