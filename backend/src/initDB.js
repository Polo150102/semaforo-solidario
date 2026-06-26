const pool = require("./db");

async function initDB() {
  try {
    console.log("Creando tablas...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario VARCHAR(60) UNIQUE NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        rol VARCHAR(40) NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        activo BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS zonas (
        id SERIAL PRIMARY KEY,
        nombre_cruce VARCHAR(150) NOT NULL,
        distrito VARCHAR(100) NOT NULL,
        nivel_riesgo VARCHAR(20) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS personas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL,
        edad_aproximada INT,
        nacionalidad VARCHAR(80),
        situacion VARCHAR(150),
        observacion TEXT,
        zona_id INT REFERENCES zonas(id)
      );

      CREATE TABLE IF NOT EXISTS necesidades (
        id SERIAL PRIMARY KEY,
        persona_id INT REFERENCES personas(id),
        tipo VARCHAR(80) NOT NULL,
        descripcion TEXT,
        prioridad VARCHAR(20) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS campanas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        institucion VARCHAR(150),
        fecha DATE,
        descripcion TEXT,
        estado VARCHAR(30) NOT NULL
      );
    `);

    await pool.query(`
      INSERT INTO usuarios (usuario, nombre, rol, password_hash, password_salt)
      SELECT
        'admin',
        'Administrador Semaforo Solidario',
        'Administrador',
        'be5b1f51db5298817bd01780f8c58aa9db14f093dcb855cccc786933a466d8463b04d9bd342785094d9911210a1af7f6b1fdd20a6c9bce1f1c1c2e3f7d445820',
        '423fba3f2536ecd2dfa8752789c19b5b'
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE usuario = 'admin');
    `);

    await pool.query(`
      INSERT INTO zonas (nombre_cruce, distrito, nivel_riesgo)
      SELECT 'Av. Javier Prado con Arequipa', 'San Isidro', 'Alto'
      WHERE NOT EXISTS (SELECT 1 FROM zonas WHERE nombre_cruce = 'Av. Javier Prado con Arequipa');

      INSERT INTO zonas (nombre_cruce, distrito, nivel_riesgo)
      SELECT 'Av. Universitaria con Colonial', 'Cercado de Lima', 'Medio'
      WHERE NOT EXISTS (SELECT 1 FROM zonas WHERE nombre_cruce = 'Av. Universitaria con Colonial');

      INSERT INTO zonas (nombre_cruce, distrito, nivel_riesgo)
      SELECT 'Av. Grau con Abancay', 'Lima', 'Alto'
      WHERE NOT EXISTS (SELECT 1 FROM zonas WHERE nombre_cruce = 'Av. Grau con Abancay');
    `);

    await pool.query(`
      INSERT INTO personas (nombre, edad_aproximada, nacionalidad, situacion, observacion, zona_id)
      SELECT 'Carlos M.', 28, 'Peruana', 'Limpieza de parabrisas', 'Trabaja en horario tarde', 1
      WHERE NOT EXISTS (SELECT 1 FROM personas WHERE nombre = 'Carlos M.');

      INSERT INTO personas (nombre, edad_aproximada, nacionalidad, situacion, observacion, zona_id)
      SELECT 'Jose R.', 34, 'Venezolana', 'Limpieza de parabrisas', 'Requiere apoyo documentario', 2
      WHERE NOT EXISTS (SELECT 1 FROM personas WHERE nombre = 'Jose R.');

      INSERT INTO personas (nombre, edad_aproximada, nacionalidad, situacion, observacion, zona_id)
      SELECT 'Luis A.', 19, 'Peruana', 'Limpieza de parabrisas', 'Trabaja en manana y mediodia; requiere orientacion laboral', 3
      WHERE NOT EXISTS (SELECT 1 FROM personas WHERE nombre = 'Luis A.');
    `);

    await pool.query(`
      INSERT INTO necesidades (persona_id, tipo, descripcion, prioridad)
      SELECT 1, 'Salud', 'Requiere evaluacion medica basica', 'Alta'
      WHERE NOT EXISTS (SELECT 1 FROM necesidades WHERE persona_id = 1 AND tipo = 'Salud');

      INSERT INTO necesidades (persona_id, tipo, descripcion, prioridad)
      SELECT 2, 'Documentacion', 'Necesita orientacion para regularizacion', 'Media'
      WHERE NOT EXISTS (SELECT 1 FROM necesidades WHERE persona_id = 2 AND tipo = 'Documentacion');

      INSERT INTO necesidades (persona_id, tipo, descripcion, prioridad)
      SELECT 3, 'Alimentacion', 'Requiere apoyo alimentario temporal y evaluacion social', 'Alta'
      WHERE NOT EXISTS (SELECT 1 FROM necesidades WHERE persona_id = 3 AND tipo = 'Alimentacion');
    `);

    await pool.query(`
      INSERT INTO campanas (nombre, institucion, fecha, descripcion, estado)
      SELECT 'Campana de apoyo alimentario', 'Institucion Social Lima', '2026-06-25', 'Entrega de alimentos basicos', 'Activa'
      WHERE NOT EXISTS (SELECT 1 FROM campanas WHERE nombre = 'Campana de apoyo alimentario');

      INSERT INTO campanas (nombre, institucion, fecha, descripcion, estado)
      SELECT 'Jornada de orientacion documentaria', 'Municipalidad de Lima', '2026-07-02', 'Asesoria para regularizacion y acceso a servicios sociales', 'Activa'
      WHERE NOT EXISTS (SELECT 1 FROM campanas WHERE nombre = 'Jornada de orientacion documentaria');
    `);

    console.log("Base de datos inicializada correctamente.");
    process.exit();
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1);
  }
}

initDB();
