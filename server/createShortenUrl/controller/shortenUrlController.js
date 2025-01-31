const conn = require("../../Register_Login/Database/conn");
const useragent = require("express-useragent"); // for parsing user agent string
const requestIp = require("request-ip"); // to capture the user's IP address

// function to generate a random short alias
function generateShortAlias() {
  let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let alias = "";
  for (let i = 0; i < 6; i++) {
    alias = alias + text.charAt(Math.floor(Math.random() * text.length));
  }
  return alias;
}
console.log("shortAlias:", generateShortAlias());

// Create shorten URL
const shortenURL = async (req, res) => {
  const { longUrl, customAlias, topic, expiryTime } = req.body;
  console.log("req:", req.body); 

  // generate expiry date if provided
  let expiryDate = null;
  if (expiryTime) {
    const currentTime = new Date();
    console.log("Current Time:", currentTime);
    expiryDate = new Date(currentTime.getTime() + expiryTime * 60000);
    console.log("Calculated Expiry Date (UTC):", expiryDate.toISOString());
    expiryDate = expiryDate.toISOString().slice(0, 19).replace("T", " ");
    console.log("Inserting into DB - Expiry Date:", expiryDate);
  }

  // generate a random alias if customAlias is not provided
  const alias = customAlias || generateShortAlias();
  const shortUrl = `https://short.ly/${alias}`;

  // Insert the new URL into the database
  try {
    const sql =
      "INSERT INTO shortUrl(longUrl, shortUrl, customAlias, topic, expiryDate) VALUES(?, ?, ?, ?, ?)";

    // Insert the random alias into the `customAlias` field if no customAlias is provided
    conn.query(
      sql,
      [longUrl, shortUrl, alias, topic, expiryDate],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ msg: "Error in creating shortened URL", err: err.message });
        }
        res.status(201).json({
          result,
          shortUrl: shortUrl,
          createdAt: new Date().toISOString(),
        });
      }
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Error in creating shortened URL", err: err.message });
  }
};

// ==================================================================================
// Redirect to long URL (when press short url)
const redirectToLongUrl = (req, res) => {
  const alias = req.params.alias; // Get the alias from the URL parameter
  console.log("alias:", alias);

  // Get the original long URL using the alias
  const sql = "SELECT longUrl,expiryDate FROM shortUrl WHERE customAlias=?";
  conn.query(sql, [alias], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error retrieving URL" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "Short URL not found" });
    }

    const longUrl = result[0].longUrl;
    const expiryDate = result[0].expiryDate;
    // Log the expiry date
    console.log("Retrieved Expiry Date from DB:", expiryDate);
    // Convert both the current date and expiry date to UTC for proper comparison
    if (expiryDate) {
      // Convert both the current date and expiry date to Date objects for comparison
      const currentTimeUTC = new Date(); // Current time in UTC
      const expiryDateUTC = new Date(expiryDate).getTime(); // Expiry date from DB

      console.log("Current Time in UTC:", currentTimeUTC);
      console.log("Expiry Date in UTC:", expiryDateUTC);
      console.log(
        "Is expired:",
        new Date(currentTimeUTC) > new Date(expiryDateUTC)
      );
      // check if the url has expired
      if (currentTimeUTC > expiryDateUTC) {
        return res.status(410).json({ msg: "This URL has expired" });
      }
    }

    // Log user details separately (without affecting the redirection)
    createUserDetails(alias, req);
    // Redirect to the long URL
    return res.redirect(longUrl);
  });
};

// ====================================================================================
// insert all the user details(ipAddress,deviceType,osType,....)

const createUserDetails = (alias, req) => {
  // Parse user agent and IP address
  const userAgent = req.headers["user-agent"];
  const ipAddress = requestIp.getClientIp(req);

  // Use the `express-useragent` library to parse device and OS type
  const parsedAgent = useragent.parse(userAgent);
  const deviceType = parsedAgent.device || "Unknown"; // Device (e.g., mobile, desktop)
  const osType = parsedAgent.os || "Unknown"; // OS (e.g., Windows, iOS)

  const shortUrl = `https://short.ly/${alias}`; // Full short URL

  // Insert analytics data into the database
  const insertAnalyticsSql = `
    INSERT INTO analytics (shortUrl, userAgent, ipAddress, deviceType, osType)
    VALUES (?, ?, ?, ?, ?)`;

  conn.query(
    insertAnalyticsSql,
    [shortUrl, userAgent, ipAddress, deviceType, osType],
    (err, analyticsResult) => {
      if (err) {
        console.log("Error logging analytics:", err);
      } else {
        console.log("Analytics logged successfully");
      }
    }
  );
};
// ====================================================================================================================
// get all the user details(ipAddress,deviceType,osType,....)
const analyseUserDetails = (req, res) => {
  const alias = req.params.alias; // Get the alias from the URL parameter
  console.log("alias:", alias);

  // Parse user agent and IP address
  const userAgent = req.headers["user-agent"];
  const ipAddress = requestIp.getClientIp(req);

  // Use the `express-useragent` library to parse device and OS type
  const parsedAgent = useragent.parse(userAgent);
  const deviceType = parsedAgent.device || "Unknown"; // Device (e.g., mobile, desktop)
  const osType = parsedAgent.os || "Unknown"; // OS (e.g., Windows, iOS)

  // SQL to get the original long URL using the alias
  const sql = "SELECT longUrl FROM shortUrl WHERE customAlias=?";

  conn.query(sql, [alias], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error retrieving URL" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "Short URL not found" });
    }

    const longUrl = result[0].longUrl;

    // Full short URL (e.g., https://short.ly/custom123)
    const shortUrl = `https://short.ly/${alias}`;
    
    // Log analytics data separately (without affecting the redirection)
    createUserDetails(alias, req);

    // Send a response indicating the details of the analytics (optional)
    return res.status(200).json({
      msg: "User details logged successfully",
      analytics: {
        shortUrl,
        userAgent,
        ipAddress,
        deviceType,
        osType,
      },
    });
  });
};

// Get analytics for a specific alias (short URL)
const getAnalytics = (req, res) => {
  const alias = req.params.alias;

  const sql = "SELECT * FROM analytics WHERE shortUrl = ?";
  conn.query(sql, [`https://short.ly/${alias}`], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error retrieving analytics" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "No analytics data found" });
    }

    return res.status(200).json({ analytics: result });
  });
};

module.exports = {
  shortenURL,
  redirectToLongUrl,
  analyseUserDetails,
  getAnalytics,
};
