# Configurar Supabase para Ficción Oculta

1. Crea un proyecto en Supabase y abre **SQL Editor**.
2. Ejecuta todo el contenido de `supabase/schema.sql`.
3. En **Authentication > Users**, crea tu usuario con correo y contraseña.
4. En SQL Editor, concede permisos únicamente a ese usuario:

   ```sql
   update public.profiles
   set is_admin = true
   where email = 'TU_CORREO_REAL';
   ```

5. Copia desde **Project Settings > API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
6. Añade ambas variables en Vercel para **Production**, **Preview** y **Development**, y vuelve a desplegar.
7. Abre `/acceso`, inicia sesión y pulsa **Importar las seis historias**.

La aplicación no necesita ni utiliza la clave `service_role`. Las escrituras se autorizan mediante la sesión del administrador y políticas RLS.
