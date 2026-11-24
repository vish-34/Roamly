import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Globe, 
  Sparkles,
  Loader2,
  ArrowRight,
  Compass
} from 'lucide-react';
import Modal from '../common/Modal';
import { useTripContext } from '../../context/TripContext';

export default function CreateTripModal({ isOpen, onClose }) {
  const { createTrip } = useTripContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalBudget: 1500,
    currency: 'USD'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quick suggestions matching web tours
  const suggestedDestinations = [
    { label: 'Pokhara Retreat', dest: 'Pokhara, Nepal', budget: 540 },
    { label: 'Everest Escape', dest: 'Everest Base, Nepal', budget: 950 },
    { label: 'Annapurna Trail', dest: 'Annapurna, Nepal', budget: 750 },
    { label: 'Kathmandu Soul', dest: 'Kathmandu, Nepal', budget: 410 },
  ];

  const handleSelectSuggestion = (item) => {
    setFormData(prev => ({
      ...prev,
      name: item.label,
      destination: item.dest,
      totalBudget: item.budget
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalBudget' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.destination.trim()) {
      setError('Please provide a trip name and destination.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const created = await createTrip(formData);
      onClose();
      navigate(`/trips/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = (
    <div>
      <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200/60 mb-1.5">
        New Journey • Roamly
      </span>
      <h3 className="font-display font-normal text-2xl text-slate-900 tracking-tight">
        Plan a New <span className="font-serif italic font-normal text-slate-950">Journey</span>
      </h3>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {/* Quick Inspiration Chips */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Quick Inspirations
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedDestinations.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => handleSelectSuggestion(item)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-stone-50 hover:bg-slate-900 hover:text-white px-3 py-1.5 rounded-full border border-stone-200 hover:border-slate-900 transition-all cursor-pointer active:scale-95"
              >
                <Compass className="w-3 h-3 text-amber-600" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trip Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Trip Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Autumn in Pokhara & Annapurna"
            className="w-full px-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-semibold text-slate-900 transition-all"
            required
          />
        </div>

        {/* Primary Destination */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Primary Destination
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-700 absolute left-4 top-3.5" />
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Pokhara, Nepal"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-medium text-slate-900 transition-all"
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-medium text-slate-900 transition-all cursor-pointer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-medium text-slate-900 transition-all cursor-pointer"
                required
              />
            </div>
          </div>
        </div>

        {/* Total Budget & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Total Budget
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-emerald-600 absolute left-4 top-3.5" />
              <input
                type="number"
                name="totalBudget"
                min="0"
                step="any"
                value={formData.totalBudget}
                onChange={handleChange}
                placeholder="1500"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-bold text-slate-900 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-semibold text-slate-800 transition-all cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 flex items-center justify-end gap-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-medium text-xs tracking-wider uppercase shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Building Journey...</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
                <span>Create Journey</span>
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
