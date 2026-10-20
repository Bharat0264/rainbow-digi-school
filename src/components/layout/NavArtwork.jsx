const ROOT = '/assets/nav/optimized';
export const CANOPY_SIZES = '(min-width:1895px) 1800px, 95vw';
export const COMPACT_SIZES = '(min-width:464px) 440px, 95vw';
const variants = (name, widths, format) => widths.map(width => `${ROOT}/${name}-${width}.${format} ${width}w`).join(', ');
export function CanopyLayer({ layer, imageRef }) {
  const desktop = `desktop-${layer}`, compact = `compact-${layer}`;
  return <picture>
    <source media="(max-width:767px)" type="image/avif" srcSet={variants(compact,[480,960,1440,1536],'avif')} sizes={COMPACT_SIZES} width="1536" height="1024" />
    <source media="(max-width:767px)" type="image/webp" srcSet={variants(compact,[480,960,1440,1536],'webp')} sizes={COMPACT_SIZES} width="1536" height="1024" />
    <source type="image/avif" srcSet={variants(desktop,[1600,2400,3200,4800,5400],'avif')} sizes={CANOPY_SIZES} />
    <img ref={imageRef} className={layer==='branch'?'featured-branch':'featured-canopy-detail'} src={`${ROOT}/${desktop}-1600.webp`} srcSet={variants(desktop,[1600,2400,3200,4800,5400],'webp')} sizes={CANOPY_SIZES} width="2172" height="430" loading="eager" fetchPriority={layer==='branch'?'high':'auto'} alt="" aria-hidden="true" decoding="async" draggable={false} />
  </picture>;
}
export function AssemblyArt() {
  const sizes='(max-width:463px) 34.55vw, (max-width:767px) 160px, (min-width:1895px) 348px, 19.29vw';
  return <picture>
    <source type="image/avif" srcSet={variants('assembly',[320,640,960,1106],'avif')} sizes={sizes} />
    <img className="featured-assembly" src={`${ROOT}/assembly-320.webp`} srcSet={variants('assembly',[320,640,960,1106],'webp')} sizes={sizes} width="1106" height="1422" loading="eager" alt="Rainbow DIGI School — Excellence Begins Early" decoding="async" draggable={false} />
  </picture>;
}
export function SquirrelSprites({ gaitRef, entryRef }) {
  return <div className="featured-sprite-sources" aria-hidden="true">
    <picture><source type="image/avif" srcSet={variants('gait',[1024,2048,3072],'avif')} sizes="(max-width:767px) 80vw, (min-width:1895px) 800px, 42.23vw" />
      <img ref={gaitRef} src={`${ROOT}/gait-1024.webp`} srcSet={variants('gait',[1024,2048,3072],'webp')} sizes="(max-width:767px) 80vw, (min-width:1895px) 800px, 42.23vw" width="1024" height="128" alt="" decoding="async" /></picture>
    <picture><source type="image/avif" srcSet={variants('entry',[512,1024,1536],'avif')} sizes="(max-width:767px) 40vw, (min-width:1895px) 400px, 21.12vw" />
      <img ref={entryRef} src={`${ROOT}/entry-512.webp`} srcSet={variants('entry',[512,1024,1536],'webp')} sizes="(max-width:767px) 40vw, (min-width:1895px) 400px, 21.12vw" width="1024" height="256" alt="" decoding="async" /></picture>
  </div>;
}
