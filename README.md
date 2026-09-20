# Ficción Oculta

Plataforma editorial de historias originales de suspense, intriga, aventura y acción. Está construida con Next.js 16, React 19, TypeScript, Tailwind CSS y Supabase.

## Funciones disponibles

- Portada y biblioteca responsive con búsqueda y filtros.
- Fichas de historia y lector por capítulos.
- Seis historias iniciales con 20 capítulos cada una.
- CMS privado en `/admin`, protegido con Supabase Auth y un permiso `is_admin` adicional.
- Edición de títulos, frases promocionales, sinopsis, géneros, estados, historia destacada y capítulos.
- Portadas JPG, PNG o WebP almacenadas en Supabase Storage, con vista previa, sustitución y eliminación segura.
- Portadas gráficas locales como respaldo mientras no haya una imagen subida.
- Lectura pública desde Supabase con respaldo local cuando Supabase no está configurado o no responde.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Configurar el CMS

Sigue [supabase/SETUP.md](supabase/SETUP.md). No se necesita ni se debe exponer una clave `service_role`.

## Rutas principales

- `/` — portada pública.
- `/historias` — biblioteca.
- `/historias/[slug]` — ficha y capítulos.
- `/historias/[slug]/capitulo/[chapter]` — lector.
- `/acceso` — inicio de sesión del administrador.
- `/admin` — CMS editorial.
- `/admin/historias/[slug]` — edición de historia y portada.
- `/admin/historias/[slug]/capitulo/[chapter]` — edición de capítulo.
