import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";
import formStyles from "../../styles/Form.module.scss";

interface ArticlesInterface {
  rating: any;
  id: string;
  title: string;
  authors: string[];
  source: string | null; // Changed to allow null
  pubyear: number | null; // Changed to allow null
  doi: string | null; // Changed to allow null
  claim: string | null; // Changed to allow null
  evidence: string | null; // Changed to allow null
  research: string | null; // Changed to allow null
  participant: string | null; // Changed to allow null
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const claimsOptions = [
  { value: "code quality improvement", label: "Code Quality Improvement" },
  { value: "product quality improvement", label: "Product Quality Improvement" },
];

const sePracticesOptions = [
  { value: "practice1", label: "SE Practice 1" },
  { value: "practice2", label: "SE Practice 2" },
  { value: "practice3", label: "SE Practice 3" },
  // Add more practices as needed
];

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number | string>>({});
  const [columnVisibility, setColumnVisibility] = useState<boolean[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const headers: { key: keyof ArticlesInterface | 'rating'; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "rating", label: "Rating" }, // New Rating column
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
    { key: "research", label: "Research" },
    { key: "participant", label: "Participant" },
  ];

  // Initialize columnVisibility based on headers
  useEffect(() => {
    if (columnVisibility.length === 0) {
      setColumnVisibility(Array(headers.length).fill(true)); // Set all columns visible by default
    }
  }, [columnVisibility.length]);

  const handleRatingChange = (articleId: string, rating: string) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [articleId]: rating, // Isolate ratings by article ID
    }));
  };

  // Filter articles based on the selected claim, practice, and search query
  const filteredArticles = articles.filter((article) => {
    const matchesSearchQuery = Object.keys(article).some((key) => {
      const value = article[key as keyof ArticlesInterface];
      return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    const matchesClaim = selectedClaim ? article.claim === selectedClaim : true;
    const matchesPractice = selectedPractice ? article.evidence?.toLowerCase().includes(selectedPractice.toLowerCase()) : true;

    return matchesSearchQuery && matchesClaim && matchesPractice;
  });

  // Toggle column visibility
  const toggleColumn = (index: number) => {
    setColumnVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index]; // Toggle visibility
      return newVisibility;
    });
  };

  return (
    <main id="main">
      <h1 className="projectName">Articles Index Page</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={formStyles.formItem}
        style={{ marginBottom: "1em", width: "100%", maxWidth: "30em" }}
      />

      {/* Claim Dropdown */}
      <label htmlFor="claim">Select Claim:</label>
      <select
        id="claim"
        value={selectedClaim || ""}
        onChange={(e) => setSelectedClaim(e.target.value || null)}
        className={formStyles.formItem}
      >
        <option value="">All Claims</option>
        {claimsOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {/* SE Practices Dropdown */}
      <label htmlFor="sePractices">Select SE Practice:</label>
      <select
        id="sePractices"
        value={selectedPractice || ""}
        onChange={(e) => setSelectedPractice(e.target.value || null)}
        className={formStyles.formItem}
      >
        <option value="">All Practices</option>
        {sePracticesOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {/* Column Visibility Checkboxes */}
      <div className={formStyles.columnVisibility}>
        <h2>Hide Columns</h2>
        {headers.map((header, index) => (
          <div key={header.key}>
            <input
              type="checkbox"
              checked={columnVisibility[index]}
              onChange={() => toggleColumn(index)}
            />
            <label>{header.label}</label>
          </div>
        ))}
      </div>

      {/* Sortable table with filtered articles and rating column */}
      <SortableTable
        headers={headers.filter((_, index) => columnVisibility[index])}
        data={filteredArticles.map((article) => ({
          ...article,
          rating: (
            <div>
              <div style={{ marginBottom: '0.5em' }}>
                <strong>Average Rating:</strong>
                <span style={{ color: 'gold' }}>
                  {/* Safely access article.rating and use fallback values */}
                  {article?.rating?.average?.toFixed(2) ?? 'N/A'} ⭐
                </span>
                ({article?.rating?.count ?? 0} ratings)
              </div>
              <div>
                <select
                  onChange={(e) => handleRatingChange(article.id, e.target.value)} // Pass value as a string
                  value={ratings[article.id] || ""}
                  className={formStyles?.formItem || ""}
                  style={{ padding: '5px', width: '100%' }}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star.toString()}>{star} ⭐</option> // Ensure value is string
                  ))}
                </select>
              </div>
            </div>
          ),
        }))}
      />
    </main>
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
          id: article._id || null,
          title: article.title || null,
          authors: article.authors || [],
          source: article.source || null,
          pubyear: article.pubyear || null,
          doi: article.doi || null,
          claim: article.claim || null,
          evidence: article.evidence || null,
          research: article.research || null,
          participant: article.participant || null,
          rating: article.rating || { average: 0, count: 0 },
        }))
        : [],
    },
  };
};

export default Articles;
