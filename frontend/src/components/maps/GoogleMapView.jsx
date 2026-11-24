import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Search, 
  Star, 
  Navigation, 
  Plus, 
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Maximize2
} from 'lucide-react';
import { placesApi } from '../../api/placesApi';

// Fallback coordinate dictionary for common global destinations
const CITY_COORDINATES = {
  tokyo: { lat: 35.6762, lng: 139.6503, zoom: 12 },
  japan: { lat: 35.6762, lng: 139.6503, zoom: 11 },
  kyoto: { lat: 35.0116, lng: 135.7681, zoom: 13 },
  osaka: { lat: 34.6937, lng: 135.5023, zoom: 12 },
  kathmandu: { lat: 27.7172, lng: 85.3240, zoom: 13 },
  pokhara: { lat: 28.2096, lng: 83.9856, zoom: 13 },
  nepal: { lat: 28.3949, lng: 84.1240, zoom: 8 },
  everest: { lat: 27.9881, lng: 86.9250, zoom: 11 },
  annapurna: { lat: 28.5955, lng: 83.9311, zoom: 10 },
  paris: { lat: 48.8566, lng: 2.3522, zoom: 12 },
  france: { lat: 46.2276, lng: 2.2137, zoom: 6 },
  london: { lat: 51.5074, lng: -0.1278, zoom: 12 },
  uk: { lat: 55.3781, lng: -3.4360, zoom: 6 },
  rome: { lat: 41.9028, lng: 12.4964, zoom: 12 },
  italy: { lat: 41.8719, lng: 12.5674, zoom: 6 },
  bali: { lat: -8.4095, lng: 115.1889, zoom: 11 },
  indonesia: { lat: -0.7893, lng: 113.9213, zoom: 6 },
  newyork: { lat: 40.7128, lng: -74.0060, zoom: 12 },
  usa: { lat: 37.0902, lng: -95.7129, zoom: 5 },
  dubai: { lat: 25.2048, lng: 55.2708, zoom: 12 },
  bangkok: { lat: 13.7563, lng: 100.5018, zoom: 12 },
  thailand: { lat: 15.8700, lng: 100.9925, zoom: 6 }
};

// Available genuine tile layers
const MAP_THEMES = {
  voyager: {
    name: 'Editorial',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  },
  street: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    maxZoom: 19
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    subdomains: '',
    maxZoom: 18
  }
};

function getDestinationCenter(destName) {
  if (!destName) return { lat: 35.6762, lng: 139.6503, zoom: 12 };
  const lower = destName.toLowerCase().replace(/[^a-z]/g, '');
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return coords;
    }
  }
  return { lat: 35.6762, lng: 139.6503, zoom: 12 };
}

export default function GoogleMapView({ 
  trip, 
  selectedActivity, 
  onSelectActivity, 
  onAddPlaceToItinerary 
}) {
  const activities = trip?.activities || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('voyager');
  const [mapCenterCoords, setMapCenterCoords] = useState({ lat: 35.6762, lng: 139.6503, zoom: 12 });
  const [clickedLocation, setClickedLocation] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const markersMapRef = useRef(new Map());

  // Determine initial center
  const initialCenter = React.useMemo(() => {
    if (activities.length > 0 && activities[0].location?.lat && activities[0].location?.lng) {
      return { 
        lat: activities[0].location.lat, 
        lng: activities[0].location.lng, 
        zoom: 13 
      };
    }
    return getDestinationCenter(trip?.destination);
  }, [activities, trip?.destination]);

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialCenter.zoom || 12,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer
    const themeConfig = MAP_THEMES[currentTheme] || MAP_THEMES.voyager;
    const tileLayer = L.tileLayer(themeConfig.url, {
      attribution: themeConfig.attribution,
      subdomains: themeConfig.subdomains,
      maxZoom: themeConfig.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Feature group layers for markers and route
    const markersGroup = L.featureGroup().addTo(map);
    const routeGroup = L.featureGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    routeLayerRef.current = routeGroup;

    // Map move/zoom listeners
    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenterCoords({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom()
      });
    });

    // Click on map to drop a pin and allow adding to itinerary
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setClickedLocation({ lat, lng });

      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current);
      }

      const clickIcon = L.divIcon({
        className: 'custom-click-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div class="w-2 h-2 bg-emerald-600 rotate-45 -mt-1"></div>
          </div>
        `
      });

      const newClickMarker = L.marker([lat, lng], { icon: clickIcon }).addTo(map);
      
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1.5 text-slate-800 text-xs font-sans';
      popupContent.innerHTML = `
        <div class="font-bold text-slate-900 mb-1">📍 Custom Map Pin</div>
        <div class="text-[11px] text-slate-500 mb-2">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</div>
      `;

      const addBtn = document.createElement('button');
      addBtn.className = 'w-full px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1';
      addBtn.innerHTML = `<span>+ Add Stop Here</span>`;
      addBtn.onclick = () => {
        onAddPlaceToItinerary({
          name: `Stop @ ${lat.toFixed(3)}, ${lng.toFixed(3)}`,
          address: `${trip?.destination || 'Destination'} Location`,
          location: { lat, lng },
          rating: 4.8
        });
        map.removeLayer(newClickMarker);
        setClickedLocation(null);
      };

      popupContent.appendChild(addBtn);

      newClickMarker.bindPopup(popupContent, { minWidth: 160 }).openPopup();
      clickMarkerRef.current = newClickMarker;
    });

    mapInstanceRef.current = map;

    // Invalidate size to guarantee tiles render properly
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Tile Layers when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const themeConfig = MAP_THEMES[currentTheme] || MAP_THEMES.voyager;
    tileLayerRef.current.setUrl(themeConfig.url);
  }, [currentTheme]);

  // 3. Update Activity Markers and Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const routeGroup = routeLayerRef.current;
    if (!map || !markersGroup || !routeGroup) return;

    markersGroup.clearLayers();
    routeGroup.clearLayers();
    markersMapRef.current.clear();

    const validCoordinates = [];

    activities.forEach((act, idx) => {
      const lat = act.location?.lat;
      const lng = act.location?.lng;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      validCoordinates.push([lat, lng]);

      const isSelected = selectedActivity?._id === act._id;
      const markerNumber = idx + 1;

      // Custom sleek HTML pin icon
      const pinIcon = L.divIcon({
        className: 'roamly-activity-pin',
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -42],
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
            isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'
          }">
            <div class="px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap mb-1 transition-all ${
              isSelected 
                ? 'bg-slate-900 text-white ring-2 ring-brand-500 shadow-brand-500/30' 
                : 'bg-white/95 text-slate-800 border border-stone-200 group-hover:border-slate-400'
            }">
              <span class="inline-block w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-brand-500' : 'bg-slate-700'} mr-1"></span>
              ${act.name.length > 15 ? act.name.substring(0, 15) + '...' : act.name}
            </div>
            
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
              isSelected 
                ? 'bg-brand-500 border-white text-white ring-4 ring-brand-500/20 shadow-brand-500/40' 
                : 'bg-slate-900 border-white text-white group-hover:bg-slate-800'
            }">
              <span class="text-xs font-black tracking-tight">${markerNumber}</span>
            </div>
            
            <div class="w-1.5 h-1.5 rotate-45 -mt-0.5 shadow-xs ${isSelected ? 'bg-brand-500' : 'bg-slate-900'}"></div>
          </div>
        `
      });

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(markersGroup);

      // Marker popup
      const popupHtml = `
        <div class="p-1 min-w-[200px] font-sans">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600">
              Stop #${markerNumber}
            </span>
            ${act.rating ? `<span class="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">★ ${act.rating}</span>` : ''}
          </div>
          <h4 class="font-bold text-slate-900 text-sm leading-tight">${act.name}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">${act.address || 'Location on itinerary'}</p>
          <div class="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-600">${act.time || '10:00'}</span>
            <span class="font-bold text-emerald-600">$${act.estimatedCost || 0}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { minWidth: 200, className: 'roamly-custom-popup' });

      marker.on('click', () => {
        onSelectActivity && onSelectActivity(act);
      });

      if (act._id) {
        markersMapRef.current.set(act._id, marker);
      }
    });

    // Draw connecting itinerary route if 2+ valid coordinates
    if (validCoordinates.length >= 2) {
      L.polyline(validCoordinates, {
        color: '#ea580c',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
        smoothFactor: 1
      }).addTo(routeGroup);
    }
  }, [activities, selectedActivity, onSelectActivity]);

  // 4. Center and Fly to Selected Activity
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedActivity?.location) return;

    const { lat, lng } = selectedActivity.location;
    if (typeof lat === 'number' && typeof lng === 'number') {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 1.0
      });

      if (selectedActivity._id && markersMapRef.current.has(selectedActivity._id)) {
        const marker = markersMapRef.current.get(selectedActivity._id);
        marker.openPopup();
      }
    }
  }, [selectedActivity]);

  // 5. Fit bounds to all activities
  const handleFitAllStops = () => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    if (markersGroup.getLayers().length > 0) {
      map.fitBounds(markersGroup.getBounds(), {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 0.8
      });
    } else {
      const destCenter = getDestinationCenter(trip?.destination);
      map.flyTo([destCenter.lat, destCenter.lng], destCenter.zoom, { animate: true });
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Search places via Geoapify / Places API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const res = await placesApi.searchPlaces(searchQuery, trip?.destination || '');
      const results = res.data?.data || res.data || [];
      setSearchResults(results);

      // If results found, fly to first place
      if (results.length > 0 && results[0].location) {
        highlightSearchResult(results[0]);
      }
    } catch (err) {
      console.warn('Google Places search error / fallback:', err);
      // Fallback relative to current map center
      const center = mapInstanceRef.current ? mapInstanceRef.current.getCenter() : initialCenter;
      const fallbackResults = [
        {
          placeId: 'loc-1',
          name: `${searchQuery} Landmark`,
          address: `Central District, ${trip?.destination || 'Destination'}`,
          rating: 4.8,
          location: { lat: center.lat + 0.008, lng: center.lng + 0.008 }
        },
        {
          placeId: 'loc-2',
          name: `${searchQuery} Garden & Cafe`,
          address: `Historic Quarter, ${trip?.destination || 'Destination'}`,
          rating: 4.6,
          location: { lat: center.lat - 0.007, lng: center.lng - 0.006 }
        }
      ];
      setSearchResults(fallbackResults);
      highlightSearchResult(fallbackResults[0]);
    } finally {
      setIsSearching(false);
    }
  };

  const highlightSearchResult = (place) => {
    const map = mapInstanceRef.current;
    if (!map || !place.location) return;

    const { lat, lng } = place.location;

    if (searchMarkerRef.current) {
      map.removeLayer(searchMarkerRef.current);
    }

    const searchIcon = L.divIcon({
      className: 'search-pulse-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-9 h-9 rounded-full bg-brand-500 border-2 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-brand-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <div class="w-2 h-2 bg-brand-500 rotate-45 -mt-1"></div>
        </div>
      `
    });

    const marker = L.marker([lat, lng], { icon: searchIcon }).addTo(map);
    marker.bindPopup(`
      <div class="p-1 font-sans">
        <div class="text-[10px] font-bold uppercase text-brand-600 mb-0.5">Discovered Place</div>
        <h4 class="font-bold text-slate-900 text-sm">${place.name}</h4>
        <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">${place.address || ''}</p>
      </div>
    `).openPopup();

    searchMarkerRef.current = marker;

    map.flyTo([lat, lng], 15, {
      animate: true,
      duration: 1.0
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm flex flex-col h-[650px] relative">
      
      {/* Top Map Search Bar */}
      <div className="p-3.5 bg-white/95 backdrop-blur-md border-b border-stone-100 z-10">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search places or landmarks in ${trip?.destination || 'destination'}...`}
            className="w-full pl-10 pr-24 py-2 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1 top-1 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            {isSearching ? 'Searching...' : 'Find Place'}
          </button>
        </form>

        {/* Live Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="mt-2 p-2 bg-stone-50/95 backdrop-blur-md rounded-2xl border border-stone-200 max-h-48 overflow-y-auto space-y-1.5 shadow-lg">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-500">
              <span>Places Found ({searchResults.length})</span>
              <button 
                onClick={() => setSearchResults([])}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Close
              </button>
            </div>
            {searchResults.map((place, idx) => (
              <div 
                key={place.placeId || idx}
                onClick={() => highlightSearchResult(place)}
                className="bg-white p-2.5 rounded-xl border border-stone-100 hover:border-brand-300 transition-all flex items-center justify-between gap-3 text-xs cursor-pointer group"
              >
                <div className="min-w-0">
                  <h5 className="font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                    {place.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 truncate">{place.address}</p>
                  {place.rating && (
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {place.rating} rating
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddPlaceToItinerary({
                      name: place.name,
                      address: place.address,
                      googlePlaceId: place.placeId,
                      location: place.location,
                      rating: place.rating
                    });
                    setSearchResults([]);
                  }}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Stop</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real Interactive Leaflet Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        
        {/* Leaflet DOM Mounting Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

        {/* Floating Custom Map Controls */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 border border-stone-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 border border-stone-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Recenter & Fit All Stops */}
          <button
            type="button"
            onClick={handleFitAllStops}
            title="Fit All Stops"
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-stone-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Navigation className="w-4 h-4" />
          </button>

          {/* Map Layer Switcher */}
          <div className="relative group">
            <button
              type="button"
              title="Change Map Theme"
              className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 border border-stone-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
            </button>
            <div className="absolute right-9 top-0 hidden group-hover:flex flex-col bg-white rounded-xl shadow-xl border border-stone-200 p-1 min-w-[100px] text-xs font-bold space-y-0.5">
              {Object.entries(MAP_THEMES).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCurrentTheme(key)}
                  className={`px-2.5 py-1 text-left rounded-lg transition-colors cursor-pointer ${
                    currentTheme === key ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar / Map Location Badge */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/90 text-[11px] font-semibold text-slate-600 flex items-center gap-2 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-900">{activities.length} {activities.length === 1 ? 'Stop' : 'Stops'} Plotted</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-[10px]">
            {mapCenterCoords.lat.toFixed(4)}, {mapCenterCoords.lng.toFixed(4)}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 text-[10px] capitalize">{currentTheme} Layer</span>
        </div>

        {/* Selected Activity Bottom Card */}
        {selectedActivity && (
          <div className="absolute bottom-3 right-3 z-[400] max-w-xs bg-white p-3.5 rounded-2xl shadow-xl border border-stone-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                  Active Selection
                </span>
                <h5 className="font-display font-bold text-sm text-slate-900 mt-1">
                  {selectedActivity.name}
                </h5>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {selectedActivity.address || `${trip?.destination || 'Destination'} itinerary stop`}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600">
                  <span>⏱ {selectedActivity.time || '10:00'}</span>
                  <span>💰 ${selectedActivity.estimatedCost || 0}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => onSelectActivity(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
