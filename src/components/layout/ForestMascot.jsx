import Logo from '../ui/Logo';

export function TwistedRope({x,top,bottom}) {
  const length=Math.max(12,bottom-top);
  return <g aria-hidden="true" transform={`translate(${x} ${top})`}>
    <path d={`M0 0V${length}`} stroke="#82502b" strokeWidth="7" strokeLinecap="round"/>
    <path d={`M-1 0V${length}`} stroke="#e5b476" strokeWidth="5" strokeLinecap="round"/>
    {Array.from({length:Math.ceil(length/5)},(_,i)=><path key={i} d={`M-2.5 ${i*5}q5 1 5 4`} fill="none" stroke="#a86d37" strokeWidth="1.6"/>)}
    <path d={`M-6 ${length-4}q12-9 12 1q-5 6-12-1M-4 ${length}l-4 6M3 ${length}l5 5`} fill="none" stroke="#c78b4a" strokeWidth="4" strokeLinecap="round"/>
  </g>;
}

export function ForestMascot({width,top,onActivate}) {
  return <button type="button" className="forest-mascot" style={{width,top}} onClick={onActivate} aria-label="Send the squirrel into its treehouse">
    <img className="forest-monkey-image" src="/images/navigation/monkey-sign.webp" width="720" height="1341" alt="" draggable="false" fetchPriority="high"/>
    <span className="forest-logo-inset"><Logo/></span>
  </button>;
}

export function Treehouse({width,branchY,entranceRef}) {
  // Door center and threshold are measured within this asset, not browser pixels.
  const top=branchY-width*.755;
  return <div className="forest-treehouse" style={{width,height:width,top,'--house-width':`${width}px`}} aria-hidden="true">
    <img src="/images/navigation/treehouse.webp" width="800" height="800" alt="" draggable="false"/>
    <span ref={entranceRef} data-nav-id="treehouse" className="forest-door-target"/>
    <img className="forest-door-frame" src="/images/navigation/treehouse.webp" width="800" height="800" alt="" draggable="false"/>
  </div>;
}
