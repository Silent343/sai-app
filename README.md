# SAI · Sistema de Asistencia Inteligente

Reconstrucción de la app original **sai-app** (HTML/CSS/JS vanilla) hacia un
entorno profesional en **TypeScript + Vue 3**, aplicando **DDD**, **Clean
Architecture** y **principios SOLID**.

La app **no tiene landing**: abre directamente en el asistente (`/chat`). Los
visitantes anónimos se redirigen a `/login`.

---

## Bounded contexts

| Contexto | Qué hace | Persistencia |
|----------|----------|--------------|
| **iam** | Registro, login, perfil, cambio de contraseña, baja de cuenta. | json-server (`/users`) |
| **assistant** | Chat de orientación en salud con IA (Gemini) + historial de conversaciones. | json-server (`/conversations`) + proxy Gemini |
| **outbreaks** | Reportes comunitarios de enfermedades por distrito + mapa de Lima. | json-server (`/reports`) |
| **library** | Videos guía recomendados sobre enfermedades infecciosas. | json-server (`/videos`) |

Cada contexto mantiene las cuatro capas con la **regla de dependencia** estricta:
`domain → application → infrastructure → presentation` (las dependencias siempre
apuntan hacia el dominio, que no conoce a nadie).

```
src/
├── shared/            kernel comun (Result, Entity, ValueObject, HttpClient, toasts, AppNav)
├── iam/               domain · application · infrastructure · presentation
├── assistant/         domain · application · infrastructure · presentation
├── outbreaks/         domain · application · infrastructure · presentation
├── library/           domain · application · infrastructure · presentation
├── router/            rutas + guards globales
└── styles/            tokens.css + base.css
server/
├── db.json            datos seed (users, conversations, reports, videos)
├── routes.json        /api/v1/* -> /$1
└── ai/gemini-proxy.mjs  backend que oculta la API key de Gemini
```

---

## El asistente de IA (Gemini) y la seguridad de la API key

La key de Gemini **nunca vive en el frontend**. Vite expone al bundle todo lo que
empiece con `VITE_`, asi que una key ahi seria publica. En su lugar:

```
Vue (GeminiChatAssistant)  --HTTP-->  server/ai/gemini-proxy.mjs  -->  Gemini API
        (puerto ChatAssistant)              (lee GEMINI_API_KEY de process.env)
```

El dominio solo conoce el puerto `ChatAssistant`. El adapter llama a **nuestro
propio backend** (`/api/v1/assistant/reply`), y ese backend es el unico que ve la
key. Cambiar Gemini por otro proveedor (p. ej. Claude) es un cambio de server: el
frontend ni se entera.

### Configurar la key

1. Copia `.env.example` a `.env`.
2. Pega tu API key de Gemini en `GEMINI_API_KEY` (generala/regenerala en Google
   AI Studio). El archivo `.env` esta en `.gitignore`, no se versiona.

```bash
cp .env.example .env
# edita .env y reemplaza tu_api_key_aqui por tu key real
```

---

## Como ejecutar

Requisitos: Node 18+.

```bash
npm install
npm run start   # json-server (:3000) + proxy Gemini (:4000) + Vite (:5173)
```

Scripts individuales: `npm run server`, `npm run ai`, `npm run dev`,
`npm run build`, `npm run preview`, `npm run typecheck`.

### Credenciales de prueba (seed)

| Email | Contrasena | Rol |
|-------|-----------|-----|
| `gabriel@sai.pe` | `Sai12345!` | specialist |
| `ana@sai.pe` | `Demo12345!` | patient |
| `hector@sai.pe` | `Demo12345!` | patient |

Las contrasenas se guardan como `SHA-256(salt:password)`, nunca en texto plano.

---

## Como se mapea SOLID

- **S** - cada use-case resuelve una sola intencion (`SendMessageUseCase`,
  `ReportOutbreakUseCase`); cada VO encapsula una sola regla.
- **O** - se extiende con nuevos adapters/use-cases sin tocar el dominio.
- **L** - cualquier implementacion de un puerto (`ChatAssistant`,
  `ConversationRepository`) es intercambiable.
- **I** - puertos pequenos y especificos (`HttpClient`, `ChatAssistant`,
  `IdGenerator`) en lugar de interfaces monoliticas.
- **D** - la aplicacion depende de puertos del dominio; las implementaciones
  concretas se inyectan en cada `*.container.ts` (composition root).

Los errores de negocio se modelan con `Result<Output, DomainError>`: el flujo
normal no lanza excepciones, solo los casos verdaderamente excepcionales.

---

## Que se reconstruyo vs. el original

El core del original vivia en `SAIgpt/` (chat IA, mapa de brotes, videos) con
logica en archivos JS sueltos sobre `localStorage`. Aqui eso se reconstruyo como
tres bounded contexts en TypeScript con dominio puro, casos de uso, repositorios
sobre json-server (CRUD real) y un proxy seguro para la IA. El IAM aporta la
autenticacion y el perfil. Se elimino la landing para entrar directo al asistente.
