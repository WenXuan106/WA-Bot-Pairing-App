const fs = require("fs");

process.chdir(__dirname);
process.on("uncaughtException", (err) => console.error("[uncaughtException]", err && err.stack ? err.stack : err));
process.on("unhandledRejection", (err) => console.error("[unhandledRejection]", err && err.stack ? err.stack : err));

require("./icu-shim.js");

const path = require("path");
const os = require("os");
const tmpDir = path.join(__dirname, "tmp");
try { fs.mkdirSync(tmpDir, { recursive: true }); } catch (e) {}
os.tmpdir = () => tmpDir;
process.env.TMPDIR = tmpDir;

console.log("[main] starting bot on port", process.env.PORT || 3000);
require("./index.js");

(async () => {
  if (process.env.BOT_NO_IMAGES === "1") {
    console.log("[main] image commands are switched off (BOT_NO_IMAGES=1)");
    return;
  }
  try {
    console.log("[main] loading the image renderer…");
    const resvg = require("@resvg/resvg-wasm");
    await resvg.initWasm(fs.readFileSync(require.resolve("@resvg/resvg-wasm/index_bg.wasm")));
    global.__resvgWasmReady = true;
    console.log("[main] image renderer ready");
  } catch (err) {
    console.error("[main] image renderer failed to load (graph/weather/profile images won't work):", err && err.message);
  }
})();
