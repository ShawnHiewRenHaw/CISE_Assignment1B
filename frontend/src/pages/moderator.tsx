import { NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../components/table/SortableTable";

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
  status: string;
}

const ModeratorPage: NextPage = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>([]); // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input
  const [filterColumn, setFilterColumn] = useState<string>(""); // Selected column to filter by
  const [error, setError] = useState<string | null>(null); // For handling errors

  // Table headers without the rating column
  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
    { key: "status", label: "Status" }, 
  ];

  // Fetch all articles from the backend and filter for pending ones
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:3001/articles"); 
        const data = await res.json();

        if (Array.isArray(data)) {
          const pendingArticles = data.filter((article: any) => article.status === 'pending'); // Only show pending articles
          setArticles(pendingArticles.map((article: any) => ({
            id: article._id,
            title: article.title,
            authors: article.authors,
            source: article.source,
            pubyear: article.pubyear,
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
            status: article.status,
          })));
        } else {
          console.error("Data fetched is not an array:", data);
          setArticles([]);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to fetch articles. Please try again later.");
      }
    };

    fetchArticles();
  }, []);

  const handleApproval = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }), // Ensure the status is correctly sent
      });
  
      if (res.ok) {
        // Update the UI after the article is approved or rejected
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === id ? { ...article, status } : article
          )
        );
      } else {
        const errorData = await res.json();
        console.error("Failed to update article status:", errorData.message);
      }
    } catch (err) {
      console.error("Error updating article status:", err);
    }
  };
  

  // Filter articles based on the selected column and search query
  const filteredArticles = articles.filter((article) => {
    if (!filterColumn) return true; // If no filter is selected, show all
    const columnValue = article[filterColumn as keyof ArticlesInterface];
    return columnValue?.toString().toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container">
      <h1>Moderator Page</h1>
      <p>Manage articles by approving or rejecting them:</p>

      {/* Error display */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search input */}
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          fontSize: "16px",
        }}
      />

      {/* Filter by column */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="filter-column" style={{ marginRight: "10px" }}>
          Filter by:
        </label>
        <select
          id="filter-column"
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">All Columns</option>
          {headers.map((header) => (
            <option key={header.key} value={header.key}>
              {header.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sortable table with filtered articles */}
      <SortableTable
        headers={headers}
        data={filteredArticles.map((article) => ({
          ...article,
          status: (
            <div>
              <button onClick={() => handleApproval(article.id, "approved")}>
                Approve
              </button>
              <button onClick={() => handleApproval(article.id, "rejected")}>
                Reject
              </button>
            </div>
          )
        }))}
      />
    </div>
  );
};

export default ModeratorPage;
