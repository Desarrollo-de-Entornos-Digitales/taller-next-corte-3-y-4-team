<div align="center">

# 🎨 LUDIX

### Plataforma de Bienestar Creativo

_Supera el bloqueo creativo con ejercicios guiados, gamificación y comunidad_

[Frontend](taller-next-corte-3-y-4-team.vercel.app) · [Documentación API](https://ludix-backend-production.up.railway.app/api) · [Backend](https://ludix-backend-production.up.railway.app) · [Figma](https://www.figma.com/design/JJHPU9YyjhCcyDmMsFkT5R/Pantallas?node-id=19-2&t=qKnz9h0Mwd6Vec4L-1)

</div>

---

## ¿Qué es LUDIX?

LUDIX es una plataforma web pensada para **diseñadores, ilustradores, animadores y creativos** que enfrentan bloqueos en su proceso creativo. A través de ejercicios guiados, un sistema de logros y una comunidad de apoyo, LUDIX convierte el bienestar creativo en una experiencia motivadora y sostenible.

---

## ✨ Funcionalidades

### Usuarios

| Funcionalidad             | Descripción                                          |
| ------------------------- | ---------------------------------------------------- |
| 🔐 **Autenticación**      | Registro, login y cierre de sesión con JWT           |
| 🧭 **Onboarding**         | Selección de área creativa, biografía y ubicación    |
| 🏠 **Feed personalizado** | Ejercicios adaptados según estado de ánimo           |
| 📚 **Catálogo**           | Búsqueda y filtrado por tipo de ejercicio            |
| ⭐ **Favoritos**          | Guarda ejercicios para volver a ellos cuando quieras |
| 📊 **Historial**          | Seguimiento de ejercicios completados                |
| 🏆 **Logros**             | Sistema de gamificación con logros automáticos       |
| 💬 **Comentarios**        | Comparte y discute con la comunidad                  |
| 👤 **Perfil**             | Edición de datos personales y contraseña             |
| 🔥 **Racha diaria**       | Seguimiento de días consecutivos de práctica         |

### Administradores

| Funcionalidad                | Descripción                                     |
| ---------------------------- | ----------------------------------------------- |
| 🚫 **Gestión de usuarios**   | Bloquear/desbloquear usuarios con justificación |
| 🏆 **Gestión de logros**     | CRUD completo de logros                         |
| 💪 **Gestión de ejercicios** | CRUD completo de ejercicios                     |
| 🔑 **Gestión de permisos**   | Asignación de permisos por roles                |

---

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 16** + **React 19** + **TypeScript**
- **Tailwind CSS** para estilos
- **Lucide React** para iconografía
- **Context API** para manejo de estado global

### Backend

- **NestJS 11** con arquitectura modular
- **TypeORM** + **PostgreSQL** para persistencia
- **JWT** para autenticación y **bcrypt** para hashing de contraseñas

### Testing & Despliegue

- **Cypress** para pruebas E2E
- **Vercel** (frontend) · **Railway** (backend + base de datos)

---

## 🎨 Sistema de Diseño

LUDIX utiliza un estilo visual **neobrutalista** con los siguientes tokens de diseño:

| Token                   | Valor                 |
| ----------------------- | --------------------- |
| Morado principal        | `#8B5BDB`             |
| Crema/Beige             | `#F5F1E8`             |
| Negro                   | `#1A1A1A`             |
| Verde (Ideación)        | `#B8E8D0`             |
| Rosado (Desbloqueo)     | `#F9C8CF`             |
| Amarillo (Pausa activa) | `#FFE5A0`             |
| Sombra sólida           | `6px 6px 0px #1A1A1A` |
| Border radius cards     | `28px` / `22px`       |
| Tipografía              | Nunito / Poppins      |

---

## 🚀 Instalación local

**Requisitos:** Node.js 18+ y npm

```bash
# 1. Clonar el repositorio
git clone https://github.com/Desarrollo-de-Entornos-Digitales/taller-next-corte-3-y-4-team.git
cd taller-next-corte-3-y-4-team

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
echo "NEXT_PUBLIC_API_URL=https://ludix-backend-production.up.railway.app" > .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
# → Abre http://localhost:3000
```

---

## 🧪 Pruebas E2E con Cypress

```bash
# Abrir la interfaz gráfica de Cypress
npx cypress open

# Ejecutar en modo headless (CI)
npx cypress run
```

| Archivo              | Cobertura                    |
| -------------------- | ---------------------------- |
| `auth.cy.ts`         | Login exitoso y fallido      |
| `register.cy.ts`     | Flujo de registro            |
| `feed.cy.ts`         | Carga del feed               |
| `catalog.cy.ts`      | Filtros y favoritos          |
| `favorites.cy.ts`    | Gestión de favoritos         |
| `history.cy.ts`      | Historial de ejercicios      |
| `profile.cy.ts`      | Edición de perfil            |
| `achievements.cy.ts` | Sistema de logros            |
| `onboarding.cy.ts`   | Flujo de onboarding completo |

---

## 🔐 Autenticación y Roles

El flujo de autenticación funciona así:

1. El usuario envía credenciales a `/auth/login`
2. El backend valida y retorna un **JWT**
3. El token se almacena en `localStorage`
4. Cada petición incluye `Authorization: Bearer <token>`
5. Al cerrar sesión, el token es eliminado

| Rol     | Acceso                                   |
| ------- | ---------------------------------------- |
| `user`  | Funcionalidades propias de la plataforma |
| `admin` | Gestión completa de contenido y usuarios |

---

## 🗂️ Gestión de Estado

La app utiliza **Context API** con dos contextos globales definidos en `layout.tsx`:

**`NotificationContext`** — Notificaciones tipo toast en toda la app:

```tsx
const { showNotification } = useNotifications();
showNotification('Ejercicio guardado', 'success');
```

**`LoadingContext`** — Spinner de carga global:

```tsx
const { withLoading } = useLoading();
const result = await withLoading(fetchData());
```

---

## 👥 Equipo

| Integrante        | Rol |
| ----------------- | --- |
| Valentina Ordoñez |     |
| Maria Jose Bacca  |     |
| Laura Pérez       |     |
| Susana Lecompte   |     |

**Docente:** Kevin Rodríguez — kdrodriguez@icesi.edu.co

---
