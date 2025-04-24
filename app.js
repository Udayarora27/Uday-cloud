const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./users");

const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static("public"));

// Parse incoming request bodies (IMPORTANT!)
app.use(bodyParser.json());                        // For JSON payloads
app.use(express.urlencoded({ extended: true }));   // For HTML form submissions

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/team", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "team.html"));
});

app.get("/join", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "join.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Mount the authentication routes (for POST /signup, /login)
app.use(authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`UDAY Cloud is running at http://localhost:${PORT}`);
});
