const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  req.user = {
    id: "69f89c9a0bd7080f43ba43f5",
    _id: "69f89c9a0bd7080f43ba43f5",
  };
  next();
};
