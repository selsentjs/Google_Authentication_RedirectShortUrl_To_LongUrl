const conn = require("../../Register_Login/Database/conn");

const getUrlAnalyticsAPI = async (req, res) => {
  const  alias  = req.params.alias;
  const shortUrl = `https://short.ly/${alias}`;

  // Fetch the analytics for the given alias from db
  const analytics = await getAnalyticsForAlias(shortUrl);

  if (!analytics) {
    return res.status(404).json({ message: "Alias not found" });
  }

  res.json({
    totalClicks: analytics.totalClicks,
    uniqueUsers: analytics.uniqueUsers,
    clicksByDate: analytics.clicksByDate,
    osType: analytics.osType,
    deviceType: analytics.deviceType,
  });
};

async function getAnalyticsForAlias(shortUrl) {
  console.log('Fetching analytics for alias:', shortUrl);
  try {
    // get total clicks
    const [totalClicksResult] = await conn.promise().query(
      "SELECT COUNT(*) AS totalClicks FROM analytics WHERE shortUrl = ?",
      [shortUrl]
    );
    console.log('Total Clicks Result:', totalClicksResult);
    const totalClicks = totalClicksResult[0] ? totalClicksResult[0].totalClicks : 0;

    // get unique users based on IP address
    const [uniqueUsersResult] = await conn.promise().query(
      "SELECT COUNT(DISTINCT ipAddress) AS uniqueUsers FROM analytics WHERE shortUrl = ?",
      [shortUrl]
    );
    console.log('Unique Users Result:', uniqueUsersResult);
    const uniqueUsers = uniqueUsersResult[0] ? uniqueUsersResult[0].uniqueUsers : 0;

    // get clicks by date for the last 7 days
    const [clicksByDateResult] = await conn.promise().query(
      "SELECT DATE(createdAt) AS date, COUNT(*) AS clickCount FROM analytics WHERE shortUrl = ? GROUP BY DATE(createdAt) ORDER BY DATE(createdAt) DESC LIMIT 7",
      [shortUrl]
    );
    console.log('Clicks by Date Result:', clicksByDateResult);

    // get breakdown by OS
    const [osTypeResult] = await conn.promise().query(
      "SELECT osType, COUNT(DISTINCT ipAddress) AS uniqueClicks FROM analytics WHERE shortUrl = ? GROUP BY osType",
      [shortUrl]
    );
    console.log('OS Type Result:', osTypeResult);

    // get breakdown by device type
    const [deviceTypeResult] = await conn.promise().query(
      "SELECT deviceType, COUNT(DISTINCT ipAddress) AS uniqueClicks FROM analytics WHERE shortUrl = ? GROUP BY deviceType",
      [shortUrl]
    );
    console.log('Device Type Result:', deviceTypeResult);

    return {
      totalClicks,
      uniqueUsers,
      clicksByDate: clicksByDateResult,
      osType: osTypeResult,
      deviceType: deviceTypeResult
    };
    } catch (err) { console.error('Error retrieving analytics:', err);
      throw new Error('Error retrieving analytics');}
}

module.exports = {
  getUrlAnalyticsAPI,
};
