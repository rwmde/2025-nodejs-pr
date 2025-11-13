const os = require("os");

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

function timestamp() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

function formatSimple(message, args) {
  const formattedArgs = args.map((a) => pretty(a)).join(" ");
  return `[${timestamp()}] INFO ${message}${
    formattedArgs ? " " + formattedArgs : ""
  }`;
}

function formatVerbose(message, args) {
  const formattedArgs = args.map((a) => pretty(a)).join(" ");

  const sys = {
    platform: os.platform(),
    cpu: os.cpus()[0].model.trim(),
    totalMem: (os.totalmem() / 1e9).toFixed(2) + " GB",
    freeMem: (os.freemem() / 1e9).toFixed(2) + " GB",
  };

  const systemBlock =
    `SYSTEM:\n` +
    `   platform: ${sys.platform}\n` +
    `   cpu: ${sys.cpu}\n` +
    `   totalMem: ${sys.totalMem}\n` +
    `   freeMem: ${sys.freeMem}`;

  const logLine = `[${timestamp()}][VERBOSE] ${message}${
    formattedArgs ? " " + formattedArgs : ""
  }`;

  return { logLine, systemBlock };
}

module.exports = { formatSimple, formatVerbose };
