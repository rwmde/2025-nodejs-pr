const fs = require("fs");
const path = require("path");

function saveToJSON(data, filePath) {
  const absolutePath = path.resolve(filePath);
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(absolutePath, json, "utf-8");
}

function loadJSON(filePath) {
  const absolutePath = path.resolve(filePath);
  const json = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(json);
}

module.exports = {
  saveToJSON,
  loadJSON,
};
