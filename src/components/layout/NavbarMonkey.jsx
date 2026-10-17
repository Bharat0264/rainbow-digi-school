// Optional final asset: src/assets/navbar/monkey-hanging.png.
const artwork = import.meta.glob('/src/assets/navbar/monkey-hanging.png', { eager: true, query: '?url', import: 'default' });
const source = artwork['/src/assets/navbar/monkey-hanging.png'] || '/images/navigation/monkey-featured.webp';
export default function NavbarMonkey() {
 return <div className="navbar-monkey" aria-hidden="true"><img className="navbar-monkey-body" src={source} width="250" height="450" alt="" /><img className="navbar-monkey-fists" src={source} width="250" height="450" alt="" /></div>;
}
