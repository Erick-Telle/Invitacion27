# Invitación XV años – Proyecto

## Descripción
Este repositorio contiene la invitación digital interactiva para la quinceañera **Alba Guissell Díaz Reyes**. La web está construida con HTML, CSS, JavaScript y **GSAP** para las animaciones, y se despliega en **GitHub Pages**.

## Tecnologías
- **HTML5** + **CSS3** (variables, flexbox, media queries)
- **JavaScript ES6**
- **GSAP** para la animación de la portada (libro‑llave)
- **Vite** como bundler / dev server (hot‑reload)
- **Supabase** (Base de datos y API) – usa una clave estática (`ADMIN_API_KEY`) definida en `.env`
- **Git** para control de versiones
- **GitHub Pages** para publicación gratuita

## Estructura del proyecto
```
Invitacion-15-anios/
│
├─ public/                 # archivos estáticos (favicon, imágenes, audio)
│   ├─ assets/
│   │   ├─ images/          # fotos del evento (añadir aquí)
│   │   ├─ audio/           # pista musical (ej. bg.mp3)
│   │   └─ fonts/           # tipografías web‑font
│   └─ favicon.ico
│
├─ src/                     # código fuente
│   ├─ index.html
│   ├─ css/
│   │   ├─ base.css
│   │   ├─ cover.css
│   │   ├─ sections.css
│   │   └─ components.css
│   ├─ js/
│   │   ├─ main.js
│   │   ├─ cover.js
│   │   ├─ scroll.js
│   │   ├─ audio.js
│   │   ├─ gallery.js
│   │   ├─ rsvp.js
│   │   └─ admin.js
│   └─ data/
│       └─ config.json        # colores, textos, datos que pueden editarse
│
├─ supabase/
│   └─ schema.sql            # definición de tabla y políticas RLS
│
├─ .env.example              # ejemplo de variables de entorno
├─ .gitignore
├─ package.json
├─ vite.config.js
└─ README.md
```

## Requisitos previos
- **Node.js** (v18 o superior) y **npm**
- Una cuenta en **Supabase**
- Un repositorio GitHub (para habilitar GitHub Pages)

## Configuración local
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/Invitacion-15-anios.git
   cd Invitacion-15-anios
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Crear archivo `.env`** basado en `.env.example` y rellenar los valores de Supabase y la clave API estática:
   ```bash
   cp .env.example .env
   ```
   ```dotenv
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=public-anon-key
   ADMIN_API_KEY=tu-clave-secreta-para-admin
   ```
4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre `http://localhost:5173` y verifica la página.

## Compilación para producción
```bash
npm run build
```
Esto generará la carpeta `dist/` lista para subir a GitHub Pages.

## Publicar en GitHub Pages
1. Commit y push al branch `main` (o `gh-pages` según la configuración).
2. En el repositorio de GitHub, ve a **Settings → Pages** y elige la carpeta `dist` como origen.
3. GitHub generará la URL `https://<usuario>.github.io/Invitacion-15-anios/`.

## Supabase – Configuración rápida
1. Crear un proyecto en Supabase.
2. Ejecutar el script `supabase/schema.sql` desde la consola SQL de Supabase.
3. En **Authentication → Settings**, desactivar el registro de usuarios (solo usaremos la clave API).
4. Copiar `url` y `anon key` al archivo `.env`.

## Notas sobre la autenticación del panel admin
El panel (`admin.html`) verifica la cabecera `X-Admin-Api-Key` contra la variable `ADMIN_API_KEY`. Sólo quien conozca esa clave podrá acceder al listado de RSVPs.

## Desarrollo futuro
- Añadir la galería de fotos (`gallery.js`).
- Completar la lógica del formulario RSVP (`rsvp.js`).
- Integrar el reproductor de música (`audio.js`).
- Refinar la animación de apertura con GSAP (`cover.js`).

---
**¡Listo para comenzar!**
