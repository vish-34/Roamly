import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Layers,
  Star
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';

export default function OnboardingPage({ onOpenCreateTrip }) {
  const navigate = useNavigate();
  const { trips } = useTripContext();

  const tours = [
    {
      id: 'everest',
      title: 'Everest Escape',
      price: '$950',
      priceNum: 950,
      durationDays: 7,
      tag: 'Top rated',
      tagColor: 'bg-white/20 text-white',
      days: '7 days',
      destination: 'Everest Base, Nepal',
      description: 'Trek through majestic mountain passes, ascending iconic trails into the high Himalayas.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'annapurna',
      title: 'Annapurna Trail',
      price: '$750',
      priceNum: 750,
      durationDays: 6,
      tag: 'Popular',
      tagColor: 'bg-blue-600/70 text-white',
      days: '6 days',
      destination: 'Annapurna Circuit, Nepal',
      description: 'Follow scenic mountain trails through peaceful villages, ancient paths and valleys.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pokhara',
      title: 'Pokhara Retreat',
      price: '$540',
      priceNum: 540,
      durationDays: 4,
      tag: 'Relax',
      tagColor: 'bg-emerald-600/70 text-white',
      days: '4 days',
      destination: 'Pokhara & Phewa Lake, Nepal',
      description: 'Slow down beside the peaceful lake, surrounded by green hills, distant peaks and tranquility.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      id: 'kathmandu',
      title: 'Kathmandu Soul',
      price: '$410',
      priceNum: 410,
      durationDays: 3,
      tag: 'Curated',
      tagColor: 'bg-amber-600/70 text-white',
      days: '3 days',
      destination: 'Kathmandu Valley, Nepal',
      description: 'Walk through ancient temples, hidden alleys and colorful bazaars filled with living culture.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'himalayan',
      title: 'Himalayan Escape',
      price: '$890',
      priceNum: 890,
      durationDays: 5,
      tag: 'Trek',
      tagColor: 'bg-purple-600/70 text-white',
      days: '5 days',
      destination: 'Langtang Valley, Nepal',
      description: 'Venture through snow-capped valleys, alpine pine forests and quiet mountain monasteries.',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const toursContainerRef = useRef(null);

  const handlePrevTour = () => {
    if (toursContainerRef.current) {
      toursContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleNextTour = () => {
    if (toursContainerRef.current) {
      toursContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handlePlanTour = (tour) => {
    const today = new Date();
    const duration = tour.durationDays || 5;
    const endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

    onOpenCreateTrip({
      name: tour.title,
      destination: tour.destination,
      totalBudget: tour.priceNum || 1000,
      currency: 'USD',
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      durationDays: duration
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
        
        {/* Full-bleed Majestic Mountain Landscape Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90" 
            alt="Majestic Mountain Range" 
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Crisp, uniform contrast overlay across the whole image without artificial bottom fade */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24 text-center flex-1 flex flex-col items-center justify-center">
          
          <h1 className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[80px] text-white tracking-tight leading-[1.08] drop-shadow-md animate-fade-in-up">
            Roamly <span className="font-serif italic font-normal tracking-normal text-amber-200">Without Limits.</span><br />
            Discover beyond the ordinary.
          </h1>

          <p className="max-w-2xl text-stone-200 text-sm sm:text-base md:text-lg mt-6 font-light leading-relaxed drop-shadow-sm animate-fade-in-up delay-200">
            Journeys shaped around you — your pace, your path, your sense of wonder.
            Every experience feels personal, effortless, and truly yours.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
            <button
              onClick={() => onOpenCreateTrip({
                name: 'Nepal Discovery Journey',
                destination: 'Kathmandu & Pokhara, Nepal',
                totalBudget: 1200,
                currency: 'USD',
                durationDays: 6
              })}
              className="px-8 py-4 rounded-full bg-white hover:bg-stone-100 hover:scale-105 active:scale-95 text-slate-950 font-semibold text-sm sm:text-base transition-all duration-300 shadow-2xl hover:shadow-white/25 cursor-pointer"
            >
              Build my trip now
            </button>

            {trips.length > 0 && (
              <button
                onClick={() => navigate('/trips')}
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white font-medium text-sm backdrop-blur-md transition-all border border-white/20 cursor-pointer flex items-center gap-2"
              >
                <span>View My {trips.length} Trips</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </section>


      {/* 2. DISCOVER OUR MOST POPULAR TOURS CAROUSEL */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Tag & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-200/60 mb-4">
            Your Journey
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight font-normal">
            Discover <span className="font-serif italic font-normal text-slate-950">Our Most</span> Popular Tours
          </h2>
        </div>

        {/* Normal Uniform Cards: Each scales when hovered, normal size when not */}
        <div className="relative flex items-center justify-center py-6 overflow-hidden">
          <div 
            ref={toursContainerRef}
            className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-8 px-4 scroll-smooth snap-x"
          >
            {tours.map((tour) => {
              return (
                <div
                  key={tour.id}
                  onClick={() => handlePlanTour(tour)}
                  className="group relative w-[280px] sm:w-[305px] h-[460px] sm:h-[480px] rounded-3xl overflow-hidden shrink-0 shadow-lg border border-stone-200/50 cursor-pointer snap-center smooth-card scale-100 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl z-10 hover:z-20 ease-out"
                >
                  {/* Card Background Image */}
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    
                    {/* Header info: Title & Price */}
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-amber-200 transition-colors">
                        {tour.title}
                      </h3>
                      <span className="font-display font-bold text-sm text-amber-300">
                        {tour.price}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 font-light mb-4 leading-relaxed">
                      {tour.description}
                    </p>

                    {/* Metadata Tags */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md ${tour.tagColor} transition-transform group-hover:scale-105`}>
                        {tour.tag}
                      </span>
                      <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-stone-200">
                        {tour.days}
                      </span>
                    </div>

                    {/* Action Button: Explore */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanTour(tour);
                      }}
                      className="w-full py-3 rounded-full bg-white hover:bg-stone-100 active:scale-95 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md group-hover:shadow-lg text-center cursor-pointer"
                    >
                      Explore
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons: (←) View More Tours (→) */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button 
            onClick={handlePrevTour}
            className="w-12 h-12 rounded-full border border-stone-300 hover:border-slate-800 hover:bg-stone-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer active:scale-95 shadow-xs"
            aria-label="Previous tour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-semibold text-slate-800 px-4">
            View More Tours
          </span>

          <button 
            onClick={handleNextTour}
            className="w-12 h-12 rounded-full border border-stone-300 hover:border-slate-800 hover:bg-stone-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer active:scale-95 shadow-xs"
            aria-label="Next tour"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </section>


      {/* 3. BENTO GRID / ABOUT ROAMLY SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200/80">
        
        {/* Header split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-4">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-200/60 mb-3">
              About Roamly
            </span>
          </div>

          <div className="lg:col-span-8">
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-slate-900 font-normal leading-snug">
              Roamly is more than a destination — it's a journey. From Himalayan peaks to ancient cities, every experience brings you closer to its nature, culture and people.
            </h3>
          </div>
        </div>

        {/* 3-Column Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Dark Tailor-Made AI Card */}
          <div className="bg-[#0D131F] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl min-h-[360px] smooth-card hover:-translate-y-1 hover:shadow-2xl hover:border-slate-700/50 border border-transparent">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-stone-400">
                  <span className="relative flex h-2 w-2 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>AI Co-pilot</span>
                  <div className="w-8 h-4 rounded-full bg-blue-600 p-0.5 flex items-center justify-end">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <p className="text-sm text-stone-300 font-light leading-relaxed">
                Journeys made personal: travel at your own pace, discover hidden places and experience destinations beyond the usual routes — authentic, personal and unforgettable.
              </p>
            </div>

            <button
              onClick={() => onOpenCreateTrip({
                name: 'Himalayan Tailor-Made Tour',
                destination: 'Himalayas, Nepal',
                totalBudget: 1500,
                currency: 'USD',
                durationDays: 7
              })}
              className="mt-8 w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs tracking-wider uppercase transition-all border border-white/15 cursor-pointer"
            >
              Tailor-Made
            </button>
          </div>

          {/* Card 2: Feature Photo Card ("Made for You") */}
          <div className="relative rounded-3xl overflow-hidden min-h-[360px] shadow-xl group smooth-card hover:-translate-y-1">
            <img 
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80" 
              alt="Hiker with backpack" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            
            {/* Top Pill: "Made for You" */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 animate-float">
              <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md text-slate-900 shadow-md">
                Made for You
              </span>
            </div>
          </div>

          {/* Card 3: Experiences & Ratings Metric Card */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm flex flex-col justify-between min-h-[360px] smooth-card hover:-translate-y-1 hover:shadow-xl">
            <div>
              <span className="font-display font-extrabold text-5xl text-slate-900 tracking-tight">
                50+
              </span>
              <h4 className="font-display font-bold text-sm text-slate-800 mt-1">
                Unique Experiences
              </h4>
              <p className="text-xs text-slate-500 mt-2 font-light leading-relaxed">
                Carefully selected journeys designed to reveal the real beauty, culture and spirit.
              </p>

              {/* Progress indicators matching design */}
              <div className="mt-8 space-y-4">
                
                {/* Adventure */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Adventure</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-600 text-sm">●●●●●●●●●●</span>
                    <span className="font-bold text-slate-900 ml-1">4.9</span>
                  </div>
                </div>

                {/* Culture */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Culture</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-600 text-sm">●●●●●●●●○○</span>
                    <span className="font-bold text-slate-900 ml-1">4.8</span>
                  </div>
                </div>

                {/* Wellness */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Wellness</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-600 text-sm">●●●●●●○○○○</span>
                    <span className="font-bold text-slate-900 ml-1">4.7</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Verified Traveler Scores</span>
              <span className="text-emerald-600">● 100% Guaranteed</span>
            </div>
          </div>

        </div>

      </section>


      {/* 4. KEY METRICS STRIP */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          
          <div>
            <h4 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              8,000+ m
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Highest Himalayan Peaks
            </p>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              100+
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Unique Experiences
            </p>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              50+
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Curated Journeys
            </p>
          </div>

          <div>
            <h4 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              4 Seasons
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Worth Exploring
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
