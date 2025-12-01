import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Workflow from '../components/sections/Workflow';
import CTA from '../components/sections/CTA';
import About from '@/components/sections/About';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      <Hero />
      <About />
      <Features />
      <Workflow />
      <CTA />
      <Footer />
    </div>
  );
}