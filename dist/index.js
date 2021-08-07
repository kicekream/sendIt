"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

require("dotenv/config");

var _pg = require("pg");

var _localParcel = require("./routes/localParcel");

var _auth = require("./routes/auth");

var app = (0, _express["default"])();
app.use(_express["default"].json());
var port = process.env.PORT || 3000; // const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// })

app.use("/v1/localParcel", _localParcel.router);
app.use("/v1/auth", _auth.router); // pool.on('connect', ()=> {
//     console.log("Postgres Database Connected");
// })

app.listen(port, function () {
  console.log("App started on port ".concat(port));
});