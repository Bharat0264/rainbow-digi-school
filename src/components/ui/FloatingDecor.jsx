export default function FloatingDecor({ variant = "ambient" }) {
  return (
    <div className="floating-decor-layer" aria-hidden="true">
      {/* Ref 2: Soft floating amber sphere */}
      <div className="decor-item decor-sphere" />
      {/* Ref 2: Translucent organic pebble */}
      <div className="decor-item decor-pebble">
        <svg viewBox="0 0 120 90" fill="none" className="decor-svg">
          <path
            d="M25 65C12 50 18 25 45 15C72 5 105 18 112 42C118 66 98 85 70 88C42 90 38 80 25 65Z"
            fill="url(#pebble-gradient)"
          />
          <defs>
            <linearGradient id="pebble-gradient" x1="20" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="1" stopColor="#fedea6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Ref 2: Delicate botanical leaf */}
      <div className="decor-item decor-leaf">
        <svg viewBox="0 0 90 90" fill="none" className="decor-svg">
          <path
            d="M15 75C15 75 25 35 70 20C75 45 60 70 30 75C22 76 15 75 15 75Z"
            fill="url(#leaf-gradient)"
          />
          <path
            d="M20 72C35 55 52 40 70 20"
            stroke="rgba(45, 110, 80, 0.28)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="leaf-gradient" x1="20" y1="70" x2="70" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c5ebd6" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e8f8ee" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
