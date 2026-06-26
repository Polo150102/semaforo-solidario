const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM zonas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar zonas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre_cruce, distrito, nivel_riesgo } = req.body;

    const result = await pool.query(
      "INSERT INTO zonas (nombre_cruce, distrito, nivel_riesgo) VALUES ($1, $2, $3) RETURNING *",
      [nombre_cruce, distrito, nivel_riesgo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar zona" });
  }
});

module.exports = router;