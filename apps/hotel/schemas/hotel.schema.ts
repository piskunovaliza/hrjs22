import { Schema, Document } from 'mongoose';

export interface Hotel extends Document {
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const HotelSchema = new Schema<Hotel>(
  {
    name: { type: String, required: true },
    description: { type: String },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);
