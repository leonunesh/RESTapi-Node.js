const ProductModel = require('../models/ProductModel');

function parseQueryValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => parseQueryValue(item));
  }

  if (typeof value !== 'string') {
    return value;
  }

  if (value === 'true') return true;
  if (value === 'false') return false;

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? value : numericValue;
}

function buildFilter(query = {}) {
  const filter = {};
  const sort = {};

  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;

    if (key === 'sort') {
      const sortValue = Array.isArray(value) ? value[0] : value;
      const sortFields = String(sortValue).split(',');
      sortFields.forEach((field) => {
        const trimmed = field.trim();
        if (!trimmed) return;
        const direction = trimmed.startsWith('-') ? -1 : 1;
        const fieldName = trimmed.replace(/^[+-]/, '');
        sort[fieldName] = direction;
      });
      return;
    }

    if (['page', 'limit'].includes(key)) return;

    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      const bracketMatch = key.match(/^([^\[]+?)\[(.+)\]$/);
      if (bracketMatch) {
        const [, field, operator] = bracketMatch;
        if (!filter[field]) {
          filter[field] = {};
        }
        filter[field][`$${operator}`] = parseQueryValue(item);
        return;
      }

      const betweenMatch = String(item).match(/^(between|btw):(.+):(.+)$/i);
      if (betweenMatch) {
        const [, , lowerValue, upperValue] = betweenMatch;
        if (!filter[key]) {
          filter[key] = {};
        }
        filter[key].$gte = parseQueryValue(lowerValue);
        filter[key].$lte = parseQueryValue(upperValue);
        return;
      }

      const operatorMatch = String(item).match(/^([a-z]+):(.+)$/i);
      if (operatorMatch) {
        const [, operator, rawValue] = operatorMatch;
        if (!filter[key]) {
          filter[key] = {};
        }
        filter[key][`$${operator}`] = parseQueryValue(rawValue);
        return;
      }

      filter[key] = parseQueryValue(item);
    });
  });

  return { filter, sort };
}

exports.getProducts = async (req, res) => {
  const { filter, sort } = buildFilter(req.query);
  const data = await ProductModel.find(filter).sort(sort);
  res.status(200).json({ status: 'success', data });
};

exports.getProductById = async (req, res) => {
  const data = await ProductModel.findById(req.params.id);

  if (!data) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }

  res.status(200).json({ status: 'success', data });
};

exports.createProduct = async (req, res) => {
  const newProduct = await ProductModel.create(req.body);
  res.status(201).json({ status: 'success', data: newProduct });
};

exports.updateProduct = async (req, res) => {
  const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedProduct) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }

  res.status(200).json({ status: 'success', data: updatedProduct });
};

exports.deleteProduct = async (req, res) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }

  res.status(200).json({ status: 'success', data: deletedProduct });
};
