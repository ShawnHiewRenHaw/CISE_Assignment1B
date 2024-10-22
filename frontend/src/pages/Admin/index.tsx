import { NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";
<<<<<<< Updated upstream
=======
import React from "react";
>>>>>>> Stashed changes

interface UserInterface {
  id: string;
  name: string;
  email: string;
}

interface ArticleInterface {
  id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim: string;
  evidence: string;
  status: string;
  research: string;
  participant: string;
}

const AdminPage: NextPage = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and articles
  const fetchData = async () => {
    try {
      const userResponse = await fetch('/api/users');
      const articleResponse = await fetch('/api/articles');

      if (!userResponse.ok || !articleResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await userResponse.json();
      const articlesData = await articleResponse.json();

      if (Array.isArray(usersData) && Array.isArray(articlesData)) {
        setUsers(usersData.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
        })));

        const approvedArticles = articlesData.filter((article: any) => article.status === 'approved');
        setArticles(approvedArticles.map((article: any) => ({
          id: article._id,
          title: article.title,
          authors: article.authors,
          source: article.source,
          pubyear: article.pubyear,
          doi: article.doi,
          claim: article.claim,
          evidence: article.evidence,
          status: article.status,
          research: article.research,
          participant: article.participant,
        })));
      } else {
        setError("No data found.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Admin Page</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Users</h2>
      <SortableTable
        headers={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
        ]}
        data={users.map((user) => ({
          ...user,
          // You can add more actions for user management here
          actions: <button>Edit</button>, // Example action
        }))}
      />

      <h2>Approved Articles</h2>
      <SortableTable
        headers={[
          { key: "title", label: "Title" },
          { key: "authors", label: "Authors" },
          { key: "source", label: "Source" },
          { key: "pubyear", label: "Publication Year" },
          { key: "doi", label: "DOI" },
          { key: "claim", label: "Claim" },
          { key: "evidence", label: "Evidence" },
          { key: "research", label: "Research Type" },
          { key: "participant", label: "Participant Type" },
        ]}
        data={articles.map((article) => ({
          ...article,
          // You can add more actions for article management here
          actions: <button>Edit</button>, // Example action
        }))}
      />
    </div>
  );
};

export default AdminPage;
