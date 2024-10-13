import { Schema, Document } from 'mongoose';

export interface SpeedDocument extends Document {
  articles: {
    title: string;
    authors: string[];
    source: string;
    pubyear: number;
    doi: string;
    claim: string;
    evidence: string;
    status: string;
  }[];
}

export const SpeedSchema = new Schema({
  articles: [
    {
      title: String,
      authors: [String],
      source: String,
      pubyear: Number,
      doi: String,
      claim: String,
      evidence: String,
      status: String,
    },
  ],
});
