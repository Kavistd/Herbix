import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from '../common/ScrollToTopButton';

/**
 * Root Layout wrapper for Herbix e-commerce pages
 */
export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-leaf-200 selection:text-botanical-950 relative overflow-x-hidden">
      {/* Top promotional bar */}
      <AnnouncementBar />

      {/* Sticky brand header */}
      <Header />

      {/* Main page view content — subtle fade/rise on every route change */}
      <main key={pathname} className="flex-1 page-transition">
        <Outlet />
      </main>

      {/* Global brand footer */}
      <Footer />

      {/* Floating scroll-to-top affordance */}
      <ScrollToTopButton />
    </div>
  );
}

