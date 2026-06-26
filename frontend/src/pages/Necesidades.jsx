import { useEffect, useState } from "react";
import api from "../services/api";

const prioridadClass = {
  Alta: "danger",
  Media: "warning",
  Baja: "success"
};

function Necesidades() {
  const [necesidades, setNecesidades] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({
    persona_id: "",
    tipo: "Salud",
    descripcion: "",
    prioridad: "Alta"
  });

  const cargarDatos = async () => {
    try {
      const [necesidadesRes, personasRes] = await Promise.all([
        api.get("/api/necesidades"),
        api.get("/api/personas")
      ]);
      setNecesidades(necesidadesRes.data);
      setPersonas(personasRes.data);
      setForm((actual) => ({
        ...actual,
        persona_id: actual.persona_id || (personasRes.data[0] ? String(personasRes.data[0].id) : "")
      }));
    } catch (error) {
      console.error("Error al cargar necesidades:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const registrar = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/necesidades", {
        ...form,
        persona_id: Number(form.persona_id)
      });
      setForm({
        persona_id: personas[0] ? String(personas[0].id) : "",
        tipo: "Salud",
        descripcion: "",
        prioridad: "Alta"
      });
      cargarDatos();
    } catch (error) {
      console.error("Error al registrar necesidad:", error);
      alert("No se pudo registrar la necesidad");
    }
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">Gestion de necesidades</span>
          <h2>Priorizacion de apoyo</h2>
          <p>Registra necesidades sociales para ordenar acciones de instituciones y administradores.</p>
        </div>
      </div>

      <div className="module-grid">
        <form onSubmit={registrar} className="panel form-panel">
          <h3>Nueva necesidad</h3>
          <label>
            Persona
            <select
              value={form.persona_id}
              onChange={(e) => setForm({ ...form, persona_id: e.target.value })}
              required
            >
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>{persona.nombre}</option>
              ))}
            </select>
          </label>
          <div className="field-row">
            <label>
              Tipo
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option>Salud</option>
                <option>Documentacion</option>
                <option>Alimentacion</option>
                <option>Empleo</option>
                <option>Orientacion legal</option>
              </select>
            </label>
            <label>
              Prioridad
              <select
                value={form.prioridad}
                onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
              >
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </label>
          </div>
          <label>
            Descripcion
            <textarea
              placeholder="Describe el apoyo requerido y contexto relevante"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              required
            />
          </label>
          <button className="primary-button">Registrar necesidad</button>
        </form>

        <section className="panel table-panel">
          <div className="section-heading">
            <span className="eyebrow">{necesidades.length} registros</span>
            <h3>Necesidades registradas</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Tipo</th>
                  <th>Descripcion</th>
                  <th>Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {necesidades.map((necesidad) => (
                  <tr key={necesidad.id}>
                    <td>{necesidad.persona || "Sin persona"}</td>
                    <td>{necesidad.tipo}</td>
                    <td>{necesidad.descripcion}</td>
                    <td><span className={`status ${prioridadClass[necesidad.prioridad] || "neutral"}`}>{necesidad.prioridad}</span></td>
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

export default Necesidades;
