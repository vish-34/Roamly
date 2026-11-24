import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Files
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              Trip Workspace
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">{trips.length} Saved Trips</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 mt-1">
            Your Travel Itineraries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a trip to access day-wise timelines, map markers, and live budget tracking.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-sm shadow-pill transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const utilization = trip.budgetUtilizationPercent || 0;
            const status = getBudgetStatus(utilization);
            const activityCount = trip.activities?.length || 0;
            const docCount = trip.documents?.length || 0;

            return (
              <div 
                key={trip._id}
                onClick={() => handleOpenTrip(trip._id)}
                className="group relative bg-white rounded-3xl p-6 border border-stone-200/90 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Destination Tag & Budget Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-stone-100 px-3 py-1 rounded-full group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {trip.destination}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.bgColor}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Trip Title */}
                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-brand-600 transition-colors">
                    {trip.name}
                  </h3>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-slate-500">Total Budget</span>
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

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                      <span>Spent: {formatCurrency(trip.totalActualExpenses || 0, trip.currency)}</span>
                      <span>{Math.round(utilization)}% used</span>
                    </div>
                  </div>
                </div>

                {/* Footer Stats & Open Action */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-slate-500">
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

                  <span className="inline-flex items-center gap-1 font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-4xl p-12 text-center border border-dashed border-stone-300 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900">
            No Trips Planned Yet
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Create your first trip or use our AI generator to build a day-by-day itinerary with budget tracking.
          </p>
          <button
            onClick={onOpenCreateTrip}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-pill transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Trip</span>
          </button>
        </div>
      )}

    </div>
  );
}
