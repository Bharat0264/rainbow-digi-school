import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-ivory font-sans text-espresso flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
