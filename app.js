const express = require('express');
const mongoose = require('mongoose');
const ProductModel = require('./ProductModel');
const PersonModel = require('./PersonModel');

const app = express();
app.use(express.json());

const connectionString = 'mongodb://<username>:<password>@ac-yeplson-shard-00-00.ctdfb6d.mongodb.net:27017,ac-yeplson-shard-00-01.ctdfb6d.mongodb.net:27017,ac-yeplson-shard-00-02.ctdfb6d.mongodb.net:27017/?ssl=true&replicaSet=atlas-h00mv1-shard-0&authSource=admin&appName=myCluster1';
const port = process.env.PORT || 3000;

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

app.get('/api/v1/product', async (req, res, next) => {
    try {
        const { filter, sort } = buildFilter(req.query);
        const data = await ProductModel.find(filter).sort(sort);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error.message });
    }
});

app.get('/api/v1/person', async (req, res, next) => {
    try {
        const { filter, sort } = buildFilter(req.query);
        const data = await PersonModel.find(filter).sort(sort);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error.message });
    }
});

app.get('/api/v1/people', async (req, res, next) => {
    try {
        const { filter, sort } = buildFilter(req.query);
        const data = await PersonModel.find(filter).sort(sort);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error.message });
    }
});

app.get('/api/v1/person/stats', async (req, res, next) => {
    try {
        const stats = await PersonModel.aggregate([
            {
                $group: {
                    _id: null,
                    averageSalary: { $avg: '$salary' },
                    minSalary: { $min: '$salary' },
                    maxSalary: { $max: '$salary' }
                }
            }
        ]);

        const result = stats[0] || { averageSalary: 0, minSalary: 0, maxSalary: 0 };
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error.message });
    }
});

app.get('/api/v1/product/:id', async (req, res, next) => {
    try {
        const data = await ProductModel.findById(req.params.id);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error.message });
    }
});

app.get('/api/v1/person/:id', async (req, res, next) => {
    try {
        const data = await PersonModel.findById(req.params.id);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error.message });
    }
});


app.post('/api/v1/product', async (req, res, next) => {
    try {
        const product = req.body;
        const newProduct = await ProductModel.create(
            product);
        res.status(201).json({ status: 'success', data: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/v1/person', async (req, res, next) => {
    try {
        const person = req.body;
        const newPerson = await PersonModel.create(person);
        res.status(201).json({ status: 'success', data: newPerson });
    } catch (error) {
        console.error('Error creating person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/v1/product/:id', async (req, res, next) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({ status: 'success', data: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/v1/person/:id', async (req, res, next) => {
    try {
        const updatedPerson = await PersonModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPerson) {
            return res.status(404).json({ status: 'fail', message: 'Person not found' });
        }
        res.status(200).json({ status: 'success', data: updatedPerson });
    } catch (error) {
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/v1/product/:id', async (req, res, next) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({ status: 'success', data: deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/v1/person/:id', async (req, res, next) => {
    try {
        const deletedPerson = await PersonModel.findByIdAndDelete(req.params.id);
        if (!deletedPerson) {
            return res.status(404).json({ status: 'fail', message: 'Person not found' });
        }
        res.status(200).json({ status: 'success', data: deletedPerson });
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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