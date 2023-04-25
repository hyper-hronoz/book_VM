class AddFuckingHeaders {
  addFuckingHeaders(req, res, next) {
    next();
  }
}

module.exports = new AddFuckingHeaders();
