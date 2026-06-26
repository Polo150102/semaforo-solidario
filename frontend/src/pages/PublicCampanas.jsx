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

const crearUrlMapaEmbebido = (zona) => {
  const busqueda = `${zona.nombre_cruce}, ${zona.distrito}, Lima, Peru`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(busqueda)}&output=embed`;
};

function PublicCampanas() {
  const [campanas, setCampanas] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/api/campanas"),
      api.get("/api/zonas")
    ])
      .then(([campanasRes, zonasRes]) => {
        setCampanas(campanasRes.data.filter((campana) => campana.estado === "Activa"));
        setZonas(zonasRes.data);
        setZonaSeleccionada(zonasRes.data[0] || null);
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

        <div className="public-map-layout">
          <div className="zone-public-grid">
            {zonas.map((zona) => (
              <article
                className={`zone-public-card ${zonaSeleccionada?.id === zona.id ? "active" : ""}`}
                key={zona.id}
              >
                <button type="button" onClick={() => setZonaSeleccionada(zona)}>
                  <span className={`status ${riesgoClass[zona.nivel_riesgo] || "neutral"}`}>{zona.nivel_riesgo}</span>
                  <strong>{zona.nombre_cruce}</strong>
                  <small>{zona.distrito}</small>
                </button>
              </article>
            ))}
          </div>

          <div className="embedded-map-card">
            {zonaSeleccionada ? (
              <>
                <div className="embedded-map-heading">
                  <div>
                    <span className="eyebrow">Mapa del cruce</span>
                    <h3>{zonaSeleccionada.nombre_cruce}</h3>
                    <p>{zonaSeleccionada.distrito}</p>
                  </div>
                  <a className="map-link" href={crearUrlMapa(zonaSeleccionada)} target="_blank" rel="noreferrer">
                    Abrir grande
                  </a>
                </div>
                <iframe
                  title={`Mapa de ${zonaSeleccionada.nombre_cruce}`}
                  src={crearUrlMapaEmbebido(zonaSeleccionada)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </>
            ) : (
              <div className="empty-map">
                <h3>Sin zonas registradas</h3>
                <p>Cuando existan cruces registrados, el mapa aparecera en esta seccion.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PublicCampanas;
