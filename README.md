# Historias

Biblioteca editorial de relatos de suspense, intriga, aventura y acción construida con Next.js 16, React 19, TypeScript y Tailwind CSS.

## Estado actual

- Portada cinematográfica responsive.
- Biblioteca con búsqueda y filtros por género.
- Ficha individual con 20 capítulos por historia.
- Lector con progreso, tres temas y tamaño de texto regulable.
- Panel editorial y flujo de importación de historias completas.
- Borradores locales de demostración.
- Esquema de Supabase preparado en `supabase/schema.sql`.

El contenido actual es demostrativo. El panel todavía no publica en la web: se conectará a Supabase Auth, Database y Storage en la siguiente fase.

## Desarrollo

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Rutas principales

- `/` — portada.
- `/historias` — biblioteca.
- `/historias/[slug]` — ficha de historia.
- `/historias/[slug]/capitulo/[chapter]` — lector.
- `/admin` — panel editorial en preparación.
- `/admin/historias/nueva` — importador de historias.

## Próxima fase: Supabase

1. Crear o vincular el proyecto de Supabase.
2. Ejecutar `supabase/schema.sql`.
3. Configurar las variables de `.env.example` en local y Vercel.
4. Sustituir los datos demostrativos de `src/lib/stories.ts` por el repositorio de Supabase.
5. Proteger `/admin` mediante Supabase Auth.
