import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import PlansSlider from '../components/PlansSlider';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Gallery />
      <PlansSlider />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <AboutUs />
      <Footer />
    </>
  );
}
