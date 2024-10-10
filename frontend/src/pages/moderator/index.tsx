import { useEffect, useState } from "react";

interface Article {
  _id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi: string;
  summary: string;
  status: string;
}

const ModeratorPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pending articles on page load
  useEffect(() => {
    fetchPendingArticles();
  }, []);

  // Function to fetch pending articles
  const fetchPendingArticles = async () => {
    try {
      const res = await fetch('http://localhost:3001/articles/pending');
      if (!res.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to update article status (approve/reject)
  const updateArticleStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/articles/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        // Re-fetch pending articles after successful update
        fetchPendingArticles();
      } else {
        throw new Error('Failed to update article status');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Moderator Panel</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {articles.length === 0 ? (
        <p>No pending articles to review</p>
      ) : (
        <table style={{ width: '100%', border: '1px solid #ddd', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Source</th>
              <th>Publication Year</th>
              <th>DOI</th>
              <th>Summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.authors.join(', ')}</td>
                <td>{article.source}</td>
                <td>{article.pubyear}</td>
                <td>{article.doi}</td>
                <td>{article.summary}</td>
                <td>
                  <button
                    style={{ marginRight: '10px' }}
                    onClick={() => updateArticleStatus(article._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={() => updateArticleStatus(article._id, 'rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModeratorPage;
