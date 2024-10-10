export class CreateArticleDto {
    title: string;
    authors: string[];
    source: string;
    pubyear: string; // Add this if it's missing
    doi: string;
    claim: string;
    evidence: string;
    status: string; // If status is also needed
  }
  