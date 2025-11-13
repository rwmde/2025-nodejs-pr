const os = require("os");

module.exports = function getSystemInfo() {
  return {
    platform: os.platform(),
    cpu: os.cpus()[0].model.trim(),
    totalMem: (os.totalmem() / 1e9).toFixed(2) + " GB",
    freeMem: (os.freemem() / 1e9).toFixed(2) + " GB",
  };
};
