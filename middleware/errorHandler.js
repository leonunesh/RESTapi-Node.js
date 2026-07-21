module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'fail', message: 'Invalid ID format' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 'fail', message: err.message });
  }

  res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
};
