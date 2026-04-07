const fs = require("fs");
const path = require("path");
const { detect } = require("detect-port");

const configPath = path.join(__dirname, "../.auth0.config.json");

let PORT = 3000;
try {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  PORT = config.port || PORT;
} catch {
  // Config file doesn't exist yet, use default port
}

detect(PORT)
  .then((port) => {
    if (port !== parseInt(PORT)) {
      console.error(`
❌ The port ${PORT} that is configured in Auth0 is currently in use.

To resolve this issue:
1. Free up port ${PORT} by stopping the application using it, OR
2. Configure URLs with a new port in your Auth0 application settings:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
   Then update the PORT environment variable accordingly
`);
      process.exit(1);
    }
    console.log(`✅ Port ${PORT} is available.`);
  })
  .catch((err) => {
    console.error("Error checking port availability:", err);
    process.exit(1);
  });
