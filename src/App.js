import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div style={darkMode ? darkTheme.appContainer : lightTheme.appContainer}>
      <div style={darkMode ? darkTheme.header : lightTheme.header}>
        <h2>Solr Book Search</h2>
        <button
          onClick={toggleTheme}
          style={darkMode ? darkTheme.button : lightTheme.button}
        >
          Toggle Theme
        </button>
      </div>

      <div
        style={darkMode ? darkTheme.inputContainer : lightTheme.inputContainer}
      >
        <div
          style={darkMode ? darkTheme.inputWrapper : lightTheme.inputWrapper}
        >
          <input
            type="text"
            placeholder="Search by author..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={darkMode ? darkTheme.input : lightTheme.input}
          />
          <SearchIcon />
        </div>
        <div
          style={darkMode ? darkTheme.inputWrapper : lightTheme.inputWrapper}
        >
          <input
            type="text"
            placeholder="Search by title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={darkMode ? darkTheme.input : lightTheme.input}
          />
          <SearchIcon />
        </div>
        <div
          style={darkMode ? darkTheme.inputWrapper : lightTheme.inputWrapper}
        >
          <input
            type="text"
            placeholder="Search by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={darkMode ? darkTheme.input : lightTheme.input}
          />
          <SearchIcon />
        </div>
      </div>

      <div
        style={
          darkMode ? darkTheme.resultsContainer : lightTheme.resultsContainer
        }
      >
        {results.length === 0 && (
          <div style={darkMode ? darkTheme.noResults : lightTheme.noResults}>
            No results found
          </div>
        )}
        {results.map((doc, i) => (
          <div
            key={i}
            style={darkMode ? darkTheme.resultCard : lightTheme.resultCard}
          >
            <h3
              style={darkMode ? darkTheme.resultTitle : lightTheme.resultTitle}
            >
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
        ))}
      </div>
    </div>
  );
}

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

// Light Theme Styles
const lightTheme = {
  appContainer: {
    backgroundColor: "#f7f9fc",
    color: "#333",
    fontFamily: "'Roboto', sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
  },
  inputContainer: {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: "15px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "14px 20px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
    transition: "0.3s ease",
  },
  resultsContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "1fr 1fr 1fr",
    justifyContent: "center",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition:
      "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      background: "linear-gradient(135deg, #007bff, #00c6ff)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
      transform: "scale(1.05)",
    },
  },
  resultTitle: {
    color: "#0056b3",
    fontSize: "1.6rem",
    marginBottom: "10px",
  },
  noResults: {
    textAlign: "center",
    fontSize: "18px",
    color: "#888",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "15px",
    marginTop: "40px",
    width: "100%",
  },
  footerText: {
    fontSize: "14px",
    margin: "0",
  },
};

// Dark Theme Styles
const darkTheme = {
  appContainer: {
    backgroundColor: "#121212",
    color: "#eaeaea",
    fontFamily: "'Roboto', sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#6200ea",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
  },
  inputContainer: {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: "15px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "14px 20px",
    margin: "10px 0",
    border: "1px solid #444",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#333",
    color: "#eaeaea",
    transition: "0.3s ease",
  },
  resultsContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "1fr 1fr 1fr",
    justifyContent: "center",
  },
  resultCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    transition:
      "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      background: "linear-gradient(135deg, #6200ea, #bb86fc)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
      transform: "scale(1.05)",
    },
  },
  resultTitle: {
    color: "#bb86fc",
    fontSize: "1.6rem",
    marginBottom: "10px",
  },
  noResults: {
    textAlign: "center",
    fontSize: "18px",
    color: "#aaa",
  },
  footer: {
    backgroundColor: "#333",
    color: "#eaeaea",
    textAlign: "center",
    padding: "15px",
    marginTop: "40px",
    width: "100%",
  },
  footerText: {
    fontSize: "14px",
    margin: "0",
  },
};

// Icon style for the search SVG
const iconStyle = {
  position: "absolute",
  top: "50%",
  right: "10px",
  transform: "translateY(-50%)",
  color: "#007bff",
  fontSize: "18px",
};

export default App;
