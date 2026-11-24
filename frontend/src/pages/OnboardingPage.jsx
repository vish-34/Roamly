import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Ticket, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Coins 
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';

export default function OnboardingPage({ onOpenCreateTrip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { trips } = useTripContext();

  const slides = [
    {
      step: '1 of 3',
      title: 'Find your next adventure',
      description: 'Discover cities, nature and hidden gems. Choose a destination to start your next trip.',
      photo1: {
        title: 'Paris, France',
        img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
        tilt: '-rotate-6 hover:-rotate-3'
      },
      photo2: {
        title: 'Kyoto, Japan',
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        tilt: 'rotate-6 hover:rotate-3'
      },
      sticker1: { icon: Plane, label: 'Explore', color: 'bg-blue-600 text-white' },
      sticker2: { icon: Ticket, label: 'Pass', color: 'bg-amber-700 text-white' },
      quickDestinations: ['Paris', 'Kyoto', 'Rome', 'New York', 'Bali']
    },
    {
      step: '2 of 3',
      title: 'Master your travel budget',
      description: 'Real-time estimated vs actual expense tracking. Never get surprised by unexpected costs.',
      photo1: {
        title: 'Santorini, Greece',
        img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
        tilt: '-rotate-3 hover:rotate-0'
      },
      photo2: {
        title: 'Swiss Alps',
        img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
        tilt: 'rotate-4 hover:rotate-1'
      },
      sticker1: { icon: Coins, label: 'Track', color: 'bg-emerald-600 text-white' },
      sticker2: { icon: ShieldCheck, label: 'Verified', color: 'bg-purple-600 text-white' },
      quickDestinations: ['Zurich', 'Reykjavik', 'London', 'Barcelona', 'Vancouver']
    },
    {
      step: '3 of 3',
      title: 'AI itineraries & documents',
      description: 'Generate day-wise smart itineraries with Groq AI and keep your tickets safely stored.',
      photo1: {
        title: 'Dubai, UAE',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
        tilt: '-rotate-4 hover:rotate-0'
      },
      photo2: {
        title: 'Amalfi Coast, Italy',
        img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
        tilt: 'rotate-5 hover:rotate-2'
      },
      sticker1: { icon: Sparkles, label: 'AI Ready', color: 'bg-indigo-600 text-white' },
      sticker2: { icon: Compass, label: 'Guides', color: 'bg-brand-500 text-white' },
      quickDestinations: ['Amalfi', 'Dubai', 'Tokyo', 'Singapore', 'Cape Town']
    }
  ];

  const slide = slides[currentStep];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (trips.length > 0) {
        navigate('/trips');
      } else {
        onOpenCreateTrip();
      }
    }
  };

  const handleSkip = () => {
    if (trips.length > 0) {
      navigate('/trips');
    } else {
      onOpenCreateTrip();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6">
      {/* Inspired Mobile/App Card Canvas */}
      <div className="relative w-full max-w-md bg-white rounded-4xl shadow-2xl border border-stone-200/90 overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[640px]">
        
        {/* Top Header: Step & Skip */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="bg-stone-100 px-3 py-1 rounded-full text-slate-700 tracking-wide">
            {slide.step}
          </span>
          <button 
            onClick={handleSkip}
            className="hover:text-brand-600 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Visual Scene Area with Stickers & Polaroid Photos */}
        <div className="relative h-72 w-full my-auto flex items-center justify-center">
          
          {/* Dashed orange trail in background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 350 250">
            <path 
              d="M 30,190 Q 140,80 180,140 T 320,60" 
              fill="none" 
              stroke="#fb923c" 
              strokeWidth="2.5" 
              strokeDasharray="6,6"
              strokeLinecap="round"
            />
          </svg>

          {/* Left Polaroid Photo Card */}
          <div className={`absolute left-2 top-4 w-36 sm:w-40 bg-white p-2 rounded-2xl shadow-xl border border-stone-100 transition-all duration-300 ${slide.photo1.tilt}`}>
            <img 
              src={slide.photo1.img} 
              alt={slide.photo1.title} 
              className="w-full h-32 sm:h-36 object-cover rounded-xl"
            />
            <p className="text-[11px] font-bold text-slate-800 text-center mt-2 tracking-tight">
              {slide.photo1.title}
            </p>
          </div>

          {/* Airplane / Theme Sticker with peel effect */}
          <div className="absolute left-20 top-0 transform -translate-y-2 z-10">
            <div className={`w-12 h-12 rounded-full ${slide.sticker1.color} flex items-center justify-center shadow-lg border-2 border-white transform -rotate-12 transition-transform hover:scale-110 cursor-pointer`}>
              <slide.sticker1.icon className="w-6 h-6" />
            </div>
          </div>

          {/* Right Polaroid Photo Card */}
          <div className={`absolute right-2 bottom-4 w-36 sm:w-40 bg-white p-2 rounded-2xl shadow-xl border border-stone-100 transition-all duration-300 ${slide.photo2.tilt}`}>
            <img 
              src={slide.photo2.img} 
              alt={slide.photo2.title} 
              className="w-full h-32 sm:h-36 object-cover rounded-xl"
            />
            <p className="text-[11px] font-bold text-slate-800 text-center mt-2 tracking-tight">
              {slide.photo2.title}
            </p>
          </div>

          {/* Ticket / Secondary Sticker */}
          <div className="absolute right-24 top-6 z-10">
            <div className={`w-11 h-11 rounded-full ${slide.sticker2.color} flex items-center justify-center shadow-lg border-2 border-white transform rotate-12 transition-transform hover:scale-110 cursor-pointer`}>
              <slide.sticker2.icon className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Content Section: Title & Description */}
        <div className="text-center mt-4 mb-3">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
            {slide.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 px-3 leading-relaxed">
            {slide.description}
          </p>

          {/* Quick Destination Pill Tags */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {slide.quickDestinations.map((dest) => (
              <span 
                key={dest} 
                className="inline-flex items-center text-[10px] font-semibold bg-stone-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                onClick={onOpenCreateTrip}
              >
                <MapPin className="w-2.5 h-2.5 mr-1 text-brand-500" />
                {dest}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Pagination & Action Button */}
        <div className="mt-4 space-y-4">
          
          {/* Progress Indicators (Pill bar + Dots) */}
          <div className="flex items-center justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? 'w-6 bg-brand-500' 
                    : 'w-2 bg-stone-200 hover:bg-stone-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold text-base shadow-pill flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{currentStep === slides.length - 1 ? 'Start Planning' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
