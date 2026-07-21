# Mongoose Project Refactor

## What changed
- Added a product controller in `controllers/productController.js`
- Added a product router in `routes/productRouter.js`
- Added async error handling middleware in `middleware/asyncHandler.js`
- Added JWT protection middleware in `middleware/protect.js`
- Added a `/api/v1/login` endpoint to issue a test token

## Run the app
```bash
npm start
```

## Test JWT login
```bash
curl -X POST http://localhost:3000/api/v1/login
```

## Test protected product routes
```bash
curl -X GET http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes
- The app still expects a MongoDB connection string in `app.js`.
- If MongoDB authentication fails, update the connection string with your actual Atlas credentials.
