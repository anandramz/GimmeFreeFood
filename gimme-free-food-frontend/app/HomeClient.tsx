'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomeClient() {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Prevent default scroll behavior
      e.preventDefault();

      // If already scrolling, ignore
      if (isScrollingRef.current) {
        return;
      }

      const delta = e.deltaY;
      const threshold = 50; // Minimum scroll amount to trigger
      
      // Only respond to significant scroll events
      if (Math.abs(delta) < threshold) {
        return;
      }

      // Scrolling down
      if (delta > 0 && activeSection < 3) {
        isScrollingRef.current = true;
        setActiveSection(activeSection + 1);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
      // Scrolling up
      else if (delta < 0 && activeSection > 0) {
        isScrollingRef.current = true;
        setActiveSection(activeSection - 1);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, [activeSection]);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-[#7BAFD4] relative">
      <style jsx global>{`
        .section-container {
          transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
        }
      `}</style>

      {/* Fixed Header with Auth Links */}
      <div className="fixed top-0 right-0 z-50 p-6 flex gap-4">
        <a 
          href="/auth/login?returnTo=/preferences" 
          className="bg-white/20 text-white px-6 py-2 rounded-lg font-semibold border border-white hover:bg-white/30 transition-all"
        >
          Log In
        </a>
        <a 
          href="/auth/login?screen_hint=signup&returnTo=/preferences" 
          className="bg-white text-[#7BAFD4] px-6 py-2 rounded-lg font-semibold hover:bg-white/90 transition-all"
        >
          Sign Up
        </a>
      </div>

      {/* Sections Container */}
      <div 
        className="section-container absolute w-full"
        style={{ 
          transform: `translateY(-${activeSection * 100}vh)`,
          top: 0
        }}
      >
        {/* Hero Section - Full Screen */}
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight text-white text-center px-4">
            Gimme Free Food
          </h1>
        </section>

        {/* Description Section */}
        <section className="h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <p className="text-3xl md:text-5xl text-white font-medium leading-relaxed">
              Never miss a free meal at UNC Chapel Hill
            </p>
            <p className="text-xl md:text-2xl text-white/90 mt-8 leading-relaxed">
              Get daily notifications about campus events with free food, merch, and more. 
              Join thousands of Tar Heels who are eating well!
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl w-full">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Free Food Alerts</h3>
                <p className="text-white/90 text-lg">Get notified about events with free pizza, snacks, and meals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Free Merch</h3>
                <p className="text-white/90 text-lg">Score free t-shirts, stickers, and swag from campus events</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Course Credit</h3>
                <p className="text-white/90 text-lg">Find events that offer academic credit and vouchers</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="h-screen flex items-center justify-center px-4 pb-20">
          <div className="max-w-3xl w-full bg-white/10 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-white/20 text-center">
            <h2 className="text-4xl font-bold text-white mb-8">
              Ready to start saving money?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="/auth/login?screen_hint=signup&returnTo=/preferences" 
                className="w-full sm:w-auto bg-white text-[#7BAFD4] px-10 py-5 rounded-xl font-semibold text-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up with UNC Email
              </a>
              <a 
                href="/auth/login?returnTo=/preferences" 
                className="w-full sm:w-auto bg-white/20 text-white px-10 py-5 rounded-xl font-semibold text-xl border-2 border-white hover:bg-white/30 transition-all shadow-md hover:shadow-lg"
              >
                Log In
              </a>
            </div>
            <p className="text-white/80 mt-6 text-lg">
              Secure authentication with your UNC email
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
