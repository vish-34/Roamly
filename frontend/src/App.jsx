import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Navbar from './components/layout/Navbar';
import OnboardingPage from './pages/OnboardingPage';
import TripsPage from './pages/TripsPage';
import TripWorkspacePage from './pages/TripWorkspacePage';
import BudgetPage from './pages/BudgetPage';
import DocumentsPage from './pages/DocumentsPage';
import AiPlannerPage from './pages/AiPlannerPage';
import CreateTripModal from './components/trips/CreateTripModal';

export default function App() {
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [initialTripData, setInitialTripData] = useState(null);

  const handleOpenCreateTrip = (data = null) => {
    setInitialTripData(data);
    setIsCreateTripOpen(true);
  };

  return (
    <TripProvider>
      <div className="min-h-screen bg-[#FAF9F5] text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
        
        {/* Top Navbar */}
        <Navbar onOpenCreateTrip={handleOpenCreateTrip} />

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<OnboardingPage onOpenCreateTrip={handleOpenCreateTrip} />} />
            <Route path="/trips" element={<TripsPage onOpenCreateTrip={handleOpenCreateTrip} />} />
            <Route path="/trips/:id" element={<TripWorkspacePage onOpenCreateTrip={handleOpenCreateTrip} />} />
            <Route path="/trips/:id/budget" element={<BudgetPage />} />
            <Route path="/trips/:id/documents" element={<DocumentsPage />} />
            <Route path="/trips/:id/ai" element={<AiPlannerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Create Trip Modal */}
        <CreateTripModal
          isOpen={isCreateTripOpen}
          onClose={() => {
            setIsCreateTripOpen(false);
            setInitialTripData(null);
          }}
          initialData={initialTripData}
        />

        {/* Minimal Modern Footer */}
        <footer className="border-t border-stone-200/80 bg-white py-6 text-center text-xs text-slate-500 font-medium">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-bold text-slate-700">
              Roamly — Intelligent Travel Planner
            </span>
            <span className="text-[11px] text-slate-400">
              Quantiphi Vibe Coding Assessment • MERN Stack Architecture
            </span>
          </div>
        </footer>

      </div>
    </TripProvider>
  );
}
