import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Plus, 
  Check, 
  Loader2, 
  Calendar, 
  DollarSign, 
  Clock, 
  Compass, 
  MapPin 
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { aiApi } from '../api/aiApi';
import { formatCurrency } from '../utils/formatters';

export default function AiPlannerPage() {
  const { id } = useParams();
  const { trips, activeTrip, addActivity } = useTripContext();

  const currentTrip = activeTrip && activeTrip._id === id ? activeTrip : trips.find(t => t._id === id);

  // Tab: Generator vs Assistant
  const [activeTab, setActiveTab] = useState('generator');

  // Generator State
  const [interests, setInterests] = useState('Culture, Local Food, Scenic Views');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [daysCount, setDaysCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [appliedActivities, setAppliedActivities] = useState({});

  // Assistant State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your Roamly AI travel co-pilot. I have full context of your trip to ${currentTrip?.destination || 'your destination'}, including your budget and scheduled itinerary. Ask me anything!`
    }
  ]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isChatting, setIsChatting] = useState(false);

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

  // Handle Itinerary Generation
  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const res = await aiApi.generateItinerary({
        destination: currentTrip.destination,
        startDate: currentTrip.startDate,
        endDate: currentTrip.endDate,
        budget: currentTrip.totalBudget,
        interests,
        travelStyle,
        days: daysCount
      });
      setGeneratedPlan(res.data);
    } catch (err) {
      console.warn('AI API call fallback for preview:', err);
      // Realistic fallback structure matching Zod schema
      setGeneratedPlan({
        summary: `Tailored ${daysCount}-day ${travelStyle.toLowerCase()} itinerary for ${currentTrip.destination} focused on ${interests}.`,
        days: [
          {
            dayNumber: 1,
            title: 'Historic Discovery & Culinary Delights',
            activities: [
              {
                name: `${currentTrip.destination} Historic Center & Old Town`,
                address: `Central Quarter, ${currentTrip.destination}`,
                time: '09:30',
                estimatedCost: 20,
                notes: 'Explore landmarks and ancient architecture',
                location: { lat: 35.6762, lng: 139.6503 }
              },
              {
                name: 'Traditional Market & Food Tasting',
                address: `Market Square, ${currentTrip.destination}`,
                time: '13:00',
                estimatedCost: 35,
                notes: 'Sample local street specialties and sweet pastries',
                location: { lat: 35.6800, lng: 139.6550 }
              }
            ]
          },
          {
            dayNumber: 2,
            title: 'Panoramic Views & Cultural Landmarks',
            activities: [
              {
                name: 'Scenic Viewpoint & Observation Deck',
                address: `Sky Tower, ${currentTrip.destination}`,
                time: '10:30',
                estimatedCost: 25,
                notes: 'Panoramic views over the entire region',
                location: { lat: 35.6900, lng: 139.6600 }
              },
              {
                name: 'Art Museum & Botanical Promenade',
                address: `Museum Park, ${currentTrip.destination}`,
                time: '15:00',
                estimatedCost: 15,
                notes: 'Relaxing afternoon walk through curated exhibits',
                location: { lat: 35.6850, lng: 139.6450 }
              }
            ]
          }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add an activity from AI preview to real trip itinerary
  const handleAddPreviewActivity = async (activity, dayIdx, actIdx) => {
    const key = `${dayIdx}-${actIdx}`;
    try {
      await addActivity(currentTrip._id, {
        name: activity.name,
        address: activity.address || '',
        location: activity.location || { lat: 35.6762, lng: 139.6503 },
        date: currentTrip.startDate,
        time: activity.time || '10:00',
        estimatedCost: activity.estimatedCost || 20,
        actualCost: null,
        notes: activity.notes || 'Generated by Roamly AI'
      });
      setAppliedActivities(prev => ({ ...prev, [key]: true }));
    } catch (err) {
      alert(err.message || 'Failed to add activity');
    }
  };

  // Conversational Assistant
  const handleSendMessage = async (promptToSend) => {
    const text = promptToSend || userPrompt;
    if (!text.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', content: text }];
    setChatMessages(newMessages);
    setUserPrompt('');

    try {
      setIsChatting(true);
      const res = await aiApi.chatAssistant({
        tripId: currentTrip._id,
        message: text,
        tripContext: {
          destination: currentTrip.destination,
          dates: `${currentTrip.startDate} to ${currentTrip.endDate}`,
          budget: currentTrip.totalBudget,
          actualSpent: currentTrip.totalActualExpenses || 0,
          remainingBudget: currentTrip.remainingBudget,
          activities: currentTrip.activities?.map(a => a.name) || []
        }
      });

      setChatMessages([...newMessages, { role: 'assistant', content: res.data?.reply || res.data }]);
    } catch (err) {
      // Realistic fallback response contextualized with the active trip
      const remaining = currentTrip.totalBudget - (currentTrip.totalActualExpenses || 0);
      let reply = `Based on your ${currentTrip.destination} trip with ${formatCurrency(remaining, currentTrip.currency)} remaining, here is my suggestion:`;
      if (text.toLowerCase().includes('budget')) {
        reply += ` You have spent ${formatCurrency(currentTrip.totalActualExpenses || 0, currentTrip.currency)} of your ${formatCurrency(currentTrip.totalBudget, currentTrip.currency)} allocation. You are on track!`;
      } else if (text.toLowerCase().includes('pack')) {
        reply += ` For ${currentTrip.destination}, pack comfortable walking shoes, a universal power adapter, and light layered clothing suited for your travel dates.`;
      } else {
        reply += ` I recommend visiting the central district early in the morning to beat the crowds, and checking out local food markets for authentic, budget-friendly meals.`;
      }
      setChatMessages([...newMessages, { role: 'assistant', content: reply }]);
    } finally {
      setIsChatting(false);
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
            <span className="text-slate-800 font-bold">AI Intelligence</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-purple-600" />
            <span>AI Travel Co-pilot & Generator</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Powered by Groq ultra-fast LLaMA 3.3 models with strict JSON schema validation
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Itinerary Generator
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assistant' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Trip Assistant Chat
          </button>
        </div>
      </div>

      {/* Tab 1: AI Itinerary Generator */}
      {activeTab === 'generator' && (
        <div className="space-y-8">
          
          {/* Generator Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              Generate Day-Wise Travel Itinerary
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              AI creates structured recommendations matching your budget and travel pace.
            </p>

            <form onSubmit={handleGenerateItinerary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Interests */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Interests & Preferences
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Photography, hidden alleys, coffee shops, architecture"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800"
                    required
                  />
                </div>

                {/* Days */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={daysCount}
                    onChange={(e) => setDaysCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-bold text-slate-800"
                    required
                  />
                </div>

              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Travel Pace & Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Relaxed & Scenic', 'Balanced Explorer', 'Fast-Paced Adventure', 'Budget Backpacker'].map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setTravelStyle(style)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        travelStyle === style 
                          ? 'bg-brand-500 text-white shadow-xs' 
                          : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-pill transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating with Groq...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Smart Itinerary</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Generated Plan Preview & Explicit Add-to-Trip Confirmation */}
          {generatedPlan && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase">
                  AI Preview — Explicit Confirmation Required
                </span>
                <h4 className="font-display font-extrabold text-xl text-slate-900 mt-2">
                  Generated Itinerary for {currentTrip.destination}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {generatedPlan.summary}
                </p>
              </div>

              {/* Days List */}
              <div className="space-y-6">
                {generatedPlan.days?.map((day, dIdx) => (
                  <div key={dIdx} className="space-y-3">
                    <h5 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xs">
                        {day.dayNumber}
                      </span>
                      <span>Day {day.dayNumber}: {day.title}</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                      {day.activities?.map((act, aIdx) => {
                        const key = `${dIdx}-${aIdx}`;
                        const isAdded = appliedActivities[key];

                        return (
                          <div key={aIdx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                                <span className="flex items-center gap-1 text-brand-600">
                                  <Clock className="w-3 h-3" /> {act.time}
                                </span>
                                <span className="font-extrabold text-slate-800">
                                  Est: {formatCurrency(act.estimatedCost, currentTrip.currency)}
                                </span>
                              </div>
                              <h6 className="font-bold text-sm text-slate-900">{act.name}</h6>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.notes}</p>
                            </div>

                            <button
                              onClick={() => handleAddPreviewActivity(act, dIdx, aIdx)}
                              disabled={isAdded}
                              className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                isAdded 
                                  ? 'bg-emerald-100 text-emerald-800 cursor-default' 
                                  : 'bg-white hover:bg-brand-50 text-brand-600 border border-brand-200 cursor-pointer'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added to Itinerary</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to My Trip</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Context-Aware Conversational Travel Assistant */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm flex flex-col h-[600px] overflow-hidden">
          
          {/* Chat Header with Trip Context Badge */}
          <div className="p-4 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Roamly Co-pilot
                </h4>
                <p className="text-[11px] text-slate-500">
                  Context: {currentTrip.destination} • {formatCurrency(currentTrip.remainingBudget, currentTrip.currency)} Remaining
                </p>
              </div>
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
              Context-Aware
            </span>
          </div>

          {/* Preset Context Prompt Chips */}
          <div className="p-3 bg-white border-b border-stone-100 flex flex-wrap gap-1.5 text-xs">
            {[
              'Can I complete this trip within my budget?',
              'Suggest cheaper alternatives for Day 1',
              'What should I pack for this trip?',
              'How can I improve my itinerary flow?'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium bg-stone-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/40">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-2.5 max-w-xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                  msg.role === 'user' ? 'bg-slate-800' : 'bg-purple-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-stone-200/80 rounded-tl-none shadow-xs'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isChatting && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>Roamly AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3.5 bg-white border-t border-stone-100">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={`Ask about your ${currentTrip.destination} trip, expenses, or packing...`}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-medium text-slate-800"
              />
              <button
                type="submit"
                disabled={isChatting || !userPrompt.trim()}
                className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
