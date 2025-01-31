
const conn = require("../../Register_Login/Database/conn");

const analysisTopic = async (req, res) => {
    const { topic } = req.params;
  
    // Fetch all URLs under the given topic from DB
    const topicAnalytics = await getTopicAnalytics(topic);
    
    if (topicAnalytics.length === 0) {
        return res.status(404).json({ message: "No data found for this topic" });
    }
    res.json(topicAnalytics);
  };
  
  async function getTopicAnalytics(topic) {
    try {
        // Query to fetch all URLs under the given topic
        const [topicResults] = await conn.promise().query(
            `SELECT s.shortUrl, 
                    COUNT(a.id) AS clickCount,
                    COUNT(DISTINCT a.ipAddress) AS uniqueUsers
             FROM shortUrl s
             LEFT JOIN analytics a ON s.shortUrl = a.shortUrl
             WHERE s.topic = ?
             GROUP BY s.shortUrl`,
            [topic]
        );
        console.log("Topic Analytics Results:", topicResults);
        
        // Return the results as an array of objects
        return topicResults;
    } catch (err) {
        console.error("Error retrieving topic analytics:", err);
        throw new Error("Error retrieving topic analytics");
    }
}

  
  module.exports = {
    analysisTopic
  }