require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();

// database
require("./Google_SignIn_Using_MySQL/Database/conn")

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to file ..........");
});

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
