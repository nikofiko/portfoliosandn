import Loader from "@/components/Loader";
import FloatingShapes from "@/components/FloatingShapes";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <FloatingShapes />
      <ScrollProgress />
      <Loader />
      <Navbar />
      <Hero />
      <Ticker />
      <Services />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
