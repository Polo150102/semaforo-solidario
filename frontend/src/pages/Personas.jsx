import { useEffect, useState } from "react";
import api from "../services/api";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    edad_aproximada: "",
    nacionalidad: "",
    situacion: "Limpieza de parabrisas",
    observacion: "",
    zona_id: ""
  });

  const cargarDatos = async () => {
    try {
      const [personasRes, zonasRes] = await Promise.all([
        api.get("/api/personas"),
        api.get("/api/zonas")
      ]);
      setPersonas(personasRes.data);
      setZonas(zonasRes.data);
      setForm((actual) => ({
        ...actual,
        zona_id: actual.zona_id || (zonasRes.data[0] ? String(zonasRes.data[0].id) : "")
      }));
    } catch (error) {
      console.error("Error al cargar personas:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const registrar = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/personas", {
        ...form,
        edad_aproximada: Number(form.edad_aproximada),
        zona_id: Number(form.zona_id)
      });
      setForm({
        nombre: "",
        edad_aproximada: "",
        nacionalidad: "",
        situacion: "Limpieza de parabrisas",
        observacion: "",
        zona_id: zonas[0] ? String(zonas[0].id) : ""
      });
      cargarDatos();
    } catch (error) {
      console.error("Error al registrar persona:", error);
      alert("No se pudo registrar la persona");
    }
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">Registro de personas</span>
          <h2>Beneficiarios identificados</h2>
          <p>Centraliza informacion basica y contexto social para facilitar apoyos posteriores.</p>
        </div>
      </div>

      <div className="module-grid">
        <form onSubmit={registrar} className="panel form-panel">
          <h3>Nueva persona</h3>
          <label>
            Nombre
            <input
              placeholder="Ej. Carlos M."
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </label>
          <div className="field-row">
            <label>
              Edad aproximada
              <input
                type="number"
                min="0"
                placeholder="28"
                value={form.edad_aproximada}
                onChange={(e) => setForm({ ...form, edad_aproximada: e.target.value })}
                required
              />
            </label>
            <label>
              Nacionalidad
              <input
                placeholder="Peruana"
                value={form.nacionalidad}
                onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })}
              />
            </label>
          </div>
          <label>
            Zona de trabajo
            <select
              value={form.zona_id}
              onChange={(e) => setForm({ ...form, zona_id: e.target.value })}
              required
            >
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>{zona.nombre_cruce}</option>
              ))}
            </select>
          </label>
          <label>
            Situacion
            <input
              value={form.situacion}
              onChange={(e) => setForm({ ...form, situacion: e.target.value })}
              required
            />
          </label>
          <label>
            Observacion
            <textarea
              placeholder="Horario, riesgos, comentario social o necesidad inicial"
              value={form.observacion}
              onChange={(e) => setForm({ ...form, observacion: e.target.value })}
            />
          </label>
          <button className="primary-button">Registrar persona</button>
        </form>

        <section className="panel table-panel">
          <div className="section-heading">
            <span className="eyebrow">{personas.length} registros</span>
            <h3>Personas registradas</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Nacionalidad</th>
                  <th>Zona</th>
                  <th>Observacion</th>
                </tr>
              </thead>
              <tbody>
                {personas.map((persona) => (
                  <tr key={persona.id}>
                    <td>{persona.nombre}</td>
                    <td>{persona.edad_aproximada}</td>
                    <td>{persona.nacionalidad}</td>
                    <td>{persona.nombre_cruce || "Sin zona"}</td>
                    <td>{persona.observacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Personas;
