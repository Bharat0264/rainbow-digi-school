/**
 * Configuration for decorative flower and foliage placements on each wooden navbar board.
 * Positions (x, y) are percentage coordinates relative to the word bounding box:
 * - x: percentage along the word width (0% = left letter edge, 100% = right letter edge)
 * - y: vertical position relative to the word height (0% = top of letters, 100% = baseline)
 * - size: font-relative size in 'em'
 * - rotate: rotation in degrees
 * - delay: sway animation stagger delay
 */
export const FLORA_CONFIG = {
  home: [
    { type: 'flower', symbol: '#flower-home', x: '8%', y: '-12%', size: '0.88em', rotate: '-14deg', delay: '0s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '-4%', y: '35%', size: '0.62em', rotate: '-35deg', delay: '0.8s' },
    { type: 'flower', symbol: '#flower-home', x: '35%', y: '6%', size: '0.68em', rotate: '12deg', delay: '0.4s' },
    { type: 'flower', symbol: '#flower-home', x: '65%', y: '-4%', size: '0.78em', rotate: '-8deg', delay: '1.2s' },
    { type: 'flower', symbol: '#flower-home', x: '94%', y: '14%', size: '0.84em', rotate: '16deg', delay: '0.2s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '104%', y: '55%', size: '0.54em', rotate: '28deg', delay: '1.0s' },
    { type: 'rosette', symbol: '#foliage-rosette', x: '80%', y: '85%', size: '0.52em', rotate: '10deg', delay: '1.5s' },
  ],

  academics: [
    { type: 'flower', symbol: '#flower-academics', x: '5%', y: '-8%', size: '0.84em', rotate: '-14deg', delay: '0s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '-3%', y: '40%', size: '0.56em', rotate: '-30deg', delay: '0.7s' },
    { type: 'flower', symbol: '#flower-academics', x: '38%', y: '-16%', size: '0.8em', rotate: '14deg', delay: '0.3s' },
    { type: 'flower', symbol: '#flower-academics', x: '55%', y: '8%', size: '0.62em', rotate: '-10deg', delay: '1.3s' },
    { type: 'flower', symbol: '#flower-academics', x: '73%', y: '-14%', size: '0.76em', rotate: '15deg', delay: '0.5s' },
    { type: 'flower', symbol: '#flower-academics', x: '96%', y: '16%', size: '0.82em', rotate: '20deg', delay: '0.2s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '103%', y: '58%', size: '0.52em', rotate: '32deg', delay: '1.0s' },
    { type: 'rosette', symbol: '#foliage-rosette', x: '24%', y: '88%', size: '0.48em', rotate: '15deg', delay: '1.6s' },
  ],

  admissions: [
    { type: 'flower', symbol: '#flower-admissions', x: '4%', y: '-8%', size: '0.86em', rotate: '-12deg', delay: '0s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '-3%', y: '35%', size: '0.55em', rotate: '-28deg', delay: '0.6s' },
    { type: 'flower', symbol: '#flower-admissions', x: '16%', y: '-16%', size: '0.8em', rotate: '14deg', delay: '0.3s' },
    { type: 'flower', symbol: '#flower-admissions', x: '44%', y: '-12%', size: '0.74em', rotate: '-8deg', delay: '0.9s' },
    { type: 'flower', symbol: '#flower-admissions', x: '58%', y: '6%', size: '0.62em', rotate: '12deg', delay: '1.4s' },
    { type: 'flower', symbol: '#flower-admissions', x: '72%', y: '-12%', size: '0.72em', rotate: '16deg', delay: '0.4s' },
    { type: 'flower', symbol: '#flower-admissions', x: '96%', y: '16%', size: '0.84em', rotate: '20deg', delay: '0.1s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '103%', y: '55%', size: '0.52em', rotate: '30deg', delay: '1.2s' },
    { type: 'rosette', symbol: '#foliage-rosette', x: '30%', y: '88%', size: '0.48em', rotate: '-10deg', delay: '1.7s' },
  ],

  campus: [
    { type: 'flower', symbol: '#flower-campus', x: '7%', y: '-8%', size: '0.86em', rotate: '-16deg', delay: '0s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '-3%', y: '35%', size: '0.56em', rotate: '-32deg', delay: '0.7s' },
    { type: 'flower', symbol: '#flower-campus', x: '44%', y: '-2%', size: '0.78em', rotate: '12deg', delay: '0.4s' },
    { type: 'flower', symbol: '#flower-campus', x: '74%', y: '6%', size: '0.7em', rotate: '-10deg', delay: '0.9s' },
    { type: 'flower', symbol: '#flower-campus', x: '96%', y: '18%', size: '0.84em', rotate: '18deg', delay: '0.2s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '103%', y: '58%', size: '0.52em', rotate: '28deg', delay: '1.3s' },
    { type: 'rosette', symbol: '#foliage-rosette', x: '58%', y: '86%', size: '0.52em', rotate: '12deg', delay: '1.5s' },
  ],

  'school-life': [
    { type: 'flower', symbol: '#flower-school-life', x: '12%', y: '-6%', size: '0.82em', rotate: '-15deg', delay: '0s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '0%', y: '20%', size: '0.52em', rotate: '-30deg', delay: '0.8s' },
    { type: 'flower', symbol: '#flower-school-life', x: '38%', y: '-16%', size: '0.8em', rotate: '14deg', delay: '0.4s' },
    { type: 'flower', symbol: '#flower-school-life', x: '86%', y: '-16%', size: '0.78em', rotate: '16deg', delay: '0.2s' },
    { type: 'flower', symbol: '#flower-school-life', x: '18%', y: '54%', size: '0.74em', rotate: '-10deg', delay: '0.6s' },
    { type: 'flower', symbol: '#flower-school-life', x: '42%', y: '46%', size: '0.68em', rotate: '12deg', delay: '1.3s' },
    { type: 'flower', symbol: '#flower-school-life', x: '64%', y: '48%', size: '0.72em', rotate: '-8deg', delay: '0.5s' },
    { type: 'flower', symbol: '#flower-school-life', x: '88%', y: '74%', size: '0.8em', rotate: '20deg', delay: '0.1s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '98%', y: '82%', size: '0.5em', rotate: '25deg', delay: '1.1s' },
    { type: 'rosette', symbol: '#foliage-rosette', x: '98%', y: '16%', size: '0.48em', rotate: '10deg', delay: '1.6s' },
  ],

  contact: [
    { type: 'flower', symbol: '#flower-contact', x: '6%', y: '-8%', size: '0.86em', rotate: '-15deg', delay: '0s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '-3%', y: '35%', size: '0.56em', rotate: '-32deg', delay: '0.7s' },
    { type: 'flower', symbol: '#flower-contact', x: '48%', y: '-14%', size: '0.82em', rotate: '14deg', delay: '0.4s' },
    { type: 'flower', symbol: '#flower-contact', x: '34%', y: '8%', size: '0.65em', rotate: '-10deg', delay: '1.2s' },
    { type: 'flower', symbol: '#flower-contact', x: '95%', y: '-10%', size: '0.82em', rotate: '16deg', delay: '0.2s' },
    { type: 'sprig', symbol: '#foliage-sprig', x: '103%', y: '45%', size: '0.52em', rotate: '30deg', delay: '1.0s' },
    { type: 'rosette', symbol: '#foliage-rosette', x: '75%', y: '82%', size: '0.5em', rotate: '12deg', delay: '1.5s' },
  ],
};
