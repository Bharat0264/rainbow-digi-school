import React from 'react';
import { MARQUEE_WORDS } from '../../data/school';

export default function MarqueeStrip() {
  const repeatedWords = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div className="bg-royal-blue py-4 overflow-hidden flex relative select-none">
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-marquee {
            animation: scroll 20s linear infinite;
          }
          .marquee-container:hover .animate-marquee {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-marquee {
              animation: none;
            }
          }
        `}
      </style>
      <div className="marquee-container flex w-full">
        <div className="flex animate-marquee whitespace-nowrap items-center min-w-full shrink-0">
          {repeatedWords.map((word, idx) => (
            <React.Fragment key={idx}>
              <span className="text-gold font-serif text-xl tracking-wider px-8 uppercase">{word}</span>
              <span className="w-2 h-2 rotate-45 bg-gold shrink-0 opacity-50"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
