import source from '../../assets/navbar/monkey-hanging.webp';
export default function NavbarMonkey() {
 return <>
   <div className="navbar-monkey-body-layer" aria-hidden="true"><img src={source} width="520" height="473" alt="" /></div>
   <div className="navbar-monkey-fists-layer" aria-hidden="true"><img src={source} width="520" height="473" alt="" /></div>
 </>;
}
