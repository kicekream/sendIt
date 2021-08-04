"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

console.log("see oooo");
var dir = __dirname;
var data = {
  name: "ola",
  age: "miji"
};
data = JSON.stringify(data);

function rytFyl() {
  return _rytFyl.apply(this, arguments);
}

function _rytFyl() {
  _rytFyl = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _fs["default"].promises.writeFile("".concat(dir, "/parcel.json"), data);

          case 3:
            return _context.abrupt("return", data);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", "error");

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));
  return _rytFyl.apply(this, arguments);
}

console.log(rytFyl());