import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import SortableTable from "../../components/table/SortableTable";
//Commented to use articles from MongoDB instead
//import data from "../../utils/dummydata";
import React, { useState, useEffect } from 'react';
import { client } from '../../utils/mongo'; // Assuming you exported client from mongo.js


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

//Fetch database JSON from MongoDB
function DatabaseFetch() {
  const [data, setData] = useState([]);
    

  useEffect(() => {
    const fetchData = async () => {
      const db = client.db("BackendTesting");
      const collection = db.collection("Books");
      const result = await collection.find({}).toArray();
      setData(result);
    };

    if (client.isConnected()) {
      fetchData();
    } else {
      // Handle the case where the connection is not established yet
      console.log("Connecting to MongoDB...");
    }
  }, [client]);

  // ... rest of your component logic using the data state

  return useEffect;
}

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

// Static Props fetching
export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
  //Fetch MongoDB data
  const data = DatabaseFetch();

  // Map the data to ensure all articles have consistent property names
  const articles = data.map((article : ArticlesInterface) => ({
    id: article.id ?? article.id,
    title: article.title,
    authors: article.authors,
    source: article.source,
    pubyear: article.pubyear,
    doi: article.doi,
    claim: article.claim,
    evidence: article.evidence,
  }));

  return {
    props: {
      articles,
    },
  };
};

export default Articles;
