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
  const [ratings, setRatings] = useState<Record<string, number | string>>({}); // Track ratings by article ID

  const headers: { key: keyof ArticlesInterface | 'rating'; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "rating", label: "Rating" }, // New Rating column
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
  ];

  const handleRatingChange = (articleId: string, rating: string) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [articleId]: rating, // Isolate ratings by article ID
    }));
  };

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

      {/* Sortable table with filtered articles and rating column */}
      <SortableTable
        headers={headers}
        data={filteredArticles.map((article) => ({
          ...article,
          // Attach the rating dropdown specific to each article
          rating: (
            <select
              onChange={(e) => handleRatingChange(article.id, e.target.value)}
              value={ratings[article.id] || ""} // Ensure each article has its unique rating
              style={{ padding: '5px' }}
            >
              <option value="">Rate</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star} ⭐</option>
              ))}
            </select>
          )
        }))}
        rowKey={(article) => article.id} // Ensure each row has a unique key based on article ID
      />
    </div>
  );
};

// Fetch data from the NestJS backend
export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3001/articles'); // Ensure the URL is correct
  const articles = await res.json();

  console.log("Fetched Articles:", articles); // Log the fetched data for debugging

  return {
    props: {
      articles: Array.isArray(articles) 
        ? articles.map((article: any) => ({
            id: article._id || null,  // Ensure each article has an id
            title: article.title,
            authors: article.authors,
            source: article.source,
            pubyear: article.pubyear,
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
          }))
        : [], // If articles is not an array, fallback to an empty array
    },
  };
};

export default Articles;
