const files = import.meta.glob('../assets/gallery/**/*.webp', { eager: true, query: '?url', import: 'default' });
const asset = name => {
  const url = files[`../assets/gallery/${name}`];
  if (!url) throw new Error(`Gallery image not found: ${name}`);
  return url;
};
export const GALLERY_CATEGORIES = ['All', 'Campus', 'Classrooms', 'Celebrations', 'Activities'];
export function photo({ src, thumb, width = 765, height = 1020, thumbWidth = 400, thumbHeight = 300, date = null, ...details }) {
  return { ...details, src: asset(src), thumb: asset(thumb), width, height, thumbWidth, thumbHeight, date };
}
// Replaceable previews: 11 user-supplied screenshot stills and the existing campus photo.
export const galleryPhotos = [
  photo({"id":"gallery-01","src":"gallery-01-full.webp","thumb":"gallery-01-thumb.webp","width":411,"height":310,"alt":"Festival flowers and offerings","caption":"Festival flowers and offerings","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-02","src":"gallery-02-full.webp","thumb":"gallery-02-thumb.webp","width":406,"height":228,"alt":"A school festival gathering","caption":"A school festival gathering","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-03","src":"gallery-03-full.webp","thumb":"gallery-03-thumb.webp","width":263,"height":506,"alt":"Festive traditions at school","caption":"Festive traditions at school","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-04","src":"gallery-04-full.webp","thumb":"gallery-04-thumb.webp","width":531,"height":405,"alt":"A colourful celebration display","caption":"A colourful celebration display","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-05","src":"gallery-05-full.webp","thumb":"gallery-05-thumb.webp","width":297,"height":222,"alt":"Independence Day decorations","caption":"Independence Day decorations","category":"Events","placeholder":true}),
  photo({"id":"gallery-06","src":"gallery-06-full.webp","thumb":"gallery-06-thumb.webp","width":295,"height":226,"alt":"Our school community gathering","caption":"Our school community gathering","category":"Events","placeholder":true}),
  photo({"id":"gallery-07","src":"gallery-07-full.webp","thumb":"gallery-07-thumb.webp","width":637,"height":402,"alt":"Friendship Day artwork","caption":"Friendship Day artwork","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-08","src":"gallery-08-full.webp","thumb":"gallery-08-thumb.webp","width":670,"height":400,"alt":"Friendship Day celebrations","caption":"Friendship Day celebrations","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-09","src":"gallery-09-full.webp","thumb":"gallery-09-thumb.webp","width":400,"height":667,"alt":"A shared movie moment","caption":"A shared movie moment","category":"Events","placeholder":true}),
  photo({"id":"gallery-10","src":"gallery-10-full.webp","thumb":"gallery-10-thumb.webp","width":523,"height":397,"alt":"Red Colour Day decorations","caption":"Red Colour Day decorations","category":"Celebrations","placeholder":true}),
  photo({"id":"gallery-11","src":"gallery-11-full.webp","thumb":"gallery-11-thumb.webp","width":517,"height":386,"alt":"Doctors Day activities","caption":"Doctors Day activities","category":"Events","placeholder":true}),
  photo({"id":"gallery-12","src":"gallery-12-full.webp","thumb":"gallery-12-thumb.webp","width":765,"height":1020,"alt":"Rainbow DIGI School building exterior","caption":"Our school in Kandlakoya","category":"Campus","placeholder":true}),
];

// All four starter albums and their photo entries are replaceable placeholders.
// Replace any galleryPhotos[...] line below with photo({...}) for a final image.
export const albums = [
  {
    id: 'campus', title: 'Campus', category: 'Campus', tone: 'green',
    cover: asset('covers/campus.webp'), coverThumb: asset('covers/campus-640.webp'), coverSrcSet: `${asset('covers/campus-640.webp')} 640w, ${asset('covers/campus.webp')} 1435w`, coverWidth: 1435, coverHeight: 1096, coverAlt: 'Illustrated school building with a blue flag and garden', placeholder: true,
    description: "A little look around the place where we learn and grow.",
    pages: [
      { id: 'campus-01', template: 'collage', label: "The little things", photos: [
        galleryPhotos[11],
        galleryPhotos[0],
        galleryPhotos[1],
        galleryPhotos[2],
      ] },
      { id: 'campus-02', template: 'postcards', label: "Together is our favourite place", photos: [
        galleryPhotos[3],
        galleryPhotos[4],
        galleryPhotos[5],
        galleryPhotos[6],
      ] },
      { id: 'campus-03', template: 'moments', label: "A page to remember", photos: [
        galleryPhotos[7],
        galleryPhotos[8],
        galleryPhotos[9],
        galleryPhotos[10],
      ] },
    ],
  },
  {
    id: 'classrooms', title: 'Classrooms', category: 'Classrooms', tone: 'blue',
    cover: asset('covers/classrooms.webp'), coverWidth: 300, coverHeight: 495, coverAlt: 'Illustration of a teacher reading with children in a classroom', placeholder: true,
    description: "A book ready for everyday discoveries and creative learning.",
    pages: [
      { id: 'classrooms-01', template: 'collage', label: "The little things", photos: [
        galleryPhotos[6],
        galleryPhotos[7],
        galleryPhotos[8],
        galleryPhotos[9],
      ] },
      { id: 'classrooms-02', template: 'postcards', label: "Together is our favourite place", photos: [
        galleryPhotos[10],
        galleryPhotos[11],
        galleryPhotos[0],
        galleryPhotos[1],
      ] },
      { id: 'classrooms-03', template: 'moments', label: "A page to remember", photos: [
        galleryPhotos[2],
        galleryPhotos[3],
        galleryPhotos[4],
        galleryPhotos[5],
      ] },
    ],
  },
  {
    id: 'celebrations', title: 'Celebrations', category: 'Celebrations', tone: 'purple',
    cover: asset('covers/celebrations.webp'), coverWidth: 300, coverHeight: 495, coverAlt: 'Illustration of children dancing on a colourful celebration stage', placeholder: true,
    description: "Colourful traditions and moments of togetherness.",
    pages: [
      { id: 'celebrations-01', template: 'collage', label: "The little things", photos: [
        galleryPhotos[0],
        galleryPhotos[1],
        galleryPhotos[2],
        galleryPhotos[3],
      ] },
      { id: 'celebrations-02', template: 'postcards', label: "Together is our favourite place", photos: [
        galleryPhotos[4],
        galleryPhotos[5],
        galleryPhotos[6],
        galleryPhotos[7],
      ] },
      { id: 'celebrations-03', template: 'moments', label: "A page to remember", photos: [
        galleryPhotos[8],
        galleryPhotos[9],
        galleryPhotos[10],
        galleryPhotos[11],
      ] },
    ],
  },
  {
    id: 'activities', title: 'Activities', category: 'Activities', tone: 'orange',
    cover: asset('covers/activities.webp'), coverWidth: 300, coverHeight: 495, coverAlt: 'Illustration of children painting and making crafts', placeholder: true,
    description: "Creative play, colourful artwork and everyday discoveries.",
    pages: [
      { id: 'activities-01', template: 'collage', label: "The little things", photos: [
        galleryPhotos[8],
        galleryPhotos[9],
        galleryPhotos[10],
        galleryPhotos[11],
      ] },
      { id: 'activities-02', template: 'postcards', label: "Together is our favourite place", photos: [
        galleryPhotos[0],
        galleryPhotos[1],
        galleryPhotos[2],
        galleryPhotos[3],
      ] },
      { id: 'activities-03', template: 'moments', label: "A page to remember", photos: [
        galleryPhotos[4],
        galleryPhotos[5],
        galleryPhotos[6],
        galleryPhotos[7],
      ] },
    ],
  },];
