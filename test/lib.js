//testing numbers

module.exports.absolute = function (number) {
  return number >= 0 ? number : -number;
};

module.exports.getCurrencies = function() {
  return ["NGN", "USD", "EUR"];
};

module.exports.getPrice = function(productId) {
    return {id: productId, price: 10}
};

module.exports.registerUser = function(username) {
    if(!username) throw new Error("Username is required");

    return {id: new Date().getTime(), username}
}