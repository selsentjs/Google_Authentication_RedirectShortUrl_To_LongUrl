import React, { useState } from "react";
import axios from "axios";

const UserClickDetails = ({
  topic,
  setTopic,
  error,
  setError,
  loading,
  setLoading,
}) => {
  const [topicAnalytics, setTopicAnalytics] = useState([]);

  const fetchTopicAnalytics = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("googleAuthToken");

    if (!token) {
      setError("Google token not found.");
      return;
    }

    if (!topic) {
      setError("Please enter a valid topic.");
      return;
    }

    setError(""); // Clear any previous errors
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `http://localhost:3000/api/analytics/topic/${topic}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );
      if (response.data) {
        setTopicAnalytics(response.data); // Store the topic analytics data
      } else {
        setTopicAnalytics([]); // Clear data if no analytics found
        setError("No topic analytics data available.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false); // Stop loading in case of error
      console.error("Error fetching topic analytics:", err);
      setError("Error fetching topic analytics data.");
    }
  };

  return (
    <>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h3>View Topic Analytics</h3>
          <form onSubmit={fetchTopicAnalytics}>
            <div className="mb-3">
              <label htmlFor="topic" className="form-label">
                Topic
              </label>
              <input
                type="text"
                className="form-control"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Fetching..." : "Fetch Topic Analytics"}
            </button>
          </form>
        </div>
      </div>

      {/* Display Topic Analytics Data */}
      {topicAnalytics.length > 0 ? (
        <div>
          <h4>Topic Analytics for "{topic}"</h4>
          <table className="table table-striped-columns w-100">
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Click Count</th>
                <th>Unique Users</th>
              </tr>
            </thead>
            <tbody>
              {topicAnalytics.map((item, index) => (
                <tr key={index}>
                  <td>{item.shortUrl}</td>
                  <td>{item.clickCount}</td>
                  <td>{item.uniqueUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No topic analytics data available.</p>
      )}
    </>
  );
};

export default UserClickDetails;
