const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка сервера';
  res.status(statusCode).send({ message });
  next();
};

module.exports = handleError;
