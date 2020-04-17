const formatErrors = (e) => {
  if (e.name === 'ValidationError') {
    return Object.keys(e.errors).map((key) => e.errors[key].properties);
  }
  if (e.name === 'MongoError' && e.code === 11000) {
    const path = Object.keys(e.keyPattern)[0];
    return [{ type: 'duplicate key', path, message: 'This user already exists' }];
  }
  return e;
};

module.exports = formatErrors;
