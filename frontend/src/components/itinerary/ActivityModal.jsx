import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Check, 
  Sparkles,
  Loader2 
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
    const { name, value, type, checked } = e.target;
    
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
        // Preserve tristate: null if unrecorded, number (even 0) if confirmed
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit Activity & Costs' : 'Add Activity to Itinerary'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {/* Activity Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Activity / Place Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Senso-ji Temple & Street Food"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold text-slate-900"
            required
          />
        </div>

        {/* Address / Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Location Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-brand-500 absolute left-3.5 top-3" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 2 Chome-3-1 Asakusa, Taito City, Tokyo"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Scheduled Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-900"
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
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-900"
              required
            />
          </div>
        </div>

        {/* Mandatory Vibe Check: Estimated vs Actual Cost */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Expense Details
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Tristate Validated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Estimated Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
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
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-bold text-slate-900"
                required
              />
            </div>

            {/* Actual Cost */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600">
                  Actual Cost
                </label>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-brand-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasActualExpense"
                    checked={formData.hasActualExpense}
                    onChange={handleChange}
                    className="rounded text-brand-500 focus:ring-brand-500"
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
                placeholder={formData.hasActualExpense ? '0.00' : 'Pending expense'}
                className={`w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-bold text-slate-900 ${
                  formData.hasActualExpense ? 'bg-white focus:ring-2 focus:ring-brand-500' : 'bg-stone-100/70 text-slate-400 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            * Unrecorded actual costs are treated as pending and do not distort confirmed spend calculations.
          </p>
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
            placeholder="e.g. Buy tickets at the south entrance, try the matcha ice cream"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-slate-800 resize-none"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-sm shadow-pill transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Update Stop' : 'Add Stop'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
