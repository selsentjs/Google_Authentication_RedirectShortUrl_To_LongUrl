const conn = require("../Database/conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  // Validate input fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Enter all the fields" });
  }
 
  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: "password and confirm password must be same" });
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user data into the database
  const sql = "INSERT INTO register(name,email,password)VALUES(?,?,?) ";

  try {
    // check if the email already exists
    const checkEmailExists = "SELECT * from register WHERE email = ?";
    conn.query(checkEmailExists, [email], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).json({ msg: "Email already exist" });
      }

       // Insert the new user
      conn.query(sql, [name, email, hashedPassword], (err, user) => {
        if (err) throw err;

        // Generate a JWT token
        const token = jwt.sign(
          { userId: user.insertId, email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set the JWT token in an HTTP-only cookie

        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3600000, // 1 hour expiration time
          });


        // Respond with the success message and token
        res.status(201).json({ msg: "User registered successfully", token });
      });
    });
  } catch (err) {}
};

const login = async (req, res) => {
    const {email,password} = req.body;
    
    // Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const sql = "SELECT * FROM register WHERE email = ?";
    conn.query(sql, [email], async (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare hashed password with the entered password
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, "your_jwt_secret_key", { expiresIn: "1h" });

      // Set the JWT token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevents client-side JS access
        secure: process.env.NODE_ENV === "production", 
        maxAge: 3600000, // 1 hour expiration time
      });

      // Respond with the token
      res.status(200).json({ msg: "Login successful", token });
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("token", {
      httpOnly: true, // Ensure that cookie is also removed from the client-side
      secure: process.env.NODE_ENV === "production", // Only clear secure cookies in production
    });

    // Respond with the logout message
    res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
};

module.exports = {
  register,
  login,
  logout,
};
