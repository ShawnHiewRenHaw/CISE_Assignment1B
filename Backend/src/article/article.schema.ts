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
}

export const ArticleSchema = new Schema({
  id: { type: String }, 
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  source: { type: String },
  pubyear: { type: Number },
  doi: { type: String },
  claim: { type: String },
  evidence: { type: String }, 
  status: { type: String, required: true },
});
