require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');

const authRouter = require("./Register_Login/route/authRoute")
const googleSignInRouter = require("./Google_SignIn_Using_MySQL/route/googleSignInRoute")
const shortUrlRouter = require("./createShortenUrl/route/analysisRoute")
const swaggerDocs = require('./swagger');
const app = express();

// database
require("./Google_SignIn_Using_MySQL/Database/conn")

// Middleware
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/auth/google",googleSignInRouter)
app.use("/api", shortUrlRouter)


app.get("/", (req, res) => {
  res.send("Welcome to file ..........");
});

// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  swaggerDocs(app,port)
});

/*
Render deploy:
=============
backend url: https://google-authentication-redirectshorturl-voed.onrender.com/
frontend url: https://frontend-a0qx.onrender.com/
*/