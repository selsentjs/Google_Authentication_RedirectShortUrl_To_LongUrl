const {OAuth2Client} = require("google-auth-library");
const conn = require("../Database/conn");

// Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createGoogleLogin = async(req,res) => {
    const {token} = req.body; // Token from frontend
    console.log('Received token:', token);

 try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    console.log('Google Payload:', payload);

    // Check if user exists in the database
    const [rows] = await conn.execute("SELECT * FROM users WHERE google_id = ?", [googleId]);

    if (rows.length > 0) {
      // User already exists, send response
      res.status(200).json({ message: "User authenticated", user: rows[0] });
    } else {
      // User doesn't exist, create new user
      const [result] = await conn.execute(
        "INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)",
        [googleId, email, name]
      );
      res.status(201).json({ message: "User created", user: { google_id: googleId, email, name } });
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(400).json({ message: "Invalid token" });
  }
};
module.exports = {
    createGoogleLogin
}