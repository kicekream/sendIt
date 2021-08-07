"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

var router = _express["default"].Router();

exports.router = router;
router.use(_express["default"].json());
var dir = __dirname;

var rawData = _fs["default"].readFileSync("".concat(dir, "/parcelDB.json"), "utf-8");

var parcels = JSON.parse(rawData);
router.get("/", function (req, res) {
  res.send("This is homepage");
});
router.get("/parcels", function (req, res) {
  if (parcels.length <= 0) {
    return res.status(404).send("No parcel information available");
  }

  res.json(parcels);
});
router.get("/parcels/:parcelId", function (req, res) {
  var parcelId = parseInt(req.params.parcelId);
  var singleParcelData = parcels.find(function (p) {
    return p.id === parcelId;
  });
  if (!singleParcelData) return res.status(404).send("Parcel with specified ID not found");
  res.json(singleParcelData);
});
router.get("/users/:userid/parcels", function (req, res) {
  var username = req.params.userid.toLowerCase();
  var userParcels = parcels.filter(function (p) {
    return p.parcelOwner === username;
  });
  if (!userParcels) return res.status(404).send("Parcel(s) with specified user not found");
  res.json(userParcels);
});
router.put("/parcels/:parcelId/cancel", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var parcelId, singleParcelData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parcelId = parseInt(req.params.parcelId);
            singleParcelData = parcels.find(function (p) {
              return p.id === parcelId;
            });

            if (singleParcelData) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", res.status(404).send("Parcel with specified ID not found"));

          case 4:
            singleParcelData.status = "Cancelled";
            parcels.splice(parcelId - 1, 1, singleParcelData);
            _context.prev = 6;
            _context.next = 9;
            return _fs["default"].promises.writeFile("".concat(dir, "/parcelDB.json"), JSON.stringify(parcels, null, 2), "utf-8");

          case 9:
            res.send("Parcel order Cancelled");
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](6);
            console.log(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 12]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post("/parcels", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var lastParcel, parcel;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            lastParcel = parcels[parcels.length - 1].id;
            parcel = {
              id: lastParcel + 1,
              parcelOwner: req.body.parcelOwner,
              status: "Created",
              createdAt: Date()
            };
            parcels.push(parcel);
            _context2.prev = 3;
            _context2.next = 6;
            return _fs["default"].promises.writeFile("".concat(dir, "/parcelDB.json"), JSON.stringify(parcels, null, 2), "utf-8");

          case 6:
            res.send("Parcel order successfully created");
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 9]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());