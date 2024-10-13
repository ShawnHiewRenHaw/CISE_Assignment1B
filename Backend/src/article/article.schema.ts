import { Schema, Document } from 'mongoose';

export interface Article {
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
  status: string;
}

export interface SpeedDocument extends Document {
  articles: Article[];
}

export const SpeedSchema = new Schema({
  articles: [{ 
    title: String,
    authors: String,
    source: String,
    pubyear: String,
    doi: String,
    claim: String,
    evidence: String,
    status: String, 
  }],
});
