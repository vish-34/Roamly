import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  DollarSign, 
  PieChart, 
  Files, 
  Plus, 
  ArrowLeft,
  Share2,
  Trash2
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import BudgetBanner from '../components/budget/BudgetBanner';
import Timeline from '../components/itinerary/Timeline';
import ActivityModal from '../components/itinerary/ActivityModal';
import GoogleMapView from '../components/maps/GoogleMapView';
import { formatDate } from '../utils/formatters';

export default function TripWorkspacePage({ onOpenCreateTrip }) {
  const { id } = useParams();
  const { trips, activeTrip, selectTrip, addActivity, updateActivity, deleteActivity, deleteTrip } = useTripContext();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    if (id && (!activeTrip || activeTrip._id !== id)) {
      selectTrip(id);
    }
  }, [id, activeTrip, selectTrip]);

  const currentTrip = activeTrip && activeTrip._id === id ? activeTrip : trips.find(t => t._id === id);

  const handleOpenAdd = () => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEdit = (act) => {
    setEditingActivity(act);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async (payload) => {
    if (!currentTrip?._id) return;
    if (editingActivity) {
      await updateActivity(currentTrip._id, editingActivity._id, payload);
    } else {
      await addActivity(currentTrip._id, payload);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this stop from your itinerary?')) {
      await deleteActivity(currentTrip._id, activityId);
    }
  };

  const handleAddPlaceFromMap = (place) => {
    setEditingActivity({
      name: place.name,
      address: place.address,
      googlePlaceId: place.googlePlaceId,
      location: place.location,
      rating: place.rating,
      date: currentTrip?.startDate,
      time: '11:00',
      estimatedCost: 30,
      actualCost: null,
      notes: 'Added from Google Places'
    });
    setIsActivityModalOpen(true);
  };

  if (!currentTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-bold text-2xl text-slate-800">Trip not found</h2>
        <p className="text-slate-500 mt-2">The trip you are looking for might have been removed.</p>
        <Link to="/trips" className="mt-4 inline-flex items-center gap-2 text-brand-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Trip Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to="/trips" className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Trips
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">{currentTrip.destination}</span>
          </div>
          
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {currentTrip.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
            <span className="inline-flex items-center gap-1.5 text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              {currentTrip.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(currentTrip.startDate)} — {formatDate(currentTrip.endDate)}
            </span>
          </div>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/trips/${currentTrip._id}/budget`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-600" />
            <span>Budget Details</span>
          </Link>

          <Link
            to={`/trips/${currentTrip._id}/documents`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            <Files className="w-3.5 h-3.5 text-blue-600" />
            <span>Documents ({currentTrip.documents?.length || 0})</span>
          </Link>

          <Link
            to={`/trips/${currentTrip._id}/ai`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold transition-all shadow-xs hover:opacity-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Co-pilot</span>
          </Link>
        </div>
      </div>

      {/* Mandatory Vibe Check: Budget vs. Actual Tracker Banner */}
      <BudgetBanner trip={currentTrip} />

      {/* Main Planning Split Layout: Timeline + Google Maps View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Itinerary Timeline (7 cols) */}
        <div className="lg:col-span-7">
          <Timeline
            trip={currentTrip}
            onAddActivity={handleOpenAdd}
            onEditActivity={handleOpenEdit}
            onDeleteActivity={handleDeleteActivity}
            onSelectActivity={setSelectedActivity}
            selectedActivityId={selectedActivity?._id}
          />
        </div>

        {/* Right: Interactive Google Map & Places Discovery (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <GoogleMapView
            trip={currentTrip}
            selectedActivity={selectedActivity}
            onSelectActivity={setSelectedActivity}
            onAddPlaceToItinerary={handleAddPlaceFromMap}
          />
        </div>

      </div>

      {/* Add / Edit Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        activity={editingActivity}
        trip={currentTrip}
      />

    </div>
  );
}
