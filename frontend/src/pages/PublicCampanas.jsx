import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const formatearFecha = (valor) => {
  if (!valor) return "Sin fecha";
  const [fecha] = valor.split("T");
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

const riesgoClass = {
  Alto: "danger",
  Medio: "warning",
  Bajo: "success"
};

const crearUrlMapa = (zona) => {
  const busqueda = `${zona.nombre_cruce}, ${zona.distrito}, Lima, Peru`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
};

function PublicCampanas() {
  const [campanas, setCampanas] = useState([]);
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/api/campanas"),
      api.get("/api/zonas")
    ])
      .then(([campanasRes, zonasRes]) => {
        setCampanas(campanasRes.data.filter((campana) => campana.estado === "Activa"));
        setZonas(zonasRes.data);
      })
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

      <section className="public-section">
        <div className="section-heading">
          <span className="eyebrow">Zonas de atencion</span>
          <h2>Cruces identificados</h2>
          <p>Consulta en mapa los puntos registrados para orientar campanas y acciones de apoyo.</p>
        </div>

        <div className="zone-public-grid">
          {zonas.map((zona) => (
            <article className="zone-public-card" key={zona.id}>
              <div>
                <span className={`status ${riesgoClass[zona.nivel_riesgo] || "neutral"}`}>{zona.nivel_riesgo}</span>
                <h4>{zona.nombre_cruce}</h4>
                <p>{zona.distrito}</p>
              </div>
              <a className="map-link" href={crearUrlMapa(zona)} target="_blank" rel="noreferrer">
                Ver mapa
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PublicCampanas;
