import { memo, useState } from 'react';
import { Building2, Monitor, Palette, Trophy, Calculator, PartyPopper } from 'lucide-react';
const art = { building: Building2, classroom: Monitor, art: Palette, sports: Trophy, maths: Calculator, computer: Monitor, celebration: PartyPopper };
// Missing photo slots render their existing artwork without a failed request.
const availableImages = import.meta.glob('/public/images/*', { eager: true, query: '?url', import: 'default' });
function SmartImage({ image, className = '', imgClassName = '' }) {
  const [failedPath, setFailedPath] = useState(null);
  const Icon = art[image.topic] || Monitor;
  const webpPath = image.path?.replace(/\.(jpe?g|png)$/i, '.webp');
  const path = availableImages[`/public${webpPath}`] ? webpPath : image.path;
  const available = availableImages[`/public${path}`] || /^https?:/.test(path || '');
  return <div className={`smart-image smart-image-${image.shape || 'squircle'} ${className}`}>
    {available && failedPath !== path ? (
      <img src={path} alt={image.alt} width={image.width || 800} height={image.height || 600}
        loading="lazy" decoding="async" onError={() => setFailedPath(path)}
        className={`h-full w-full object-cover ${imgClassName}`} />
    ) : (
      <div className="smart-fallback"><span className="smart-icon"><Icon size={34} /></span><span>{image.label}</span></div>
    )}
  </div>;
}
export default memo(SmartImage);
