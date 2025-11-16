# Backend - Sistema de Gestión de Expedientes

API REST para gestión de casos legales con autenticación JWT, construida con Node.js, TypeScript, Express y TypeORM.


## Características

- Autenticación con JWT
- CRUD completo de expedientes
- Base de datos con TypeORM (MySQL)
- Eliminación lógica (soft delete)
- Paginación en listados
- Tests con Jest
- TypeScript en todo el proyecto

---

## Tecnologías

- Node.js 18+
- TypeScript
- Express
- TypeORM
- Mysl
- JWT
- bcrypt
- Jest


## Instalación

### 1. Clonar repositorio

```bash
git clone <https://github.com/Lione313/backend-nxt-part3.git>
cd backend-expedientes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

Crear base de datos MysqL:

```sql
CREATE DATABASE expedientes_db;
```

### 4. Configurar variables de entorno

Crear archivo `.env`:

```env
PORT=5000
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=4h

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=expedientes_db
```

---

## Ejecución

### Desarrollo

```bash
npm run dev
```

Servidor en: `http://localhost:5000`

### Producción

```bash
npm run build
npm start
```

---

## Estructura del Proyecto

```
src/
├── config/
│   └── database.ts          # Configuración TypeORM
├── controllers/
│   ├── authController.ts    # Login y registro
│   └── casosController.ts   # CRUD de casos
├── entities/
│   ├── User.ts              # Entidad usuario
│   └── Caso.ts              # Entidad caso
├── middleware/
│   └── auth.ts              # Middleware JWT
├── routes/
│   ├── authRoutes.ts        # Rutas auth
│   └── casosRoutes.ts       # Rutas casos
├── utils/
│   └── hash.ts    
    └── apiResponse.ts        #Estructura de las respuestas
├── tests/
│   ├── auth.test.ts
│   └── casos.test.ts
└── index.ts                 # Entry point
```

---

## API Endpoints

### Autenticación

#### Registro

```
POST /api/auth/register
```

**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Usuario registrado correctamente"
}
```

#### Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Usuario logeado",
  "data": {
    "token": "<JWT_TOKEN>",
    "expiresIn": "4h"
  }
}
```

---

### Gestión de Casos

> **Nota:** Todas las rutas requieren token JWT en el header:
> ```
> Authorization: Bearer <token>
> ```

#### Listar casos

```
GET /api/casos?page=1&limit=10
```

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "id": "uuid",
      "nombre": "Caso 1",
      "descripcion": "Descripción",
      "estado": "Abierto",
      "activo": true
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "lastPage": 1
  }
}
```

#### Crear caso

```
POST /api/casos
```

**Body:**
```json
{
  "nombre": "Caso nuevo",
  "descripcion": "Descripción del caso",
  "estado": "Abierto"
}
```

#### Actualizar caso

```
PUT /api/casos/:id
```

**Body:**
```json
{
  "nombre": "Caso actualizado",
  "estado": "Cerrado"
}
```

#### Eliminar caso

```
DELETE /api/casos/:id
```

---

## Testing

### Ejecutar tests

```bash
npm test
```

### Cobertura

```bash
npm run test:coverage
```

Los tests incluyen:
- Registro y login de usuarios
- CRUD completo de casos
- Validación de JWT

---

## Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de datos en todos los endpoints
- Variables sensibles en `.env` (no versionadas)

---

## Scripts disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start            # Producción
npm test             # Ejecutar tests
npm run lint         # Linter
```

---

## Licencia
Dilan Gutierrez