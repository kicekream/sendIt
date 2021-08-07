"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserLogin = validateUserLogin;
exports.validateUserReg = validateUserReg;

var _joi = _interopRequireDefault(require("joi"));

function validateUserReg(userReg) {
  var schema = _joi["default"].object({
    firstname: _joi["default"].string().min(1).max(50).required(),
    lastname: _joi["default"].string().min(1).max(50).required(),
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().min(1).max(50).required()
  });

  return schema.validate(userReg);
}

;

function validateUserLogin(userLogin) {
  var schema = _joi["default"].object({
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().min(1).max(50).required()
  });

  return schema.validate(userLogin);
}

;