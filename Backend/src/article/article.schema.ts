import { Schema, Document } from 'mongoose';

export interface Article extends Document {
  id: string; 
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim: string;
  evidence: string; 
  status: string;
  research: string;
  participant: string;
}

export const ArticleSchema = new Schema({
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  source: { type: String, required: true },
  pubyear: { type: Number, required: true },
  doi: { type: String, required: true },
  claim: { type: String, required: true },
  evidence: { type: String, required: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true },
  research: { type: String, required: false },  // Optional field
  participant: { type: String, required: false } // Optional field
});
