# Semaforo Solidario

Plataforma web para registrar y gestionar informacion de personas que realizan limpieza de parabrisas en cruces de alto trafico. El sistema permite administrar zonas, personas, necesidades sociales y campanas de apoyo.

## Stack tecnologico

- Frontend: React, Vite, HTML, CSS y JavaScript.
- Backend/API: Node.js con Express.
- Base de datos: PostgreSQL.
- Control de versiones: GitHub.
- CI/CD: GitHub Actions.

## Ejecucion local

Backend:

```bash
cd backend
npm install
npm run init-db
npm run start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Credenciales de prueba:

```txt
Usuario: admin
Contrasena: admin123
```

## Pipeline CI/CD

Para automatizar la validacion del proyecto se configuro un pipeline de CI/CD mediante GitHub Actions. Este pipeline permite ejecutar acciones automaticas cuando se realizan cambios en el repositorio.

El flujo del pipeline considera:

- Descargar el codigo fuente desde GitHub.
- Instalar las dependencias del proyecto.
- Ejecutar validaciones basicas.
- Construir el proyecto.
- Preparar el despliegue hacia la nube.

El uso de CI/CD permite reducir errores manuales, validar cambios antes de integrarlos y mantener una entrega mas ordenada del sistema. Ademas, permite evidenciar la aplicacion de practicas DevOps dentro del proyecto.

El archivo del pipeline se encuentra en:

```txt
.github/workflows/ci.yml
```

Actualmente el pipeline ejecuta:

- Instalacion de dependencias del frontend.
- Lint del frontend.
- Build del frontend.
- Instalacion de dependencias del backend.
- Validacion de sintaxis del backend.
