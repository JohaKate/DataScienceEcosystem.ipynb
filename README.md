# Hotel Costa Bella - Aplicación Web Completa

## 🏨 Descripción del Proyecto

Hotel Costa Bella es una aplicación web completa desarrollada como parte del curso de Programación Web. Integra frontend moderno, backend robusto, pipelines de datos automatizados, y despliegue DevOps.

### 🎯 Objetivo
Desarrollar una aplicación web que demuestre el dominio de tecnologías modernas de desarrollo full-stack, incluyendo:
- Frontend responsivo con HTML5, CSS3 y JavaScript
- Backend API REST con Python y FastAPI
- Pipeline de datos ETL con Prefect
- Seguridad de datos y validación
- Base de datos relacional MySQL
- Contenerización con Docker
- CI/CD automatizado con GitHub Actions

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │───▶│     Backend     │───▶│   Base de Datos │
│  (HTML/CSS/JS)  │    │    (FastAPI)    │    │     (MySQL)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────▶│  Pipeline ETL   │◀─────────────┘
                        │   (Prefect)     │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   API Externa   │
                        │ (OpenWeather)   │
                        └─────────────────┘
```

## 🚀 Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

1. **Ejecutar con Docker**
   ```bash
   docker-compose up -d
   ```

2. **Acceder a la aplicación**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - Documentación: http://localhost:8000/docs

### Opción 2: Instalación Manual

1. **Configurar base de datos**
   ```bash
   mysql -u root -p < backend/schema.sql
   ```

2. **Ejecutar backend**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

3. **Abrir frontend**
   - Abrir `frontend/index.html` en navegador

## 🔄 Pipeline de Datos

### Ejecución Manual del Pipeline
```bash
cd pipeline
python etl_flow.py
```

### Programación Automática
```bash
python deploy.py
prefect agent start -q default
```

## 📊 Funcionalidades Principales

### ✅ CRUD Completo
- Crear, leer, actualizar reservas de hotel
- Sistema de contacto y mensajería
- Gestión de habitaciones

### ✅ API Externa Integrada
- Consumo de OpenWeatherMap API
- Datos del clima en tiempo real
- Almacenamiento local de datos climáticos

### ✅ Pipeline de Datos ETL
- Extracción de datos RAW desde MySQL
- Limpieza y validación de datos
- Logs de calidad de datos en JSON
- Backups automáticos en CSV

### ✅ Seguridad de Datos
- Validación de entradas con Pydantic
- Sanitización con Bleach
- Protección contra inyección SQL
- Variables de entorno para credenciales

### ✅ DevOps y Despliegue
- Contenerización completa con Docker
- CI/CD con GitHub Actions
- Tests automatizados

## 📁 Estructura del Proyecto

```
hotel-costa-bella/
├── frontend/               # Aplicación frontend
├── backend/               # API Backend
├── pipeline/             # Pipeline de datos
├── .github/workflows/    # CI/CD
├── docker-compose.yml    # Orquestación
└── README.md            # Documentación
```

## 🧪 Testing

```bash
cd backend
pytest tests/ -v
```

## 📞 Contacto

- **Email**: reservas@costabella.com
- **Teléfono**: +506 4000-1234
- **Ubicación**: Playa Blanca, Costa Rica

---

### 🎯 Cumplimiento de Requerimientos

✅ **CRUD completo** - Reservas y contactos  
✅ **API externa** - OpenWeatherMap integrada  
✅ **API interna** - REST endpoints documentados  
✅ **Pipeline ETL** - Prefect con logs y backups  
✅ **Seguridad** - Validación y sanitización  
✅ **Base de datos** - MySQL con esquemas normalizados  
✅ **DevOps** - Docker + CI/CD con GitHub Actions  
✅ **Documentación** - README completo y API docs  

**Estado del proyecto**: ✅ **COMPLETO** - Listo para entrega y demostración

## Requisitos previos
1. **MySQL Server** instalado y ejecutándose
2. **Python 3.12** (ya configurado)

## Configuración de la base de datos

### Paso 1: Crear la base de datos
Ejecuta el archivo `schema.sql` en MySQL:

```sql
-- Conectarse a MySQL y ejecutar:
mysql -u root -p < schema.sql
```

O desde MySQL Workbench/phpMyAdmin, ejecuta el contenido de `schema.sql`.

### Paso 2: Verificar la conexión

```python
DB_URL = "mysql+mysqlconnector://root:Leen1970*@localhost:3306/hotel_reservas"
```

Cambia `root` y `Leen1970*` por tu usuario y contraseña de MySQL.

## Ejecución del proyecto

### Método 1: Usar el script automático
1. Ejecuta el archivo `run.bat` (doble clic)
2. Se abrirá una ventana de terminal con el servidor ejecutándose

### Método 2: Ejecución manual
1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta:
```powershell
"C:/Users/kathd/OneDrive/Documentos/ULEAD/Programacion Web/Entregable 1/venv/Scripts/python.exe" -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Acceso a la aplicación

1. **Backend API**: http://localhost:8000
   - Documentación automática: http://localhost:8000/docs
   
2. **Frontend**: Abre el archivo `index.html` en tu navegador
   - Puedes hacer doble clic en `index.html`
   - O abrir con tu navegador favorito

## Estructura del proyecto

- `main.py` - Servidor FastAPI (backend)
- `index.html` - Página principal (frontend)
- `script.js` - Lógica JavaScript
- `styles.css` - Estilos CSS
- `schema.sql` - Esquema de base de datos
- `requirements.txt` - Dependencias Python
- `run.bat` - Script para ejecutar el proyecto

## Funcionalidades

1. **Reservas de habitaciones**
2. **Formulario de contacto**
3. **Galería de habitaciones**
4. **API REST para gestión de datos**
