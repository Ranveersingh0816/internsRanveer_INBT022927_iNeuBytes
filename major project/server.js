
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Allowed tables and fields
const resources = {
    doctors: [
        "name",
        "specialization",
        "email",
        "phone",
        "department_id",
        "consultation_fee",
        "availability"
    ],
    patients: [
        "name",
        "date_of_birth",
        "gender",
        "phone",
        "email",
        "address"
    ],
    appointments: [
        "patient_id",
        "doctor_id",
        "appointment_date",
        "appointment_time",
        "reason",
        "status"
    ],
    medicines: [
        "name",
        "quantity",
        "price",
        "expiry_date"
    ]
};

let db;

// GET: retrieve all records
app.get("/api/:resource", async (req, res) => {
    const table = req.params.resource;

    if (!resources[table]) {
        return res.status(404).json({ error: "Invalid resource" });
    }

    try {
        const [rows] = await db.query(
            `SELECT * FROM \`${table}\` ORDER BY id DESC`
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve records" });
    }
});

// POST: add a record
app.post("/api/:resource", async (req, res) => {
    const table = req.params.resource;

    if (!resources[table]) {
        return res.status(404).json({ error: "Invalid resource" });
    }

    const allowedFields = resources[table];
    const data = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            data[field] = req.body[field];
        }
    }

    const fields = Object.keys(data);

    if (fields.length === 0) {
        return res.status(400).json({ error: "No valid fields provided" });
    }

    if (
        ["doctors", "patients", "medicines"].includes(table) &&
        !String(data.name || "").trim()
    ) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const columns = fields.map(f => `\`${f}\``).join(", ");
        const placeholders = fields.map(() => "?").join(", ");
        const values = fields.map(f => data[f]);

        const [result] = await db.query(
            `INSERT INTO \`${table}\` (${columns})
             VALUES (${placeholders})`,
            values
        );

        res.status(201).json({
            message: "Record added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add record" });
    }
});

// PUT: update a record
app.put("/api/:resource/:id", async (req, res) => {
    const table = req.params.resource;
    const id = req.params.id;

    if (!resources[table]) {
        return res.status(404).json({ error: "Invalid resource" });
    }

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
    }

    const data = {};

    for (const field of resources[table]) {
        if (req.body[field] !== undefined) {
            data[field] = req.body[field];
        }
    }

    const fields = Object.keys(data);

    if (fields.length === 0) {
        return res.status(400).json({ error: "No valid fields provided" });
    }

    try {
        const setClause = fields
            .map(f => `\`${f}\` = ?`)
            .join(", ");

        const values = fields.map(f => data[f]);

        const [result] = await db.query(
            `UPDATE \`${table}\` SET ${setClause} WHERE id = ?`,
            [...values, Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.json({ message: "Record updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update record" });
    }
});

// DELETE: delete a record
app.delete("/api/:resource/:id", async (req, res) => {
    const table = req.params.resource;
    const id = req.params.id;

    if (!resources[table]) {
        return res.status(404).json({ error: "Invalid resource" });
    }

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
    }

    try {
        const [result] = await db.query(
            `DELETE FROM \`${table}\` WHERE id = ?`,
            [Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete record" });
    }
});

// Connect database, then start server
async function startServer() {
    try {
        db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10
        });

        await db.query("SELECT 1");

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
            console.log("MySQL connected successfully");
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
