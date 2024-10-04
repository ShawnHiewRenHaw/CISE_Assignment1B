import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import SortableTable from "../../components/table/SortableTable";

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input
  const [filterColumn, setFilterColumn] = useState<string>(""); // Selected column to filter by

  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
  ];

  // Filter articles based on the selected column and search query
  const filteredArticles = articles.filter((article) => {
    if (!filterColumn) return true; // If no filter is selected, show all
    const columnValue = article[filterColumn as keyof ArticlesInterface];
    return columnValue
      ?.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles with search and filter options:</p>

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
      <SortableTable headers={headers} data={filteredArticles} />
    </div>
  );
};

// Fetch data from the NestJS backend
export const getServerSideProps: GetServerSideProps<ArticlesProps> = async (_) => {
  const res = await fetch('http://localhost:3001/articles'); // NestJS API endpoint
  const articles = await res.json();

  return {
    props: {
      articles: articles.map((article: any) => ({
        id: article._id, // Assuming _id is used in MongoDB
        title: article.title,
        authors: article.authors,
        source: article.source,
        pubyear: article.pubyear,
        doi: article.doi,
        claim: article.claim,
        evidence: article.evidence,
      })),
    },
  };
};

export default Articles;
