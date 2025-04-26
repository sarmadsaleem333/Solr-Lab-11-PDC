import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState({ author: [], title: [] });
  const [darkMode, setDarkMode] = useState(true); // Only dark mode enabled

  useEffect(() => {
    if (author || title || category) {
      const queryParams = [];

      if (author) queryParams.push(`author:${author}`);
      if (title) queryParams.push(`title:${title}`);
      if (category) queryParams.push(`category:${category}`);

      const query = queryParams.join(" AND ");

      axios
        .get(`http://localhost:5000/search?q=${query}`)
        .then((res) => setResults(res.data.response.docs))
        .catch((err) => console.error(err));
    }
  }, [author, title, category]);

  const fetchSuggestions = async (field, value) => {
    if (!value) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/suggestions?q=${value}&field=${field}`
      );
      setSuggestions((prev) => ({
        ...prev,
        [field]: res.data.suggestions || [],
      }));
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const currentTheme = darkMode ? darkTheme : 0;

  // Predefined authors for the select dropdown
  const predefinedAuthors = [
    "Kevin Yang",
    "James Cook",
    "Roger Goodwill",
    "Steven Thomas",
    "Evan Swing",
  ];

  return (
    <div style={currentTheme.appContainer}>
      <div style={currentTheme.header}>
        <h2>MSS Search</h2>
      </div>

      <div style={currentTheme.inputContainer}>
        {/* Author Dropdown */}
        <div style={currentTheme.inputWrapper}>
          <select
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              fetchSuggestions("author", e.target.value);
            }}
            style={currentTheme.input}
          >
            <option value="">Select Author</option>
            {predefinedAuthors.map((authorName, i) => (
              <option key={i} value={authorName}>
                {authorName}
              </option>
            ))}
          </select>
          <SearchIcon />
        </div>

        {/* Title Input */}
        <div style={currentTheme.inputWrapper}>
          <input
            type="text"
            placeholder="Search by title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              fetchSuggestions("title", e.target.value);
            }}
            style={currentTheme.input}
          />
          {suggestions.title.length > 0 && (
            <div style={currentTheme.suggestionBox}>
              {suggestions.title.map((s, i) => (
                <div
                  key={i}
                  style={currentTheme.suggestionItem}
                  onClick={() => setTitle(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
          <SearchIcon />
        </div>

        {/* Category Dropdown */}
        <div style={currentTheme.inputWrapper}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={currentTheme.input}
          >
            <option value="">Select Category</option>
            <option value="java">Java</option>
            <option value="solr">Solr</option>
          </select>
          <SearchIcon />
        </div>
      </div>

      {/* Search Results */}
      <div style={currentTheme.resultsContainer}>
        {results.length === 0 ? (
          <div style={currentTheme.noResults}>No results found</div>
        ) : (
          results.map((doc, i) => (
            <div key={i} style={currentTheme.resultCard}>
              <h3 style={currentTheme.resultTitle}>
                {doc.title && doc.title[0]}
              </h3>
              <p>
                <strong>Author:</strong>{" "}
                {doc.author ? doc.author.join(", ") : "Unknown"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {doc.category ? doc.category.join(", ") : "Uncategorized"}
              </p>
              <p>
                <strong>Published:</strong> {doc.published ? "Yes" : "No"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer style={currentTheme.footer}>
        <p>© MSS Developers 2025</p>
      </footer>
    </div>
  );
}

// Icon component
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    style={iconStyle}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 18a7 7 0 100-14 7 7 0 000 14zm0 0l7 7"
    />
  </svg>
);

// Dark Theme
const darkTheme = {
  appContainer: {
    backgroundColor: "#121212",
    color: "#eaeaea",
    fontFamily: "'Roboto', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#bb86fc",
    color: "#121212",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  inputContainer: {
    marginBottom: "40px",
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #444",
    borderRadius: "5px",
    fontSize: "16px",
    backgroundColor: "#1e1e1e",
    color: "#eaeaea",
    outline: "none",
  },
  suggestionBox: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#1e1e1e",
    border: "1px solid #555",
    maxHeight: "150px",
    overflowY: "auto",
    zIndex: 999,
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #333",
    backgroundColor: "#1e1e1e",
    color: "#eaeaea",
  },
  resultsContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
  },
  resultCard: {
    backgroundColor: "#222",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  resultTitle: {
    fontSize: "1.5rem",
    color: "#bb86fc",
    marginBottom: "10px",
  },
  noResults: {
    textAlign: "center",
    fontSize: "18px",
    color: "#aaa",
  },
  footer: {
    position: "fixed",
    bottom: "0",
    width: "100%",
    textAlign: "center",
    padding: "10px 0",
    backgroundColor: "#121212",
    color: "#eaeaea",
  },
};

// Search icon style
const iconStyle = {
  position: "absolute",
  top: "50%",
  right: "15px",
  transform: "translateY(-50%)",
  color: "#aaa",
};

export default App;
