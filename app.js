require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ProductModel = require('./models/ProductModel');
const asyncHandler = require('./middleware/asyncHandler');
const errorHandler = require('./middleware/errorHandler');
const protect = require('./middleware/protect');
const personRouter = require('./routes/personRouter');

const app = express();
app.use(express.json());

const connectionString = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.all('/api/v1/login', (req, res) => {
  const token = jwt.sign({ sub: 'demo-user', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ status: 'success', token });
});

app.get(['/api/v1/products', '/api/v1/product'], protect, asyncHandler(async (req, res) => {
  const data = await ProductModel.find();
  res.status(200).json({ status: 'success', data });
}));

app.get(['/api/v1/products/:id', '/api/v1/product/:id'], protect, asyncHandler(async (req, res) => {
  const data = await ProductModel.findById(req.params.id);
  res.status(200).json({ status: 'success', data });
}));

app.post(['/api/v1/products', '/api/v1/product'], protect, asyncHandler(async (req, res) => {
  const product = req.body;
  const newProduct = await ProductModel.create(product);
  res.status(201).json({ status: 'success', data: newProduct });
}));

app.put(['/api/v1/products/:id', '/api/v1/product/:id'], protect, asyncHandler(async (req, res) => {
  const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updatedProduct) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }
  res.status(200).json({ status: 'success', data: updatedProduct });
}));

app.delete(['/api/v1/products/:id', '/api/v1/product/:id'], protect, asyncHandler(async (req, res) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }
  res.status(200).json({ status: 'success', data: deletedProduct });
}));

app.use('/api/v1/person', personRouter);
app.use(errorHandler);

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });