import { Schema, Document, Types } from 'mongoose';

// Define the Article interface
export interface Article {
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
  status: string;
}

// Extend the Mongoose Document with the Article interface
export interface ArticleDocument extends Document, Article {
  _id: Types.ObjectId;  // Use ObjectId type for the ID
}

// Define and export the Article Schema
export const ArticleSchema = new Schema({
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  source: { type: String, required: true },
  pubyear: { type: String, required: true },
  doi: { type: String, required: true },
  claim: { type: String, required: true },
  evidence: { type: String, required: true },
  status: { type: String, required: true },
});
