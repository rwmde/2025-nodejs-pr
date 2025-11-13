module.exports = function timestamp() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};
