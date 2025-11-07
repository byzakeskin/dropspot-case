const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

const bcrypt = require('bcryptjs');
const db = require('./db/database');

app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const insertQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;

  db.run(insertQuery, [email, hashedPassword], function (err) {
    if (err) {
      if(err.message.includes("UNIQUE")) {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "User created", userId: this.lastID });
  });
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = "dropspot_secret_key"; // ⚠ sonra .env'ye alacağız

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).json({ message: "Email and password required" });
  }

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], (err, user) => {
    if(err) {
      return res.status(500).json({ message: "Database error" });
    }

    if(!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if(!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  });
});

const authMiddleware = require('./middleware/auth');

app.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: "Authorized",
    user: req.user
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
