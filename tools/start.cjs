const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let port = 3000;
try {
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../.auth0.config.json"), "utf8"),
  );
  port = config.port || port;
} catch {
  // Config file doesn't exist yet, use default port
}

spawnSync("node_modules/.bin/http-server", ["-p", String(port), "-a", "localhost", "-c-1", "."], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
  shell: true,
});
