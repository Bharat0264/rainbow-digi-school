import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SiteFooter from "./SiteFooter";
import FloatingDecor from "../ui/FloatingDecor";

export default function Layout({ children }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <FloatingDecor />
      <main id="main-content" tabIndex={-1}>
        {children || <Outlet />}
      </main>
      <SiteFooter />
    </div>
  );
}
