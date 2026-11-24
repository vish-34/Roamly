import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  PieChart, 
  Files, 
  Sparkles, 
  Plus, 
  ChevronDown 
} from 'lucide-react';
import { useTripContext } from '../../context/TripContext';

export default function Navbar({ onOpenCreateTrip }) {
  const { trips, activeTrip, selectTrip } = useTripContext();
  const navigate = useNavigate();

  const handleTripChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      selectTrip(selectedId);
      navigate(`/trips/${selectedId}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Inspiration Badge */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-pill transition-transform group-hover:scale-105">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Roamly
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-brand-600 -mt-1">
                  Intelligent Planner
                </span>
              </div>
            </Link>

            {/* Active Trip Quick Switcher */}
            {trips.length > 0 && (
              <div className="hidden md:flex items-center">
                <div className="relative inline-flex items-center bg-stone-100 hover:bg-stone-200/80 rounded-full px-3 py-1.5 transition-colors text-xs font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 mr-1.5" />
                  <select 
                    value={activeTrip?._id || ''} 
                    onChange={handleTripChange}
                    className="bg-transparent text-xs font-semibold text-slate-800 pr-5 focus:outline-none cursor-pointer appearance-none"
                  >
                    {trips.map(t => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.destination})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links for Different Pages */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <NavLink 
              to="/trips" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-stone-100 text-brand-600 font-semibold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                }`
              }
            >
              My Trips
            </NavLink>

            {activeTrip && (
              <>
                <NavLink 
                  to={`/trips/${activeTrip._id}`} 
                  end
                  className={({ isActive }) => 
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-stone-100 text-brand-600 font-semibold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                    }`
                  }
                >
                  <Calendar className="w-4 h-4 text-brand-500" />
                  Itinerary & Map
                </NavLink>

                <NavLink 
                  to={`/trips/${activeTrip._id}/budget`} 
                  className={({ isActive }) => 
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-stone-100 text-brand-600 font-semibold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                    }`
                  }
                >
                  <PieChart className="w-4 h-4 text-emerald-500" />
                  Budget Tracker
                </NavLink>

                <NavLink 
                  to={`/trips/${activeTrip._id}/documents`} 
                  className={({ isActive }) => 
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-stone-100 text-brand-600 font-semibold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                    }`
                  }
                >
                  <Files className="w-4 h-4 text-blue-500" />
                  Documents
                </NavLink>

                <NavLink 
                  to={`/trips/${activeTrip._id}/ai`} 
                  className={({ isActive }) => 
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-stone-100 text-purple-600 font-semibold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                    }`
                  }
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  AI Co-pilot
                </NavLink>
              </>
            )}
          </nav>

          {/* Action Button: Create New Trip */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateTrip}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-medium text-sm shadow-pill transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Trip</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
