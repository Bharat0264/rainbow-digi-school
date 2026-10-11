import { useState } from 'react';

/**
 * Production Rainbow Digi School Logo Component.
 * Renders the embroidered, raised, multicoloured master logo with
 * realistic stitching, dimensional depth, and transparent background.
 */
export default function Logo({ className = '', iconOnly = false, alt = 'Rainbow Digi School', ...props }) {
  const [failed, setFailed] = useState(false);

  if (iconOnly) {
    return (
      <img
        src="/favicon.svg"
        alt={alt}
        width={64}
        height={64}
        className={`object-contain inline-block ${className}`.trim()}
        {...props}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 1021 491"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={alt}
      className={`object-contain ${className}`.trim()}
      {...props}
    >
      <title>{alt}</title>
      <image
        href={failed ? '/images/rainbow-logo-embroidered.png' : '/images/rainbow-logo-embroidered.webp'}
        width="1021"
        height="491"
        onError={() => setFailed(true)}
      />
    </svg>
  );
}
