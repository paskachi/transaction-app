// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your_jwt_secret_key"; // In production, store securely

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Error opening database", err);
    } else {
        console.log("Connected to SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      amount REAL,
      description TEXT
    )`);

        // Seed default user if not exists
        db.get(`SELECT * FROM users WHERE username = ?`, ["test"], (err, row) => {
            if (err) console.error(err);
            if (!row) {
                const hashedPassword = bcrypt.hashSync("password", 8);
                db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ["test", hashedPassword]);
            }
        });
    }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Login endpoint with robust authentication
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ success: true, token });
    });
});

// Protected endpoint: Get all transactions
app.get("/transactions", authenticateToken, (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.json(rows);
    });
});

// Protected endpoint: Add a new transaction
app.post("/transactions", authenticateToken, (req, res) => {
    const { date, amount, description } = req.body;
    if (!date || !amount || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    db.run(`INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)`, [date, amount, description], function (err) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        db.get(`SELECT * FROM transactions WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            res.status(201).json({ success: true, transaction: row });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
