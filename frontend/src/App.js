import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Book from "@/pages/Book";
import Shop from "@/pages/Shop";
import CustomOrders from "@/pages/CustomOrders";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="App min-h-screen bg-cream">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/book" element={<Book />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/custom-orders" element={<CustomOrders />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
