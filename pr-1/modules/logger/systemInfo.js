const os = require("os");

module.exports.getInfo = () => ({
  timestamp: new Date().toISOString(),
  platform: os.platform(),
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
  cpu: os.cpus()[0].model,
});
