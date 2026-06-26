import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const ingresar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await api.post("/api/auth/login", { usuario, password });
      localStorage.setItem("semaforo_token", res.data.token);
      localStorage.setItem("semaforo_user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (loginError) {
      console.error("Error al iniciar sesion:", loginError);
      setError("Usuario o contrasena incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="signal-card">
          <span className="signal red"></span>
          <span className="signal amber"></span>
          <span className="signal green"></span>
        </div>
        <div>
          <span className="eyebrow">Caso social priorizado</span>
          <h1>Semaforo Solidario</h1>
          <p>
            Registro y seguimiento de personas que limpian parabrisas en cruces
            de alto trafico, con enfoque en necesidades, zonas y campanas.
          </p>
        </div>
      </section>

      <form onSubmit={ingresar} className="login-card">
        <div className="section-heading">
          <span className="eyebrow">Acceso seguro</span>
          <h2>Panel administrativo</h2>
        </div>

        <label>
          Usuario
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" disabled={cargando}>
          {cargando ? "Validando..." : "Ingresar al sistema"}
        </button>
        <Link className="text-link" to="/campanas-publicas">Ver campanas publicas</Link>
        <small>Acceso validado contra los usuarios registrados en la base de datos.</small>
      </form>
    </main>
  );
}

export default Login;
