import { useEffect, useState } from "react";
import api from "../services/api";

const cards = [
  { key: "totalPersonas", label: "Personas registradas", detail: "Beneficiarios identificados", tone: "amber" },
  { key: "totalZonas", label: "Zonas mapeadas", detail: "Cruces de alto trafico", tone: "green" },
  { key: "totalNecesidades", label: "Necesidades", detail: "Casos por priorizar", tone: "red" },
  { key: "totalCampanas", label: "Campanas activas", detail: "Acciones de apoyo", tone: "blue" }
];

function Dashboard() {
  const [data, setData] = useState({
    totalPersonas: 0,
    totalZonas: 0,
    totalNecesidades: 0,
    totalCampanas: 0
  });
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    api.get("/api/dashboard")
      .then((res) => {
        setData(res.data);
        setEstado("listo");
      })
      .catch((error) => {
        console.error("Error al cargar dashboard:", error);
        setEstado("error");
      });
  }, []);

  return (
    <section className="page-stack">
      <div className="hero-panel">
        <div>
          <span className="eyebrow">Vista general del MVP</span>
          <h2>Semaforo Solidario</h2>
          <p>
            Plataforma para registrar personas en situacion vulnerable, ubicar zonas de trabajo,
            priorizar necesidades y organizar campanas de apoyo social.
          </p>
        </div>
        <div className="hero-summary">
          <span>Estado del sistema</span>
          <strong>{estado === "listo" ? "Operativo" : estado === "error" ? "Sin conexion API" : "Cargando"}</strong>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <article className={`stat-card ${card.tone}`} key={card.key}>
            <span>{card.label}</span>
            <strong>{data[card.key]}</strong>
            <small>{card.detail}</small>
          </article>
        ))}
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="section-heading">
            <span className="eyebrow">Alcance funcional</span>
            <h2>Funcionalidades nucleo</h2>
          </div>
          <div className="feature-list">
            <div><strong>Registro social</strong><span>Personas, zona asignada y observaciones de contexto.</span></div>
            <div><strong>Mapa operativo</strong><span>Cruces con enlace directo a Google Maps y nivel de riesgo por zona.</span></div>
            <div><strong>Priorizacion</strong><span>Necesidades por tipo, descripcion y urgencia.</span></div>
            <div><strong>Accion institucional</strong><span>Campanas con institucion responsable, fecha y estado.</span></div>
          </div>
        </section>

        <section className="panel muted-panel">
          <div className="section-heading">
            <span className="eyebrow">DevOps y despliegue</span>
            <h2>Evidencia esperada</h2>
          </div>
          <p>
            El proyecto esta preparado como MVP web con frontend React, API REST en Express y
            persistencia PostgreSQL. Esta vista ayuda a demostrar datos de prueba, modulos
            implementados y una ruta clara para despliegue en nube.
          </p>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
