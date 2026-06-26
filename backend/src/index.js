const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const { verifyPassword, createDemoToken } = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Semaforo Solidario funcionando"
  });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: "Usuario y contrasena son obligatorios" });
    }

    const result = await pool.query(
      "SELECT id, usuario, nombre, rol, password_hash, password_salt FROM usuarios WHERE usuario = $1 AND activo = TRUE",
      [usuario]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const user = result.rows[0];
    const validPassword = verifyPassword(password, user.password_salt, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    res.json({
      token: createDemoToken(user),
      user: {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesion" });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const personas = await pool.query("SELECT COUNT(*) FROM personas");
    const zonas = await pool.query("SELECT COUNT(*) FROM zonas");
    const necesidades = await pool.query("SELECT COUNT(*) FROM necesidades");
    const campanas = await pool.query("SELECT COUNT(*) FROM campanas");

    res.json({
      totalPersonas: Number(personas.rows[0].count),
      totalZonas: Number(zonas.rows[0].count),
      totalNecesidades: Number(necesidades.rows[0].count),
      totalCampanas: Number(campanas.rows[0].count)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener dashboard" });
  }
});

app.get("/api/zonas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM zonas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar zonas" });
  }
});

app.post("/api/zonas", async (req, res) => {
  try {
    const { nombre_cruce, distrito, nivel_riesgo } = req.body;

    const result = await pool.query(
      "INSERT INTO zonas (nombre_cruce, distrito, nivel_riesgo) VALUES ($1, $2, $3) RETURNING *",
      [nombre_cruce, distrito, nivel_riesgo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar zona" });
  }
});

app.get("/api/personas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.nombre,
        p.edad_aproximada,
        p.nacionalidad,
        p.situacion,
        p.observacion,
        p.zona_id,
        z.nombre_cruce,
        z.distrito
      FROM personas p
      LEFT JOIN zonas z ON p.zona_id = z.id
      ORDER BY p.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar personas" });
  }
});

app.post("/api/personas", async (req, res) => {
  try {
    const { nombre, edad_aproximada, nacionalidad, situacion, observacion, zona_id } = req.body;

    const result = await pool.query(
      `INSERT INTO personas 
      (nombre, edad_aproximada, nacionalidad, situacion, observacion, zona_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [nombre, edad_aproximada, nacionalidad, situacion, observacion, zona_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar persona" });
  }
});

app.get("/api/necesidades", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.id,
        n.tipo,
        n.descripcion,
        n.prioridad,
        n.persona_id,
        p.nombre AS persona
      FROM necesidades n
      LEFT JOIN personas p ON n.persona_id = p.id
      ORDER BY n.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar necesidades" });
  }
});

app.post("/api/necesidades", async (req, res) => {
  try {
    const { persona_id, tipo, descripcion, prioridad } = req.body;

    const result = await pool.query(
      `INSERT INTO necesidades 
      (persona_id, tipo, descripcion, prioridad)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [persona_id, tipo, descripcion, prioridad]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar necesidad" });
  }
});

app.get("/api/campanas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campanas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar campañas" });
  }
});

app.post("/api/campanas", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: "Error al registrar campaña" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
