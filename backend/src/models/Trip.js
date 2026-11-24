const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    googlePlaceId: { type: String, default: null },
    address: { type: String, default: '' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    rating: { type: Number, default: null, min: 0, max: 5 },
    userRating: { type: Number, default: null, min: 1, max: 5 },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: '' },
    estimatedCost: { type: Number, required: true, min: 0 },
    actualCost: { type: Number, default: null, min: 0 }
  },
  { _id: true, timestamps: true }
);

const DocumentReferenceSchema = new mongoose.Schema(
  {
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const TripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalBudget: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true, trim: true },
    activities: { type: [ActivitySchema], default: [] },
    documents: { type: [DocumentReferenceSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);
