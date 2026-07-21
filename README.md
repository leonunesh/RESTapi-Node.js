# Mongoose Project

A small Express + Mongoose example showing basic controllers, routers, JWT protection, and centralized async error handling.

**Files:**
- **App entry:** [app.js](app.js)
- **Routes:** [routes/personRouter.js](routes/personRouter.js), [routes/productRouter.js](routes/productRouter.js)
- **Controllers:** [controllers/personController.js](controllers/personController.js), [controllers/productController.js](controllers/productController.js)
- **Models:** [models/PersonModel.js](models/PersonModel.js), [models/ProductModel.js](models/ProductModel.js)
- **Middleware:** [middleware/asyncHandler.js](middleware/asyncHandler.js), [middleware/protect.js](middleware/protect.js), [middleware/errorHandler.js](middleware/errorHandler.js)

## Refactor & New Features

This project was refactored to separate concerns and add a few useful features. Below is a concise explanation of what changed, why, and how to use the new pieces.

- **Purpose of the refactor:** move business logic out of `app.js` into controllers and routers, add centralized async error handling, add JWT-based protection middleware, and provide a reusable product controller with a flexible query parser.

- **`controllers/productController.js`:**
  - Provides standard CRUD handlers: `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`.
  - Contains a `buildFilter()` helper that parses querystring parameters into MongoDB filters and sort objects. Supported patterns:
    - `sort=field,-other` to sort ascending/descending.
    - Query operators using bracket syntax, e.g. `price[gt]=10` → `{ price: { $gt: 10 } }`.
    - Range syntax: `btw:LOW:HIGH` or `between:LOW:HIGH` for inclusive ranges.
    - Operator prefix syntax: `lt:100`, `gte:5`, etc.
    - Boolean and numeric parsing for query values (`"true"` → `true`, numeric strings → numbers).
  - Responds with consistent JSON envelope `{ status, data }` and appropriate HTTP status codes.

- **`routes/productRouter.js`:**
  - Declares RESTful product routes (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`).
  - Each route is wrapped with `asyncHandler` and protected by `protect` middleware so only requests with a valid JWT are allowed.
  - This router is ready to be mounted (e.g. `app.use('/api/v1/products', require('./routes/productRouter'))`). Note: `app.js` currently also includes inline product endpoints — the router is provided for a cleaner separation and re-use.

- **`middleware/asyncHandler.js`:**
  - Small helper that wraps async route handlers and forwards thrown/rejected errors to Express `next()` so the centralized error handler receives them.


# Mongoose Project (Refactor)

This repository is a compact Express + Mongoose example that was refactored to improve separation of concerns and to add small, practical features: organized controllers and routers, centralized async error handling, JWT-based protection middleware, and a flexible product query parser.

**Quick start**

- Install dependencies:

```bash
npm install
```

- Create a `.env` in the project root (example below) and start the app:

```bash
npm start
```

## .env example

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your_jwt_secret_here
```

## What changed (high level)

- Moved route handling into dedicated routers and controllers for clarity and reuse.
- Added `asyncHandler` to simplify async route error forwarding.
- Added `protect` middleware to require Bearer JWTs on protected routes.
- Consolidated error handling in `middleware/errorHandler.js` (maps common Mongoose errors).
- Added a reusable `productController` with a flexible query parser for filtering and sorting.

## Project layout

- App entry: [app.js](app.js)
- Routes: [routes/personRouter.js](routes/personRouter.js), [routes/productRouter.js](routes/productRouter.js)
- Controllers: [controllers/personController.js](controllers/personController.js), [controllers/productController.js](controllers/productController.js)
- Models: [models/PersonModel.js](models/PersonModel.js), [models/ProductModel.js](models/ProductModel.js)
- Middleware: [middleware/asyncHandler.js](middleware/asyncHandler.js), [middleware/protect.js](middleware/protect.js), [middleware/errorHandler.js](middleware/errorHandler.js)

## Key details

- Authentication:
  - A simple test login endpoint exists at `POST /api/v1/login` which returns a signed JWT (1 hour expiration). Use the returned token as `Authorization: Bearer <token>` for protected routes.

- Product endpoints (examples):
  - `GET /api/v1/products` — list products (protected).
  - `GET /api/v1/products/:id` — get by id (protected).
  - `POST /api/v1/products` — create product (protected).
  - `PUT /api/v1/products/:id` — update (protected).
  - `DELETE /api/v1/products/:id` — delete (protected).

- Query filtering and sorting (in `productController`):
  - `sort=field,-other` — sort ascending/descending.
  - Operators via `field[gt]=10`, `field[gte]=5`, `field[lt]=100`, etc.
  - Range syntax: `field=between:10:20` or `field=btw:10:20`.
  - Operator prefix: `field=lt:100`.
  - Values parsed to booleans and numbers when applicable.

  Example:

  ```bash
  curl "http://localhost:3000/api/v1/products?price[gte]=10&sort=-price"
  ```

- Error handling:
  - `CastError` → 400 (invalid ID).
  - `ValidationError` → 400 (validation message).
  - Other errors → 500.

## Recommendations

- For cleaner structure, mount `routes/productRouter.js` in `app.js` and remove the inline product routes that currently exist in `app.js`.
- Set a secure `JWT_SECRET` in production and avoid the default `'super-secret-key'`.
- If exposing the query parser publicly, add input validation or whitelist allowed fields to prevent unexpected queries.

## Examples

- Get a test token:

```bash
curl -X POST http://localhost:3000/api/v1/login
```

- Use the token to list products:

```bash
curl -X GET http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Contact

Author: Leonardo
```

Replace `YOUR_TOKEN` with the token returned by the login endpoint.

## Notes

- Ensure `MONGO_URI` in your `.env` points to a reachable MongoDB instance.

## Contact

Project author: Leonardo

