import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';

export default function Timeline({ 
  trip, 
  onAddActivity, 
  onEditActivity, 
  onDeleteActivity, 
  onSelectActivity,
  selectedActivityId 
}) {
  const activities = trip?.activities || [];

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const d = activity.date || 'Unscheduled';
    if (!acc[d]) acc[d] = [];
    acc[d].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedActivities).sort();

  return (
    <div className="space-y-6">
      
      {/* Timeline Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900">
            Itinerary Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Chronological day-wise schedule with automatic server cost calculations
          </p>
        </div>

        <button
          onClick={onAddActivity}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-pill transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Day Groups */}
      {sortedDates.length > 0 ? (
        <div className="space-y-8">
          {sortedDates.map((dateKey, dayIdx) => (
            <div key={dateKey} className="relative">
              
              {/* Day Header Badge */}
              <div className="sticky top-20 z-10 bg-[#FAF9F5]/90 backdrop-blur-xs py-1.5 mb-3 flex items-center gap-2.5">
                <span className="font-display font-extrabold text-sm bg-brand-500 text-white px-3 py-1 rounded-full shadow-xs">
                  Day {dayIdx + 1}
                </span>
                <span className="font-semibold text-sm text-slate-800">
                  {formatDate(dateKey)}
                </span>
                <span className="text-xs text-slate-400">
                  ({groupedActivities[dateKey].length} {groupedActivities[dateKey].length === 1 ? 'activity' : 'activities'})
                </span>
              </div>

              {/* Vertical Connector Line */}
              <div className="relative pl-6 space-y-3.5 border-l-2 border-stone-200 ml-4">
                {groupedActivities[dateKey].map((activity) => {
                  const isSelected = selectedActivityId === activity._id;
                  const hasActual = activity.actualCost !== null && activity.actualCost !== undefined;
                  const isFree = activity.actualCost === 0 || activity.estimatedCost === 0;

                  return (
                    <div 
                      key={activity._id}
                      onClick={() => onSelectActivity && onSelectActivity(activity)}
                      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-brand-500 shadow-md ring-2 ring-brand-100' 
                          : 'border-stone-200 hover:border-brand-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Timeline dot marker */}
                      <div className={`absolute -left-[31px] top-5 w-3.5 h-3.5 rounded-full border-2 border-white transition-all ${
                        isSelected ? 'bg-brand-500 ring-4 ring-brand-100 scale-125' : 'bg-slate-400 group-hover:bg-brand-500'
                      }`} />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        
                        {/* Left: Time & Activity Title */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" />
                              {formatTime(activity.time)}
                            </span>
                            {activity.rating && (
                              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                ★ {activity.rating}
                              </span>
                            )}
                          </div>

                          <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                            {activity.name}
                          </h4>

                          {activity.address && (
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="line-clamp-1">{activity.address}</span>
                            </p>
                          )}

                          {activity.notes && (
                            <p className="text-xs text-slate-600 bg-stone-50 p-2 rounded-xl mt-2 italic border border-stone-100">
                              "{activity.notes}"
                            </p>
                          )}
                        </div>

                        {/* Right: Costs & Actions */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                          
                          {/* Financials pill */}
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-900">
                              Est: {formatCurrency(activity.estimatedCost, trip.currency)}
                            </div>
                            <div className="text-[11px] font-semibold mt-0.5">
                              {hasActual ? (
                                <span className="inline-flex items-center gap-0.5 text-emerald-600">
                                  <CheckCircle className="w-3 h-3" />
                                  Act: {formatCurrency(activity.actualCost, trip.currency)}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">
                                  Act: Pending
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Edit/Delete buttons */}
                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditActivity(activity);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                              title="Edit activity"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteActivity(activity._id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-stone-200">
          <p className="text-sm font-semibold text-slate-700">No stops scheduled yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Search for places or click "Add Stop" to start planning your days.
          </p>
          <button
            onClick={onAddActivity}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-pill transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Activity</span>
          </button>
        </div>
      )}

    </div>
  );
}
