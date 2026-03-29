import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { SearchModal } from "./SearchModal";

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="app-shell app-site-shell flex min-h-screen flex-col">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <main className="app-site-main flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
