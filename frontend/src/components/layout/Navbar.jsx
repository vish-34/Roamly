import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  PieChart, 
  Files, 
  Sparkles, 
  Plus, 
  ChevronDown,
  ArrowRight,
  Check,
  PlusCircle
} from 'lucide-react';
import { useTripContext } from '../../context/TripContext';

export default function Navbar({ onOpenCreateTrip }) {
  const { trips, activeTrip, selectTrip } = useTripContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [isTripMenuOpen, setIsTripMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTripMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTrip = (tripId) => {
    selectTrip(tripId);
    setIsTripMenuOpen(false);
    navigate(`/trips/${tripId}`);
  };

  // Always keep navbar crisp and prominent with high-contrast frosted glass
  const navBackground = isHome && !scrolled
    ? 'bg-slate-950/85 backdrop-blur-xl text-white border-b border-white/15 shadow-xl'
    : 'bg-white/95 backdrop-blur-xl text-slate-900 border-b border-stone-200/90 shadow-sm';

  const isDarkNav = isHome && !scrolled;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className={`font-display font-medium text-2xl tracking-tight transition-colors ${
              isDarkNav ? 'text-white' : 'text-slate-900 group-hover:text-amber-600'
            }`}>
              Roamly
            </span>
            <span className={`w-2 h-2 rounded-full ${isDarkNav ? 'bg-amber-400' : 'bg-slate-900'}`} />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `transition-colors ${
                  isDarkNav 
                    ? (isActive ? 'text-white font-bold' : 'text-stone-300 hover:text-white')
                    : (isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900')
                }`
              }
            >
              Home
            </NavLink>

            <NavLink 
              to="/trips" 
              className={({ isActive }) => 
                `flex items-center gap-1.5 transition-colors ${
                  isDarkNav 
                    ? (isActive ? 'text-white font-bold' : 'text-stone-300 hover:text-white')
                    : (isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900')
                }`
              }
            >
              <span>Trips</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                New
              </span>
            </NavLink>

            {activeTrip ? (
              <>
                <NavLink 
                  to={`/trips/${activeTrip._id}`} 
                  end
                  className={({ isActive }) => 
                    `transition-colors ${
                      isDarkNav 
                        ? (isActive ? 'text-white font-bold' : 'text-stone-300 hover:text-white')
                        : (isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900')
                    }`
                  }
                >
                  Workspace
                </NavLink>

                <NavLink 
                  to={`/trips/${activeTrip._id}/budget`} 
                  className={({ isActive }) => 
                    `transition-colors ${
                      isDarkNav 
                        ? (isActive ? 'text-white font-bold' : 'text-stone-300 hover:text-white')
                        : (isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900')
                    }`
                  }
                >
                  Budget
                </NavLink>

                <NavLink 
                  to={`/trips/${activeTrip._id}/documents`} 
                  className={({ isActive }) => 
                    `transition-colors ${
                      isDarkNav 
                        ? (isActive ? 'text-white font-bold' : 'text-stone-300 hover:text-white')
                        : (isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900')
                    }`
                  }
                >
                  Documents
                </NavLink>

                <NavLink 
                  to={`/trips/${activeTrip._id}/ai`} 
                  className={({ isActive }) => 
                    `flex items-center gap-1.5 transition-colors ${
                      isDarkNav 
                        ? (isActive ? 'text-purple-300 font-bold' : 'text-purple-200 hover:text-white')
                        : (isActive ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700')
                    }`
                  }
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Co-pilot</span>
                </NavLink>
              </>
            ) : (
              <>
                <span 
                  className={`cursor-pointer transition-colors ${
                    isDarkNav ? 'text-stone-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`} 
                  onClick={onOpenCreateTrip}
                >
                  Destinations
                </span>
                <span 
                  className={`cursor-pointer transition-colors ${
                    isDarkNav ? 'text-stone-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`} 
                  onClick={onOpenCreateTrip}
                >
                  Experiences
                </span>
              </>
            )}
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            
            {/* Custom Interactive Trip Switcher Dropdown */}
            {trips.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTripMenuOpen(prev => !prev)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all text-xs font-semibold cursor-pointer ${
                    isDarkNav 
                      ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20' 
                      : 'bg-stone-100 hover:bg-stone-200/80 text-slate-900 border border-stone-200/80'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isDarkNav ? 'text-amber-400' : 'text-slate-900'}`} />
                  <span className="max-w-[130px] truncate">
                    {activeTrip ? activeTrip.name : 'Select Journey'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isTripMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Floating Menu */}
                {isTripMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Your Journeys ({trips.length})
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        Saved
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto py-1 divide-y divide-stone-50">
                      {trips.map((t) => {
                        const isSelected = activeTrip?._id === t._id;
                        return (
                          <div
                            key={t._id}
                            onClick={() => handleSelectTrip(t._id)}
                            className={`px-4 py-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                              isSelected ? 'bg-stone-100 font-bold text-slate-950' : 'hover:bg-stone-50 text-slate-700'
                            }`}
                          >
                            <div className="truncate">
                              <p className="truncate font-semibold">{t.name}</p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-normal mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" /> {t.destination}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-slate-900 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-2 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsTripMenuOpen(false);
                          onOpenCreateTrip();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Plan New Journey</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onOpenCreateTrip}
              className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer ${
                isDarkNav 
                  ? 'bg-white hover:bg-stone-100 text-slate-950 hover:shadow-white/20' 
                  : 'bg-slate-950 hover:bg-slate-800 text-white'
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
              <span>Build Trip</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
