const path = require("path");

function resolvePath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

module.exports = { resolvePath };
