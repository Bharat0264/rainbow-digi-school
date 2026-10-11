import { useId } from 'react';

// A separate, non-interactive handle sits behind the original mascot's fists.
// Its supports overlap the bottom rail; the mascot remains the clickable control.
export default function MonkeyHandle() {
  const id = useId().replaceAll(':', '');
  return <svg className="featured-handle" viewBox="0 0 280 44" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-wood`} x1="0" x2="0" y1="0" y2="1">
        <stop stopColor="#754016"/><stop offset=".16" stopColor="#d58d42"/>
        <stop offset=".34" stopColor="#ffda93"/><stop offset=".57" stopColor="#de9b52"/>
        <stop offset=".8" stopColor="#a3612e"/><stop offset="1" stopColor="#603018"/>
      </linearGradient>
      <linearGradient id={`${id}-leather`} x1="0" x2="1">
        <stop stopColor="#3e2717"/><stop offset=".4" stopColor="#b48a47"/><stop offset="1" stopColor="#664124"/>
      </linearGradient>
    </defs>
    <path d="M29 4v24M251 4v24" stroke="#503017" strokeWidth="10" strokeLinecap="round"/>
    <path d="M29 4v24M251 4v24" stroke={`url(#${id}-leather)`} strokeWidth="7" strokeLinecap="round"/>
    <rect x="15" y="19" width="250" height="14" rx="7" fill="#3e2319" opacity=".2"/>
    <rect x="13" y="15" width="254" height="14" rx="7" fill={`url(#${id}-wood)`} stroke="#834718" strokeWidth="1"/>
    <path d="M22 18c30-1 48 2 69 0s58-1 82 0 50-1 79 0" fill="none" stroke="#ffe2a4" strokeWidth="1.3"/>
    <path d="M23 24c19 2 37-1 56 0s34 2 58 0 63 2 74 0 26-1 43 0M143 21c14-1 25 1 34 0" fill="none" stroke="#925325" strokeWidth=".65"/>
    <ellipse cx="54" cy="22" rx="7" ry="1.8" fill="none" stroke="#a86a32" strokeWidth=".7"/>
    <path d="M29 13c-3 5-3 12 0 17M251 13c-3 5-3 12 0 17" fill="none" stroke="#4f351e" strokeWidth="6" strokeLinecap="round"/>
    <path d="M28 13c-2 6-2 12 1 16M250 13c-2 6-2 12 1 16" fill="none" stroke="#d8af68" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="29" cy="5" r="2.2" fill="#e1b978" stroke="#634421"/>
    <circle cx="251" cy="5" r="2.2" fill="#e1b978" stroke="#634421"/>
    {/* The source fists are at x=30 and x=218 in its 250px-wide image. */}
    <ellipse cx="102" cy="24" rx="9" ry="4.5" fill="#4c2314" opacity=".32"/>
    <ellipse cx="177" cy="24" rx="9" ry="4.5" fill="#4c2314" opacity=".32"/>
  </svg>;
}
