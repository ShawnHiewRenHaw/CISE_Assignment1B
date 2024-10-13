import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import formStyles from "../../styles/Form.module.scss"; 

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string[];
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
        className={formStyles.formItem} // Use form styles for consistency
        style={{
          marginBottom: "1em",
          width: "100%",
          maxWidth: "30em", // Optional: limit the width
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
          className={formStyles.formItem} // Consistent styling for the select
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
              className={formStyles.formItem} // Consistent styling for rating dropdown
              style={{ padding: '5px' }}
            >
              <option value="">Rate</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star} ⭐</option>
              ))}
            </select>
          )
        }))}
      />
    </div>
  );
};

// Fetch data from the NestJS backend
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3001/articles');
  const articles = await res.json();

  // Filter to only include approved articles
  const approvedArticles = articles.filter((article: any) => article.status === "approved");

  return {
    props: {
      articles: Array.isArray(approvedArticles) 
        ? approvedArticles.map((article: any) => ({
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
