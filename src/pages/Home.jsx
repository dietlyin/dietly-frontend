import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Gallery from '../components/Gallery';
import PlansSlider from '../components/PlansSlider';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <PlansSlider />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
