export interface Article {
  _id?: string; 
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
  status?: string; 
}
