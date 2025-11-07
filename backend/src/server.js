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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
