import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Check, 
  Sparkles,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Modal from '../common/Modal';

export default function ActivityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  activity = null, 
  trip 
}) {
  const isEditing = Boolean(activity);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    googlePlaceId: '',
    location: { lat: 35.6762, lng: 139.6503 },
    rating: null,
    date: trip?.startDate || new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: '',
    estimatedCost: 25,
    actualCost: null,
    hasActualExpense: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || '',
        address: activity.address || '',
        googlePlaceId: activity.googlePlaceId || '',
        location: activity.location || { lat: 35.6762, lng: 139.6503 },
        rating: activity.rating || null,
        date: activity.date || trip?.startDate || '',
        time: activity.time || '10:00',
        notes: activity.notes || '',
        estimatedCost: activity.estimatedCost !== undefined ? activity.estimatedCost : 0,
        actualCost: activity.actualCost !== null && activity.actualCost !== undefined ? activity.actualCost : null,
        hasActualExpense: activity.actualCost !== null && activity.actualCost !== undefined
      });
    } else {
      setFormData({
        name: '',
        address: '',
        googlePlaceId: '',
        location: { lat: 35.6762, lng: 139.6503 },
        rating: null,
        date: trip?.startDate || new Date().toISOString().split('T')[0],
        time: '10:00',
        notes: '',
        estimatedCost: 20,
        actualCost: null,
        hasActualExpense: false
      });
    }
  }, [activity, trip, isOpen]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'hasActualExpense') {
      setFormData(prev => ({
        ...prev,
        hasActualExpense: checked,
        actualCost: checked ? (prev.actualCost !== null ? prev.actualCost : prev.estimatedCost) : null
      }));
    } else if (name === 'estimatedCost') {
      setFormData(prev => ({
        ...prev,
        estimatedCost: parseFloat(value) || 0
      }));
    } else if (name === 'actualCost') {
      setFormData(prev => ({
        ...prev,
        actualCost: value === '' ? null : parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Activity name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        googlePlaceId: formData.googlePlaceId || undefined,
        location: formData.location,
        rating: formData.rating,
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim(),
        estimatedCost: formData.estimatedCost,
        actualCost: formData.hasActualExpense ? (formData.actualCost !== null ? formData.actualCost : 0) : null
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = (
    <div>
      <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200/60 mb-1.5">
        {isEditing ? 'Modify Activity' : 'New Stop'} • Itinerary
      </span>
      <h3 className="font-display font-normal text-2xl text-slate-900 tracking-tight">
        {isEditing ? 'Edit Stop &' : 'Add Stop to'} <span className="font-serif italic font-normal text-slate-950">{isEditing ? 'Expenses' : 'Itinerary'}</span>
      </h3>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={modalTitle}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {/* Activity Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Activity / Destination Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sunrise Viewpoint & Lake Cruise"
            className="w-full px-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-semibold text-slate-900 transition-all"
            required
          />
        </div>

        {/* Address / Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Location Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-700 absolute left-4 top-3.5" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. North Lakeside Promenade, Pokhara"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm text-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Scheduled Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-medium text-slate-900 transition-all cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Scheduled Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm font-medium text-slate-900 transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Mandatory Vibe Check: Estimated vs Actual Cost */}
        <div className="bg-stone-50/80 p-4 sm:p-4.5 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/70 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Expense Ledger Details
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
              Tristate Handling
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Estimated Cost */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Estimated Cost ({trip?.currency || 'USD'})
              </label>
              <input
                type="number"
                name="estimatedCost"
                min="0"
                step="any"
                value={formData.estimatedCost}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                required
              />
            </div>

            {/* Actual Cost */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Actual Cost
                </label>
                <label className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-stone-200 hover:border-slate-400 text-[11px] font-semibold text-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="hasActualExpense"
                    checked={formData.hasActualExpense}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span>Spent</span>
                </label>
              </div>

              <input
                type="number"
                name="actualCost"
                min="0"
                step="any"
                disabled={!formData.hasActualExpense}
                value={formData.hasActualExpense ? (formData.actualCost !== null ? formData.actualCost : '') : ''}
                onChange={handleChange}
                placeholder={formData.hasActualExpense ? '0.00' : 'Pending'}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  formData.hasActualExpense 
                    ? 'border-stone-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs' 
                    : 'border-stone-200/60 bg-stone-100/80 text-slate-400 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Personal Notes & Tips
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Wear walking boots, pre-book boats at the east pier"
            className="w-full px-4 py-2.5 rounded-2xl bg-stone-50/70 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs text-slate-800 resize-none transition-all"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
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
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-medium text-xs tracking-wider uppercase shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Update Stop' : 'Confirm Stop'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
