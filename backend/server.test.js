// tests/server.test.js
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());
const JWT_SECRET = "your_jwt_secret_key";

// Initialize an in-memory SQLite database for testing
let db = new sqlite3.Database(":memory:");
db.serialize(() => {
    db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
    db.run(`CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    amount REAL,
    description TEXT
  )`);
    const hashedPassword = bcrypt.hashSync("password", 8);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ["test", hashedPassword]);
});

// Middleware to protect routes (for testing)
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Define test routes based on our backend logic
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.sendStatus(500);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, token });
    });
});

app.get("/transactions", authenticateToken, (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) return res.sendStatus(500);
        res.json(rows);
    });
});

app.post("/transactions", authenticateToken, (req, res) => {
    const { date, amount, description } = req.body;
    if (!date || !amount || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    db.run(`INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)`, [date, amount, description], function (err) {
        if (err) return res.sendStatus(500);
        db.get(`SELECT * FROM transactions WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) return res.sendStatus(500);
            res.status(201).json({ success: true, transaction: row });
        });
    });
});

// Jest unit tests
describe("Authentication and Transactions API", () => {
    let token;
    test("POST /login - success", async () => {
        const response = await request(app)
            .post("/login")
            .send({ username: "test", password: "password" });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        token = response.body.token;
    });

    test("GET /transactions - empty list", async () => {
        const response = await request(app)
            .get("/transactions")
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /transactions - add new transaction", async () => {
        const newTransaction = { date: "2025-02-13", amount: 200, description: "Test Transaction" };
        const response = await request(app)
            .post("/transactions")
            .set("Authorization", `Bearer ${token}`)
            .send(newTransaction);
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.transaction.date).toBe(newTransaction.date);
    });
});
