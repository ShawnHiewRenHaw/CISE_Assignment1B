export interface Article {
  title: string;
  authors: string[];
  source: string;
  pubyear: number;  
  doi: string;
  claim?: string;
  evidence?: string;
  status: string;
}
