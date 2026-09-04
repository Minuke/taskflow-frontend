# TaskFlow — Frontend

TaskFlow es una aplicación web de gestión personal de tareas. Permite a cada usuario registrarse, iniciar sesión y organizar sus propias tareas mediante categorías, con búsqueda, filtros combinables, ordenación, paginación y un dashboard con el resumen de su actividad.

Este repositorio contiene **exclusivamente el frontend**, construido con Angular 22. En esta fase (Fase A del proyecto) toda la persistencia es simulada en memoria (con respaldo en `localStorage` para las preferencias de filtros) — no existe backend real todavía. Esa parte llega en fases posteriores del proyecto.

## Estado actual

✅ **Fase A completa** — demo visual funcional de principio a fin, sin backend real:

- Registro, login y logout simulados, con guard de rutas privadas.
- CRUD completo de categorías y tareas.
- Búsqueda, filtros combinables, ordenación y paginación de tareas, con persistencia de la configuración del usuario en `localStorage`.
- Dashboard con resumen, tareas próximas, prioritarias y recientes.
- Estados de carga, vacío y error en todos los listados.
- Diseño responsive (mobile-first) con transiciones de navegación.
- Formateo y linting automatizado con Biome + Husky, y análisis de calidad con SonarQube.

## Stack técnico

- **Angular 22** — standalone components, sin `NgModule`, **zoneless** (sin `zone.js`).
- **Signal Forms** (`@angular/forms/signals`) para todos los formularios de la aplicación.
- **Signals** como único mecanismo de estado — sin `RxJS` para estado de UI (sí se usa `toSignal()` puntualmente para interoperar con el Router).
- **SCSS** con arquitectura 7+1 (`abstracts`, `base`, `components`, `layout`, `pages`, `themes`, `vendors`).
- **Biome** como formateador y linter (sustituye a ESLint + Prettier), con Husky + lint-staged en el pre-commit.
- **SonarQube** (vía Docker Compose) para análisis de calidad de código en local.

## Arquitectura

```
src/app/
├── core/          # Modelos, stores, guards, utilidades y pipes transversales.
│   ├── models/    # Interfaces y enums de dominio (Task, Category, User, Priority...).
│   ├── services/  # Signal Stores (@Service()): AuthStore, TasksStore, CategoriesStore, TaskFiltersStore.
│   ├── guards/    # authGuard.
│   ├── pipes/     # priorityLabel, friendlyDate.
│   └── utils/     # Funciones puras: fechas, prioridad, estado de carga simulado.
├── features/      # Una carpeta por dominio funcional. Cada feature es una isla:
│   │                nunca importa de otra feature.
│   ├── auth/
│   ├── tasks/
│   ├── categories/
│   └── dashboard/
│       ├── pages/       # Una Page por ruta. Sin lógica ni inyección de servicios.
│       └── components/  # Componentes "inteligentes" y presentacionales de la feature.
└── shared/
    └── components/  # Componentes puramente presentacionales, reutilizables entre features
                       # (ConfirmDialog, Pagination, SkeletonList, Navigation).
```

**Patrón Page → Component:** cada ruta apunta a una Page cuyo único trabajo es componer el layout. Toda la lógica (stores, formularios, estado local) vive en componentes dentro de `features/*/components/`. Por ejemplo, `TasksPage` no inyecta nada — solo renderiza `<app-task-list>`, que sí orquesta filtros, paginación y CRUD.

**Alias de rutas** (`tsconfig.json`): `@core/*`, `@features/*`, `@shared/*`.

## Decisiones técnicas relevantes

- **Zoneless por defecto**: Angular 22 ya no depende de `zone.js`; la detección de cambios se basa enteramente en signals.
- **`@Service()` en vez de `@Injectable({ providedIn: 'root' })`**: es el decorador por defecto que genera `ng generate service` en Angular 22 — equivalente, pero fuerza el uso de `inject()` en vez de inyección por constructor.
- **Stores por dominio, no un único store global**: `TasksStore`, `CategoriesStore` y `AuthStore` viven en `core/services/` porque varias features necesitan leerlos de forma cruzada (p. ej. `CategoryList` necesita `TasksStore` para contar tareas por categoría). El estado de **UI** (filtros, paginación, edición en curso) vive en el componente o en un store dedicado (`TaskFiltersStore`), nunca mezclado con los datos de dominio.
- **Persistencia de filtros con `localStorage`**: `TaskFiltersStore` guarda automáticamente cualquier cambio de filtro/orden y lo recupera al recargar la página. Es un patrón legítimo para preferencias de interfaz (no para datos sensibles).
- **Reset CSS portable + defaults del proyecto separados**: `base/_reset.scss` es un reset moderno reutilizable en cualquier proyecto (sin colores ni tokens); `base/_defaults.scss` contiene los estilos específicos de TaskFlow (tipografía, botones, colores) que si se reutiliza el reset en otro proyecto no haría falta arrastrar.
- **`withComponentInputBinding()`**: los parámetros de ruta (`:id`) y los query params (`?categoryId=`, `?returnTo=`) se reciben directamente como `input()` en los componentes enrutados, sin `ActivatedRoute`/`snapshot` manual.
- **Navegación "volver atrás" con `returnTo`**: al ver el detalle de una tarea desde el Dashboard, desde `/tasks` o desde el detalle de una categoría, las acciones de editar/completar/eliminar devuelven al usuario exactamente al punto de partida (vía query param `returnTo`), no siempre a `/tasks`.
- **`View Transitions API`** (`withViewTransitions()`): transición suave entre rutas, con soporte de `prefers-reduced-motion`.
- **Tarjetas completas clicables** (patrón *stretched link*): un `<a>` absoluto cubre toda la card con `z-index` inferior al de los botones de acción, evitando anidar interactivos dentro de un `<a>`.

## Modelo de dominio

- **User**: `id`, `name`, `email`, `createdAt`, `updatedAt` (la contraseña nunca se expone fuera de `AuthStore`).
- **Category**: `id`, `name`, `description`, `userId`, `createdAt`, `updatedAt`.
- **Task**: `id`, `title`, `description`, `priority` (`low` | `medium` | `high`), `estimatedHours`, `completed`, `dueDate`, `image`, `categoryId`, `userId`, `createdAt`, `updatedAt`.

Cada usuario solo ve sus propias tareas y categorías — el filtrado por `userId` ocurre de forma centralizada en los `computed()` `userTasks`/`userCategories` de cada store, nunca de forma ad-hoc en los componentes.

## Cómo ejecutar el proyecto en local

### Requisitos

- Node.js 20.19+ o 22.12+
- Angular CLI 22

### Instalación

```bash
npm install
```

### Arrancar en desarrollo

```bash
npm start
```

Abre `http://localhost:4200`. Usuario de prueba ya disponible sin necesidad de registro:

- **Email:** `admin@taskflow.dev`
- **Contraseña:** `Admin1234`

### Build de producción

```bash
npm run build
```

### Calidad de código

```bash
npm run check       # Biome: formatea y lintea src/ con autofix
npm run check:ci     # Biome en modo CI (sin escribir, con reporter para GitHub Actions)
npm run sonar        # Análisis con SonarQube (requiere el servidor local corriendo, ver abajo)
```

Husky ejecuta `lint-staged` automáticamente en cada commit, aplicando `biome check --write` solo a los archivos modificados.

### SonarQube en local (opcional)

```bash
docker compose -f docker-compose.sonar.yml up -d
```

Espera a que arranque (`docker compose -f docker-compose.sonar.yml logs -f sonarqube`) y entra en `http://localhost:9000`. Necesitas un archivo `.env` (no versionado) con `SONAR_TOKEN=<tu-token>` — usa `.env.example` como plantilla.

## Funcionalidades implementadas

### Autenticación
- Registro con validación (nombre, email, contraseña, confirmación coincidente).
- Login con feedback de error genérico (no revela si falla el email o la contraseña).
- Logout con confirmación (`ConfirmDialog` reutilizable en toda la app).
- Guard de rutas privadas (`authGuard`).

### Tareas
- Crear (en página propia `/tasks/new`, con opción de preseleccionar categoría vía query param), editar (`/tasks/:id/edit`), ver detalle (`/tasks/:id`), completar y eliminar (con confirmación).
- Validaciones: título obligatorio (3-80 caracteres), horas estimadas no negativas, fecha límite no anterior a hoy, descripción hasta 500 caracteres.
- Imagen opcional (preview local con `FileReader`, sin subida a servidor todavía).
- Búsqueda por título/descripción, filtros combinables (estado, prioridad, categoría, fecha), ordenación con desempate automático por prioridad, paginación (10 por página).
- Filtros persistidos en `localStorage`, con feedback visual de filtro activo.
- Tareas de prioridad Alta muestran una insignia ⭐ mientras están pendientes.

### Categorías
- CRUD completo, en páginas propias para crear/editar.
- Detalle con las tareas asociadas (como chips clicables) y botón para crear una tarea ya vinculada a esa categoría.
- Al eliminar una categoría, las tareas asociadas quedan sin categoría (nunca se eliminan).

### Dashboard
- Resumen: total, completadas, pendientes, prioritarias (prioridad Alta), vencen hoy.
- Tres columnas (Próximas, Prioritarias, Recientes) que se ocultan y redistribuyen el espacio automáticamente si no tienen contenido.
- Estado vacío con llamada a la acción para crear la primera tarea.

### Estados transversales
- `loading` (skeleton), `success`, `empty` y `error` (con reintento) en todos los listados, simulando latencia de red para no tener que cambiar el patrón de consumo cuando llegue el backend real.

## Próximos pasos

- **Fase B**: backend con FastAPI + PostgreSQL + SQLAlchemy + Alembic.
- **Fase C**: integración real frontend-backend (JWT, refresh tokens, subida de imágenes).
- **Fase D**: dockerización de ambas piezas.