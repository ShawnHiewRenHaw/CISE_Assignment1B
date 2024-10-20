import { NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";

interface ArticleInterface {
  id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim: string;
  evidence: string;
  research: string;
  participant: string;
  status: string;
}

const AnalystPage: NextPage = () => {
  const [approvedArticles, setApprovedArticles] = useState<ArticleInterface[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch approved articles
  const fetchApprovedArticles = async () => {
    try {
      const res = await fetch("http://localhost:3001/articles/approved");
      const data = await res.json();
      if (Array.isArray(data)) {
        setApprovedArticles(
          data.map((article: any) => ({
            id: article._id,
            title: article.title,
            authors: article.authors,
            source: article.source,
            pubyear: article.pubyear,
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
            research: article.research,
            participant: article.participant,
            status: article.status,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching approved articles:", err);
      setError("Failed to fetch approved articles. Please try again later.");
    }
  };

  useEffect(() => {
    fetchApprovedArticles();
  }, []);

  return (
    <div className="container">
      <h1>Analyst Page</h1>
      <p>Review the approved articles submitted by moderators:</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <SortableTable
        headers={[
          { key: "title", label: "Title" },
          { key: "authors", label: "Authors" },
          { key: "source", label: "Source" },
          { key: "pubyear", label: "Publication Year" },
          { key: "doi", label: "DOI" },
          { key: "claim", label: "Claim" },
          { key: "evidence", label: "Evidence" },
          { key: "research", label: "Research" },
          { key: "participant", label: "Participant" },
        ]}
        data={approvedArticles}
      />
    </div>
  );
};

export default AnalystPage;
