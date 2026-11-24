import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Cinematic dark frosted backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 text-center sm:p-4">
        <div 
          className={`relative transform overflow-hidden rounded-[1.75rem] bg-white text-left shadow-2xl transition-all w-full ${maxWidth} border border-stone-200/90 animate-in fade-in zoom-in-95 duration-200 my-auto`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-3.5">
            <div>
              {typeof title === 'string' ? (
                <h3 className="font-display font-medium text-lg text-slate-900 tracking-tight">
                  {title}
                </h3>
              ) : (
                title
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-stone-200 hover:border-slate-800 hover:bg-stone-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
