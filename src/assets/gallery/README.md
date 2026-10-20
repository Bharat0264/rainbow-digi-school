# Photo album assets

All six starter albums (Annual Day, Sports Day, Classrooms, Celebrations, Campus, Field Trips) are **placeholder albums**. Each contains three sample spreads made from the same twelve replaceable preview photographs. These are layout examples, not a claim that the photos depict those events. Both the shelf and data identify them as previews.

The twelve sources are eleven supplied school screenshot stills (113205 through 113637), plus the existing campus exterior. The UI screenshot 113831 is excluded. No dates or children's names have been invented.

To add final photos:

1. Drop a full WebP (up to 1600px, without enlarging a smaller original) and a 400 x 300 WebP thumbnail into `src/assets/gallery/<album-id>/`.
2. Add a `photo({ id, src: 'album-id/photo-full.webp', thumb: 'album-id/photo-thumb.webp', width, height, alt, caption, category, placeholder: false })` entry to the appropriate album's `pages[].photos` in `src/data/gallery.js`. The `photo` helper resolves nested asset paths and supplies thumbnail dimensions. Give each photo a unique id within the album.
3. Choose `collage`, `postcards`, or `moments` for the page template. Each starter template supports four photos. Create another page for the next group, with a stable page id and an event/month label.
4. Set the cover to a thumbnail URL and remove the album's placeholder flag only when its final photos are ready. Use descriptive alt text without children's names.

The exported `albums` data contains `{ id, title, category, cover, description, pages: [{ id, template, label, photos }] }`. Colours are selected by the optional `tone` field. Each original entry in `galleryPhotos` remains marked `placeholder: true`.

The viewer mounts only the current spread and its immediate neighbours. Current-spread full images and next-spread full images are loaded; neighbour previews use thumbnails. Grid thumbnails load lazily, and the lightbox opens full images on demand. Public controls do not add, delete or download photos.
