import { useEffect, useState } from "react";
import api from "../services/api";

const riesgoClass = {
  Alto: "danger",
  Medio: "warning",
  Bajo: "success"
};

const crearUrlMapa = (zona) => {
  const busqueda = `${zona.nombre_cruce}, ${zona.distrito}, Lima, Peru`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
};

function Zonas() {
  const [zonas, setZonas] = useState([]);
  const [form, setForm] = useState({
    nombre_cruce: "",
    distrito: "",
    nivel_riesgo: "Alto"
  });

  const cargarZonas = async () => {
    try {
      const res = await api.get("/api/zonas");
      setZonas(res.data);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  useEffect(() => {
    cargarZonas();
  }, []);

  const registrar = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/zonas", form);
      setForm({ nombre_cruce: "", distrito: "", nivel_riesgo: "Alto" });
      cargarZonas();
    } catch (error) {
      console.error("Error al registrar zona:", error);
      alert("No se pudo registrar la zona");
    }
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">Gestion de zonas</span>
          <h2>Cruces de alto trafico</h2>
          <p>Identifica lugares donde se realiza la actividad y clasifica su riesgo operativo.</p>
        </div>
      </div>

      <div className="module-grid">
        <form onSubmit={registrar} className="panel form-panel">
          <h3>Nueva zona</h3>
          <label>
            Nombre del cruce
            <input
              placeholder="Ej. Av. Javier Prado con Arequipa"
              value={form.nombre_cruce}
              onChange={(e) => setForm({ ...form, nombre_cruce: e.target.value })}
              required
            />
          </label>
          <label>
            Distrito
            <input
              placeholder="Ej. San Isidro"
              value={form.distrito}
              onChange={(e) => setForm({ ...form, distrito: e.target.value })}
              required
            />
          </label>
          <label>
            Nivel de riesgo
            <select
              value={form.nivel_riesgo}
              onChange={(e) => setForm({ ...form, nivel_riesgo: e.target.value })}
            >
              <option>Alto</option>
              <option>Medio</option>
              <option>Bajo</option>
            </select>
          </label>
          <button className="primary-button">Registrar zona</button>
        </form>

        <section className="panel table-panel">
          <div className="section-heading">
            <span className="eyebrow">{zonas.length} registros</span>
            <h3>Zonas registradas</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cruce</th>
                  <th>Distrito</th>
                  <th>Riesgo</th>
                  <th>Mapa</th>
                </tr>
              </thead>
              <tbody>
                {zonas.map((zona) => (
                  <tr key={zona.id}>
                    <td>{zona.nombre_cruce}</td>
                    <td>{zona.distrito}</td>
                    <td><span className={`status ${riesgoClass[zona.nivel_riesgo] || "neutral"}`}>{zona.nivel_riesgo}</span></td>
                    <td>
                      <a className="map-link" href={crearUrlMapa(zona)} target="_blank" rel="noreferrer">
                        Ver mapa
                      </a>
                    </td>
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

export default Zonas;
