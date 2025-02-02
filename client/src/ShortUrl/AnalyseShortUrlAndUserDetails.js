import React, { useState } from "react";
import axios from "axios";
import UserClickDetails from "./UserClickDetails";

const createShortUrl = "https://google-authentication-redirectshorturl-voed.onrender.com/api/createShortUrl";

const ShortUrlAndAnalytics = () => {
  // States for creating short URL
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(""); // State to store the shortened URL
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [error, setError] = useState("");

  // States for analytics
  const [data, setData] = useState([]);
  const [alias, setAlias] = useState(""); // Alias is used for fetching analytics
  const [loading, setLoading] = useState(false); // Track loading state for analytics

  // Fetch analytics based on alias
  const fetchAnalytics = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("googleAuthToken");
    console.log("getToken:", localStorage.getItem("googleAuthToken"));

    if (!token) {
      setError("Google token not found.");
      return;
    }

    if (!alias) {
      setError("Please enter a valid alias.");
      return;
    }
    setError(""); // Clear any previous errors
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://google-authentication-redirectshorturl-voed.onrender.com/api/getAnalytics/${alias}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );
      if (response.data && response.data.analytics) {
        setData(response.data.analytics); // Store the fetched data
      } else {
        setData([]); // Clear data if no analytics found
        setError("No analytics data available.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false); // Stop loading in case of error
      console.error("Error fetching analytics:", err);
      setError("Error fetching analytics data.");
    }
  };

  // Submit form for creating short URL
  const submitForm = async (e) => {
    e.preventDefault();

    // Form validation: Ensure all fields are filled
    if (!longUrl) {
      setError("Enter long url");
      return;
    }

    // Validate expiry time (must be a number and at least 1 minute)
    if (expiryTime && (isNaN(expiryTime) || expiryTime <= 0)) {
      setError("Expiry time must be a positive number.");
      return;
    }

    // Set default expiry time if not provided (e.g., 1440 minutes = 1 day)
    if (!expiryTime) {
      setExpiryTime(1440); // Default to 1 day
    }

    try {
      const response = await axios.post(createShortUrl, {
        longUrl,
        customAlias,
        topic,
        expiryTime: parseInt(expiryTime, 10), // Ensure expiryTime is an integer
      });

      const alias = response.data.shortUrl.split("/").pop(); // Extract alias from the response
      const redirectUrl = `https://google-authentication-redirectshorturl-voed.onrender.com/api/redirectLongUrl/${alias}`;

      // Set the generated shortUrl from the backend response
      setShortUrl(redirectUrl);
      setError(""); // Clear any error messages
      setAlias(alias); // Store the alias
    } catch (err) {
      setError("Error creating shortened URL.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3>Create Short URL</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={submitForm}>
            <div className="mb-3">
              <label htmlFor="long-url" className="form-label">
                Long URL
              </label>
              <input
                type="text"
                className="form-control"
                id="long-url"
                name="longUrl"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="custom-alias" className="form-label">
                Custom Alias
              </label>
              <input
                type="text"
                className="form-control"
                id="custom-alias"
                name="customAlias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="topic" className="form-label">
                Topic
              </label>
              <input
                type="text"
                className="form-control"
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="expiry" className="form-label">
                Expiry Time (in minutes)
              </label>
              <input
                type="number"
                className="form-control"
                id="expiry"
                name="expiryTime"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                placeholder="Optional: Enter expiry time / (e.g. 1440 for 1 day)"
              />
            </div>

            <div>
              {/* Display the shortened URL if it is generated */}
              {shortUrl && (
                <div>
                  <h4>Shortened URL:</h4>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    {shortUrl}
                  </a>
                  <p>(press this shortUrl)</p>
                  {/* Alias will only show if the shortUrl is available */}
                  <p>
                    Alias: <strong>{alias}</strong>
                  </p>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary mx-3">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h3>View Analytics for Your Shortened URL</h3>
          <form onSubmit={fetchAnalytics}>
            <div className="mb-3">
              <label htmlFor="alias" className="form-label">
                Alias
              </label>
              <input
                type="text"
                className="form-control"
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter short URL alias"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Fetching..." : "Fetch Analytics"}
            </button>
          </form>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Display Analytics Data */}
        {data.length > 0 ? (
          <div>
            <h4>Analytics for {alias}</h4>
            <table className="table table-striped-columns w-100">
              <thead>
                <tr>
                  <th>Short URL</th>
                  <th>User-Agent</th>
                  <th>IP Address</th>
                  <th>Device Type</th>
                  <th>OS Type</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.shortUrl}</td>
                    <td>{item.userAgent}</td>
                    <td>{item.ipAddress}</td>
                    <td>{item.deviceType}</td>
                    <td>{item.osType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No analytics data available.</p>
        )}
      </div>
      {/*Topic section*/}
      <UserClickDetails
        topic={topic}
        setTopic={setTopic}
        error={error}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ShortUrlAndAnalytics;
