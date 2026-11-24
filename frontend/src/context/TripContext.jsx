import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tripApi } from '../api/tripApi';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all trips
  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tripApi.getAllTrips();
      const tripList = res.data || [];
      setTrips(tripList);
      
      // If there's an active trip, refresh it from list or keep it
      if (activeTrip) {
        const updated = tripList.find(t => t._id === activeTrip._id);
        if (updated) {
          setActiveTrip(prev => ({ ...prev, ...updated }));
        }
      } else if (tripList.length > 0) {
        // Set the first trip by default if none active
        setActiveTrip(tripList[0]);
      }
    } catch (err) {
      console.warn('Failed to load trips from backend, using local/demo mode if needed:', err);
      setError(err.message || 'Could not connect to backend');
    } finally {
      setLoading(false);
    }
  }, [activeTrip]);

  // Load single trip details with full activities and budget computations
  const selectTrip = useCallback(async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await tripApi.getTripById(tripId);
      if (res.data) {
        setActiveTrip(res.data);
      }
    } catch (err) {
      console.error('Failed to load trip details:', err);
      setError(err.message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new trip
  const createTrip = async (tripData) => {
    try {
      setLoading(true);
      const res = await tripApi.createTrip(tripData);
      const newTrip = res.data;
      setTrips(prev => [newTrip, ...prev]);
      setActiveTrip(newTrip);
      return newTrip;
    } catch (err) {
      console.warn('Backend offline, using seamless local trip persistence:', err);
      const fallbackTrip = {
        _id: 'trip_' + Date.now(),
        ...tripData,
        activities: [],
        documents: [],
        budget: {
          totalBudget: tripData.totalBudget || 0,
          totalEstimated: 0,
          totalActual: 0,
          remainingBudget: tripData.totalBudget || 0,
          projectedRemaining: tripData.totalBudget || 0,
          utilizationPercentage: 0,
          variance: 0,
          isOverBudget: false,
          status: 'safe'
        }
      };
      setTrips(prev => [fallbackTrip, ...prev]);
      setActiveTrip(fallbackTrip);
      return fallbackTrip;
    } finally {
      setLoading(false);
    }
  };

  // Update trip info
  const updateTrip = async (tripId, updateData) => {
    try {
      const res = await tripApi.updateTrip(tripId, updateData);
      const updated = res.data;
      setTrips(prev => prev.map(t => t._id === tripId ? updated : t));
      if (activeTrip && activeTrip._id === tripId) {
        setActiveTrip(updated);
      }
      return updated;
    } catch (err) {
      throw err;
    }
  };

  // Delete trip
  const deleteTrip = async (tripId) => {
    try {
      await tripApi.deleteTrip(tripId);
      const remaining = trips.filter(t => t._id !== tripId);
      setTrips(remaining);
      if (activeTrip && activeTrip._id === tripId) {
        setActiveTrip(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      throw err;
    }
  };

  // Activity management with real-time budget engine updates
  const addActivity = async (tripId, activityData) => {
    try {
      const res = await tripApi.addActivity(tripId, activityData);
      // Handles both full trip return or { activity, budget } return
      if (res.data?.activity && res.data?.budget) {
        setActiveTrip(prev => {
          if (!prev) return prev;
          const updatedActivities = [...(prev.activities || []), res.data.activity];
          return {
            ...prev,
            activities: updatedActivities,
            budget: res.data.budget
          };
        });
        setTrips(prev => prev.map(t => {
          if (t._id === tripId) {
            return {
              ...t,
              activities: [...(t.activities || []), res.data.activity],
              budget: res.data.budget
            };
          }
          return t;
        }));
      } else if (res.data) {
        const updatedTrip = res.data;
        setActiveTrip(updatedTrip);
        setTrips(prev => prev.map(t => t._id === tripId ? updatedTrip : t));
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateActivity = async (tripId, activityId, activityData) => {
    try {
      const res = await tripApi.updateActivity(tripId, activityId, activityData);
      if (res.data?.activity && res.data?.budget) {
        setActiveTrip(prev => {
          if (!prev) return prev;
          const updatedActivities = (prev.activities || []).map(a => 
            a._id === activityId ? res.data.activity : a
          );
          return {
            ...prev,
            activities: updatedActivities,
            budget: res.data.budget
          };
        });
        setTrips(prev => prev.map(t => {
          if (t._id === tripId) {
            const updatedActivities = (t.activities || []).map(a => 
              a._id === activityId ? res.data.activity : a
            );
            return {
              ...t,
              activities: updatedActivities,
              budget: res.data.budget
            };
          }
          return t;
        }));
      } else if (res.data) {
        const updatedTrip = res.data;
        setActiveTrip(updatedTrip);
        setTrips(prev => prev.map(t => t._id === tripId ? updatedTrip : t));
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteActivity = async (tripId, activityId) => {
    try {
      const res = await tripApi.deleteActivity(tripId, activityId);
      if (res.data?.budget) {
        setActiveTrip(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            activities: (prev.activities || []).filter(a => a._id !== activityId),
            budget: res.data.budget
          };
        });
        setTrips(prev => prev.map(t => {
          if (t._id === tripId) {
            return {
              ...t,
              activities: (t.activities || []).filter(a => a._id !== activityId),
              budget: res.data.budget
            };
          }
          return t;
        }));
      } else if (res.data) {
        const updatedTrip = res.data;
        setActiveTrip(updatedTrip);
        setTrips(prev => prev.map(t => t._id === tripId ? updatedTrip : t));
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const refreshActiveTrip = async () => {
    if (activeTrip?._id) {
      await selectTrip(activeTrip._id);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        setActiveTrip,
        loading,
        error,
        fetchTrips,
        selectTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addActivity,
        updateActivity,
        deleteActivity,
        refreshActiveTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
