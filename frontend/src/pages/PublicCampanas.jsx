import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const formatearFecha = (valor) => {
  if (!valor) return "Sin fecha";
  const [fecha] = valor.split("T");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

function PublicCampanas() {
  const [campanas, setCampanas] = useState([]);

  useEffect(() => {
    api.get("/api/campanas")
      .then((res) => setCampanas(res.data.filter((campana) => campana.estado === "Activa")))
      .catch((error) => console.error("Error al cargar campanas publicas:", error));
  }, []);

  return (
    <main className="public-page">
      <header className="public-header">
        <div>
          <span className="eyebrow">Campanas disponibles</span>
          <h1>Semaforo Solidario</h1>
          <p>Iniciativas activas de apoyo social para personas identificadas en cruces de alto trafico.</p>
        </div>
        <Link className="secondary-link" to="/">Acceso administrativo</Link>
      </header>

      <section className="public-grid">
        {campanas.map((campana) => (
          <article className="campaign-card" key={campana.id}>
            <div>
              <span className="status success">{campana.estado}</span>
              <h4>{campana.nombre}</h4>
              <p>{campana.descripcion || "Sin descripcion registrada."}</p>
            </div>
            <footer>
              <span>{campana.institucion}</span>
              <strong>{formatearFecha(campana.fecha)}</strong>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}

export default PublicCampanas;
