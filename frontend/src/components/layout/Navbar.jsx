import React, { useState, useEffect } from 'react';
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
  LogIn
} from 'lucide-react';
import { useTripContext } from '../../context/TripContext';

export default function Navbar({ onOpenCreateTrip }) {
  const { trips, activeTrip, selectTrip } = useTripContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTripChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      selectTrip(selectedId);
      navigate(`/trips/${selectedId}`);
    }
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
            
            {/* Active trip quick switcher */}
            {trips.length > 0 && !isDarkNav && (
              <div className="hidden lg:flex items-center">
                <div className="relative inline-flex items-center bg-stone-100 hover:bg-stone-200 rounded-full px-3.5 py-1.5 transition-colors text-xs font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-slate-900 mr-1.5" />
                  <select 
                    value={activeTrip?._id || ''} 
                    onChange={handleTripChange}
                    className="bg-transparent text-xs font-semibold text-slate-800 pr-5 focus:outline-none cursor-pointer appearance-none"
                  >
                    {trips.map(t => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
                </div>
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
