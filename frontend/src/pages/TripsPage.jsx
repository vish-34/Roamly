import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Files,
  Compass
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { formatCurrency, formatDate, getBudgetStatus } from '../utils/formatters';

export default function TripsPage({ onOpenCreateTrip }) {
  const { trips, selectTrip, loading } = useTripContext();
  const navigate = useNavigate();

  const handleOpenTrip = (tripId) => {
    selectTrip(tripId);
    navigate(`/trips/${tripId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Editorial Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 pb-6 border-b border-stone-200">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-200/60 mb-3">
            Your Journeys • {trips.length} Saved
          </span>
          <h1 className="font-display font-normal text-4xl sm:text-5xl text-slate-900 tracking-tight">
            Curated <span className="font-serif italic font-normal text-slate-950">Travel Plans</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-light max-w-xl">
            Access day-wise itinerary timelines, Google Map markers, and server-authoritative budget tracking.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-medium text-xs tracking-wider uppercase shadow-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Journey</span>
        </button>
      </div>

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => {
            const utilization = trip.budget?.utilizationPercentage ?? trip.budgetUtilizationPercent ?? 0;
            const actualSpent = trip.budget?.totalActual ?? trip.totalActualExpenses ?? 0;
            const status = getBudgetStatus(utilization);
            const activityCount = trip.activities?.length || 0;
            const docCount = trip.documents?.length || 0;

            return (
              <div 
                key={trip._id}
                onClick={() => handleOpenTrip(trip._id)}
                className="group relative bg-white rounded-3xl p-7 border border-stone-200 hover:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Destination Tag & Budget Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 bg-stone-100 px-3.5 py-1.5 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.destination}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${status.bgColor}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Trip Title */}
                  <h3 className="font-display font-medium text-2xl text-slate-900 group-hover:text-amber-800 transition-colors">
                    {trip.name}
                  </h3>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-light">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="mt-8 pt-5 border-t border-stone-100">
                    <div className="flex items-center justify-between text-xs mb-2 font-medium">
                      <span className="text-slate-500">Allocated Budget</span>
                      <span className="text-slate-900 font-bold">
                        {formatCurrency(trip.totalBudget, trip.currency)}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-light">
                      <span>Spent: <strong className="text-slate-700 font-semibold">{formatCurrency(actualSpent, trip.currency)}</strong></span>
                      <span>{Math.round(utilization)}% used</span>
                    </div>
                  </div>
                </div>

                {/* Footer Stats & Open Action */}
                <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      {activityCount} stops
                    </span>
                    <span className="flex items-center gap-1">
                      <Files className="w-3.5 h-3.5 text-slate-400" />
                      {docCount} docs
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-900 group-hover:translate-x-1 transition-transform">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-4xl p-16 text-center border border-dashed border-stone-300 max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-slate-800 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="font-display font-medium text-2xl text-slate-900">
            No Journeys Planned Yet
          </h3>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto font-light leading-relaxed">
            Begin with a customized travel itinerary or explore popular destinations across the globe.
          </p>
          <button
            onClick={onOpenCreateTrip}
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase shadow-xl transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Trip</span>
          </button>
        </div>
      )}

    </div>
  );
}
