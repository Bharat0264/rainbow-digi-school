import { MotionConfig } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import PaintedFooterV2 from './PaintedFooterV2';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F1E6] font-sans text-espresso flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <MotionConfig reducedMotion="user">{children || <Outlet />}</MotionConfig>
      </main>
      <PaintedFooterV2 />
    </div>
  );
}
