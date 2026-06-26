const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campanas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar campanas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, institucion, fecha, descripcion, estado } = req.body;

    const result = await pool.query(
      `INSERT INTO campanas 
      (nombre, institucion, fecha, descripcion, estado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [nombre, institucion, fecha, descripcion, estado]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar campaña" });
  }
});

module.exports = router;