import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Globe, 
  Sparkles,
  Loader2,
  ArrowRight,
  Compass,
  ChevronDown
} from 'lucide-react';
import Modal from '../common/Modal';
import { useTripContext } from '../../context/TripContext';

export default function CreateTripModal({ isOpen, onClose, initialData = null }) {
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

  // Update formData whenever initialData or isOpen changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        destination: initialData.destination || '',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        endDate: initialData.endDate || new Date(Date.now() + (initialData.durationDays || 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalBudget: initialData.totalBudget !== undefined ? initialData.totalBudget : 1500,
        currency: initialData.currency || 'USD'
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        destination: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalBudget: 1500,
        currency: 'USD'
      });
    }
  }, [initialData, isOpen]);

  // Quick suggestions matching web tours (compact single line)
  const suggestedDestinations = [
    { label: 'Pokhara', dest: 'Pokhara, Nepal', budget: 540 },
    { label: 'Everest', dest: 'Everest Base, Nepal', budget: 950 },
    { label: 'Annapurna', dest: 'Annapurna, Nepal', budget: 750 },
    { label: 'Kyoto', dest: 'Kyoto, Japan', budget: 1200 },
  ];

  const handleSelectSuggestion = (item) => {
    setFormData(prev => ({
      ...prev,
      name: `${item.label} Adventure`,
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
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
        New Journey
      </span>
      <h3 className="font-display font-medium text-lg text-slate-900 tracking-tight">
        Plan a New <span className="font-serif italic font-normal text-slate-950">Journey</span>
      </h3>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {/* Quick Inspirations in a single compact row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Inspirations:
          </span>
          {suggestedDestinations.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => handleSelectSuggestion(item)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-stone-50 hover:bg-slate-900 hover:text-white px-2.5 py-1 rounded-full border border-stone-200 shrink-0 transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-2.5 h-2.5 text-amber-600" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Trip Name */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Trip Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Autumn in Pokhara & Annapurna"
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 transition-all"
            required
          />
        </div>

        {/* Primary Destination */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Primary Destination
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-700 absolute left-3.5 top-3" />
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Pokhara, Nepal"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 transition-all"
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs font-medium text-slate-900 transition-all cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs font-medium text-slate-900 transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Total Budget & Currency */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Total Budget
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 absolute left-3.5 top-2.5" />
              <input
                type="number"
                name="totalBudget"
                min="0"
                step="any"
                value={formData.totalBudget}
                onChange={handleChange}
                placeholder="1500"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs sm:text-sm font-bold text-slate-900 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Currency
            </label>
            <div className="relative">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs font-bold text-slate-900 transition-all cursor-pointer appearance-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-medium text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Building...</span>
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center">
                  <ArrowRight className="w-2 h-2" />
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
