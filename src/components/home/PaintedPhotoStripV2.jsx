import { memo } from 'react';
import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvasV2 from '../ui/PaintCanvasV2';
import Reveal from '../ui/Reveal';

function PaintedPhotoStripV2() {
  const photos = [IMAGES.activity1, IMAGES.activity2, IMAGES.campus1, IMAGES.activity3];
  return (
    <PaintCanvasV2 mood="warm" className="pg-deferred px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map((image) => (
          <Reveal
            key={image.key}
            className="pg-glass pg-glass--card p-2"
          >
            <SmartImage image={image} className="aspect-[4/3] rounded-[18px] overflow-hidden"/>
          </Reveal>
        ))}
      </div>
    </PaintCanvasV2>
  );
}

export default memo(PaintedPhotoStripV2);
