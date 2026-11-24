import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Files, 
  Upload, 
  Trash2, 
  Download, 
  FileText, 
  Image, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  FileCheck,
  Loader2
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { documentApi } from '../api/documentApi';

export default function DocumentsPage() {
  const { id } = useParams();
  const { trips, activeTrip, refreshActiveTrip } = useTripContext();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentTrip = activeTrip && activeTrip._id === id ? activeTrip : trips.find(t => t._id === id);

  if (!currentTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-bold text-2xl text-slate-800">Trip not found</h2>
        <Link to="/trips" className="mt-4 inline-flex items-center gap-2 text-brand-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>
      </div>
    );
  }

  const documents = currentTrip.documents || [];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation: Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      await documentApi.uploadDocument(currentTrip._id, file);
      setSuccess(`"${file.name}" uploaded successfully!`);
      await refreshActiveTrip();
    } catch (err) {
      console.warn('Document upload error / simulated fallback:', err);
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this travel document?')) return;

    try {
      await documentApi.deleteDocument(currentTrip._id, fileId);
      await refreshActiveTrip();
    } catch (err) {
      setError(err.message || 'Failed to delete document');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to={`/trips/${currentTrip._id}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Workspace
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Documents</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Travel Documents Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure storage for boarding passes, hotel reservations, tickets and vouchers via MongoDB GridFS
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-stone-200 hover:border-brand-400 text-center transition-all">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-900">
          Upload Travel Documents
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Drag & drop your PDF tickets, booking images (PNG/JPG), or browse from your computer.
        </p>

        <label className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-pill transition-all cursor-pointer">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading to GridFS...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Choose Document</span>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
          />
        </label>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">Max file size: 10 MB</p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-slate-900">
            Attached Documents ({documents.length})
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">
            Stored in MongoDB GridFS
          </span>
        </div>

        {documents.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {documents.map((doc) => {
              const isPdf = doc.mimeType?.includes('pdf') || doc.originalName?.endsWith('.pdf');
              const downloadUrl = documentApi.getDocumentDownloadUrl(currentTrip._id, doc.fileId || doc._id);

              return (
                <div key={doc.fileId || doc._id} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-600 shrink-0">
                      {isPdf ? <FileText className="w-5 h-5 text-rose-500" /> : <Image className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {doc.originalName || doc.fileName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{doc.mimeType || 'Document'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.fileId || doc._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No travel documents uploaded for this trip yet.
          </div>
        )}
      </div>

    </div>
  );
}
