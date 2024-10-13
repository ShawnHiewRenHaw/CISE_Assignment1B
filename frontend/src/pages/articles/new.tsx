import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";

const NewDiscussion = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState<number | "">("");
  const [doi, setDoi] = useState("");
  const [summary, setSummary] = useState("");
  const [linkedDiscussion, setLinkedDiscussion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newArticle = {
      title,
      authors: authors.filter(author => author.trim() !== ""),
      source: source.trim() || undefined,
      pubyear: pubYear || undefined,
      doi: doi.trim() || undefined,
      claim: summary.trim() || undefined, // Use summary as claim
      status: "pending", // Ensure status is pending
    };

    try {
      const res = await fetch("http://localhost:3001/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });

      if (res.ok) {
        setSuccess(true);
        setTitle("");
        setAuthors([]);
        setSource("");
        setPubYear("");
        setDoi("");
        setSummary("");
        setLinkedDiscussion("");
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to submit article");
      }
    } catch (err) {
      setError("Failed to submit article. Please try again.");
    }
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const changeAuthor = (index: number, value: string) => {
    setAuthors(
      authors.map((oldValue, i) => {
        return index === i ? value : oldValue;
      })
    );
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <h1>New Article</h1>
        {success && <p style={{ color: "green" }}>Article submitted successfully and is now pending approval.</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className={formStyles.form} onSubmit={submitNewArticle}>
          <label htmlFor="title">Title:</label>
          <input
            className={formStyles.formItem}
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="author">Authors (optional):</label>
          {authors.map((author, index) => (
            <div key={`author ${index}`} className={formStyles.arrayItem}>
              <input
                type="text"
                name="author"
                value={author}
                onChange={(event) => changeAuthor(index, event.target.value)}
                className={formStyles.formItem}
              />
              <button
                onClick={() => removeAuthor(index)}
                className={formStyles.buttonItem}
                style={{ marginLeft: "3rem" }}
                type="button"
              >
                -
              </button>
            </div>
          ))}
          <button
            onClick={addAuthor}
            className={formStyles.buttonItem}
            style={{ marginLeft: "auto" }}
            type="button"
          >
            +
          </button>

          <label htmlFor="source">Source (optional):</label>
          <input
            className={formStyles.formItem}
            type="text"
            name="source"
            id="source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />

          <label htmlFor="pubYear">Publication Year (optional):</label>
          <input
            className={formStyles.formItem}
            type="number"
            name="pubYear"
            id="pubYear"
            value={pubYear === "" ? "" : pubYear}
            onChange={(event) => {
              const val = event.target.value;
              setPubYear(val === "" ? "" : parseInt(val));
            }}
          />

          <label htmlFor="doi">DOI (optional):</label>
          <input
            className={formStyles.formItem}
            type="text"
            name="doi"
            id="doi"
            value={doi}
            onChange={(event) => setDoi(event.target.value)}
          />

          <label htmlFor="summary">Summary (optional):</label>
          <textarea
            className={formStyles.formTextArea}
            name="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />

          <button className={formStyles.formItem} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussion;
