import { useEffect, useState } from "react";
import api from "../services/api";

const formatearFecha = (valor) => {
  if (!valor) return "Sin fecha";
  const [fecha] = valor.split("T");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

function Campanas() {
  const [campanas, setCampanas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    institucion: "",
    fecha: "",
    descripcion: "",
    estado: "Activa"
  });

  const cargarCampanas = async () => {
    try {
      const res = await api.get("/api/campanas");
      setCampanas(res.data);
    } catch (error) {
      console.error("Error al cargar campanas:", error);
    }
  };

  useEffect(() => {
    cargarCampanas();
  }, []);

  const registrar = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/campanas", form);
      setForm({
        nombre: "",
        institucion: "",
        fecha: "",
        descripcion: "",
        estado: "Activa"
      });
      cargarCampanas();
    } catch (error) {
      console.error("Error al registrar campana:", error);
      alert("No se pudo registrar la campana");
    }
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">Apoyos y campanas</span>
          <h2>Acciones institucionales</h2>
          <p>Organiza iniciativas sociales y deja evidencia de campanas disponibles para visitantes.</p>
        </div>
      </div>

      <div className="module-grid">
        <form onSubmit={registrar} className="panel form-panel">
          <h3>Nueva campana</h3>
          <label>
            Nombre
            <input
              placeholder="Ej. Campana de apoyo alimentario"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </label>
          <label>
            Institucion
            <input
              placeholder="Ej. Institucion Social Lima"
              value={form.institucion}
              onChange={(e) => setForm({ ...form, institucion: e.target.value })}
              required
            />
          </label>
          <div className="field-row">
            <label>
              Fecha
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </label>
            <label>
              Estado
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option>Activa</option>
                <option>Finalizada</option>
              </select>
            </label>
          </div>
          <label>
            Descripcion
            <textarea
              placeholder="Describe el objetivo, lugar o tipo de apoyo"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </label>
          <button className="primary-button">Registrar campana</button>
        </form>

        <section className="panel table-panel">
          <div className="section-heading">
            <span className="eyebrow">{campanas.length} registros</span>
            <h3>Campanas registradas</h3>
          </div>
          <div className="campaign-list">
            {campanas.map((campana) => (
              <article className="campaign-card" key={campana.id}>
                <div>
                  <span className={`status ${campana.estado === "Activa" ? "success" : "neutral"}`}>{campana.estado}</span>
                  <h4>{campana.nombre}</h4>
                  <p>{campana.descripcion || "Sin descripcion registrada."}</p>
                </div>
                <footer>
                  <span>{campana.institucion}</span>
                  <strong>{formatearFecha(campana.fecha)}</strong>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default Campanas;
