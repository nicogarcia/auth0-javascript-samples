const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function parseArgs(args) {
  const params = {};
  for (let i = 2; i < args.length; i += 2) {
    const key = args[i].replace("--", "");
    const value = args[i + 1];
    params[key] = value;
  }
  return params;
}

function readSdkVersion() {
  const doc = yaml.load(
    fs.readFileSync(path.join(__dirname, "../quickstart/quickstart-login.yaml"), "utf8"),
  );
  if (!doc.sdkVersion) throw new Error("Could not find sdkVersion in quickstart-login.yaml");
  return doc.sdkVersion;
}

try {
  const args = parseArgs(process.argv);

  if (!args.domain) {
    console.error("Error: --domain argument is required");
    console.error(
      "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
    );
    process.exit(1);
  }

  if (!args.clientId) {
    console.error("Error: --clientId argument is required");
    console.error(
      "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
    );
    process.exit(1);
  }

  const port = parseInt(args.port || "3000", 10);
  if (args.port && (isNaN(port) || port.toString() !== args.port.toString())) {
    console.error("Error: --port argument must be a valid number");
    console.error(
      "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
    );
    process.exit(1);
  }

  // Update index.html with real credentials via deterministic regex
  // Anchors on the param name inside createAuth0Client, replaces whatever is currently quoted
  const indexPath = path.join(__dirname, "../index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  const htmlBeforeDomain = html;
  html = html.replace(/(domain:\s*')[^']*(')/g, `$1${args.domain}$2`);
  const domainChanged = html !== htmlBeforeDomain;

  const htmlBeforeClientId = html;
  html = html.replace(/(clientId:\s*')[^']*(')/g, `$1${args.clientId}$2`);
  const clientIdChanged = html !== htmlBeforeClientId;

  const sdkVersion = readSdkVersion();
  const htmlBeforeSdkVersion = html;
  html = html.replace(/(auth0-spa-js\/)[^/]*(\/auth0-spa-js)/g, `$1${sdkVersion}$2`);
  const sdkVersionChanged = html !== htmlBeforeSdkVersion;

  if (domainChanged || clientIdChanged || sdkVersionChanged) {
    fs.writeFileSync(indexPath, html);
    console.log("Auth0 configuration has been written to: index.html");
  }

  // Write .auth0.config.json for the dev server port (not used by the browser)
  const configJsonPath = path.join(__dirname, "../.auth0.config.json");
  let existingPort = null;
  try {
    existingPort = JSON.parse(fs.readFileSync(configJsonPath, "utf8")).port;
  } catch {
    // File doesn't exist yet
  }
  const portChanged = existingPort !== port;
  if (portChanged) {
    fs.writeFileSync(configJsonPath, JSON.stringify({ port }, null, 2) + "\n");
    console.log("Port configuration has been written to: .auth0.config.json");
  }

  if (!domainChanged && !clientIdChanged && !sdkVersionChanged && !portChanged) {
    console.log("No changes needed, configuration unchanged");
  }

  console.log("Config keys state:");
  console.log(`  domain: ${domainChanged ? "updated" : "already up to date"}`);
  console.log(`  clientId: ${clientIdChanged ? "updated" : "already up to date"}`);
  console.log(`  sdkVersion: ${sdkVersionChanged ? "updated" : "already up to date"}`);
  console.log(`  port: ${portChanged ? "updated" : "already up to date"}`);
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
}
