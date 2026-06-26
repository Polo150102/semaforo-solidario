import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Zonas from "./pages/Zonas";
import Personas from "./pages/Personas";
import Necesidades from "./pages/Necesidades";
import Campanas from "./pages/Campanas";
import PublicCampanas from "./pages/PublicCampanas";
import "./style.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "DS" },
  { to: "/zonas", label: "Zonas", icon: "ZN" },
  { to: "/personas", label: "Personas", icon: "PS" },
  { to: "/necesidades", label: "Necesidades", icon: "ND" },
  { to: "/campanas", label: "Campanas", icon: "CP" }
];

function Layout() {
  const navigate = useNavigate();
  const salir = () => {
    localStorage.removeItem("semaforo_token");
    localStorage.removeItem("semaforo_user");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SS</div>
          <div>
            <span>Semaforo Solidario</span>
            <small>Panel administrativo</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Navegacion principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Caso 3 - Proyecto Final de Carrera III</span>
            <h1>Gestion de apoyo en semaforos</h1>
          </div>
          <button className="secondary-button" onClick={salir}>Cerrar sesion</button>
        </header>

        <main className="container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/zonas" element={<Zonas />} />
            <Route path="/personas" element={<Personas />} />
            <Route path="/necesidades" element={<Necesidades />} />
            <Route path="/campanas" element={<Campanas />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const token = localStorage.getItem("semaforo_token");
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/campanas-publicas" element={<PublicCampanas />} />
        <Route path="/*" element={<RequireAuth><Layout /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
